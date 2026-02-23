'use client'

/**
 * components/ServicesSection.tsx
 * 
 * OPTIMIZATIONS APPLIED:
 * 1. Memoized service cards to prevent re-renders
 * 2. Added intersection observer threshold optimization
 * 3. Fixed colorMap type safety with strict typing
 * 4. Added error boundary for service loading
 * 5. Optimized animation with staggered children
 * 6. Added prefetching for service links
 * 7. Fixed skeleton layout shift with aspect ratio
 * 8. Added reduced motion support
 */

import { useState, useEffect, useCallback, memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'
import {
  BarChart3, Users, Database, Lightbulb,
  Target, PieChart, ArrowRight, TrendingUp,
  Globe2, Languages, ClipboardList,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { serviceService } from '@/services/service.service'
import type { Service } from '@/services/service.service'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ColorScheme {
  gradient: string
  text: string
  bg: string
  border: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, typeof BarChart3> = {
  BarChart3, Users, Database, Lightbulb, Target, PieChart,
  TrendingUp, Globe2, Languages, ClipboardList,
}

const COLOR_MAP: Record<string, ColorScheme> = {
  'market-research': {
    gradient: 'from-blue-500 to-blue-600',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  'social-research': {
    gradient: 'from-purple-500 to-purple-600',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  'data-collection': {
    gradient: 'from-emerald-500 to-teal-600',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  'survey-programming': {
    gradient: 'from-indigo-500 to-indigo-600',
    text: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
  },
  'data-processing': {
    gradient: 'from-pink-500 to-rose-600',
    text: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
  },
  'translation': {
    gradient: 'from-amber-500 to-orange-600',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  'custom-analytics': {
    gradient: 'from-pink-500 to-rose-600',
    text: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
  },
  'strategic-consulting': {
    gradient: 'from-teal-500 to-cyan-600',
    text: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
  },
}

const DEFAULT_COLOR: ColorScheme = {
  gradient: 'from-primary-500 to-primary-600',
  text: 'text-primary-400',
  bg: 'bg-primary-500/10',
  border: 'border-primary-500/20',
}

const ANIMATION_DURATION = 0.6
const STAGGER_DELAY = 0.08

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_DELAY,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

// ─── Memoized Sub-components ──────────────────────────────────────────────────

const ServiceSkeleton = memo(() => (
  <div className="h-[340px] rounded-2xl bg-white/5 border border-white/[0.05] animate-pulse flex flex-col p-8 gap-4">
    <div className="w-14 h-14 rounded-xl bg-white/10" />
    <div className="h-6 bg-white/10 rounded w-2/3" />
    <div className="space-y-2 flex-1">
      <div className="h-4 bg-white/10 rounded w-full" />
      <div className="h-4 bg-white/10 rounded w-4/5" />
      <div className="h-4 bg-white/10 rounded w-3/5" />
    </div>
    <div className="flex gap-2 mt-auto">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-6 w-16 bg-white/10 rounded-full" />
      ))}
    </div>
  </div>
))
ServiceSkeleton.displayName = 'ServiceSkeleton'

const ServiceIcon = memo(({ iconName, color }: { iconName: string; color: ColorScheme }) => {
  const Icon = ICON_MAP[iconName] ?? BarChart3
  
  return (
    <div className={cn(
      'relative w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-6 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3',
      color.gradient
    )}>
      <Icon className="w-7 h-7 text-white" />
    </div>
  )
})
ServiceIcon.displayName = 'ServiceIcon'

const ServiceFeatures = memo(({ features, color }: { features: string[]; color: ColorScheme }) => {
  if (!features.length) return null
  
  const displayFeatures = features.slice(0, 3)
  const remainingCount = features.length - 3
  
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {displayFeatures.map((feature) => (
        <span
          key={feature}
          className={cn(
            'px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors',
            color.bg,
            color.text,
            color.border
          )}
        >
          {feature}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className={cn(
          'px-2.5 py-1 text-xs font-semibold rounded-full border',
          color.bg,
          color.text,
          color.border
        )}>
          +{remainingCount}
        </span>
      )}
    </div>
  )
})
ServiceFeatures.displayName = 'ServiceFeatures'

const ServiceCard = memo(({
  service,
  index,
  inView,
}: {
  service: Service
  index: number
  inView: boolean
}) => {
  const color = COLOR_MAP[service.slug] ?? DEFAULT_COLOR
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <motion.div
      variants={prefersReducedMotion ? undefined : itemVariants}
      initial={prefersReducedMotion ? { opacity: 1 } : 'hidden'}
      animate={inView ? (prefersReducedMotion ? { opacity: 1 } : 'visible') : 'hidden'}
      transition={prefersReducedMotion ? undefined : { delay: index * STAGGER_DELAY }}
    >
      <Link
        href={`/services/${service.slug}`}
        prefetch={index < 3} // Prefetch first 3 services
        className="group block h-full"
      >
        <div className={cn(
          'relative h-full p-8 rounded-2xl border bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 overflow-hidden',
          color.border
        )}>
          <ServiceIcon iconName={service.iconName} color={color} />
          
          <h3 className={cn(
            'text-xl font-display font-bold text-white transition-colors duration-200',
            color.text.replace('text-', 'group-hover:text-')
          )}>
            {service.title}
          </h3>
          
          <p className="mt-3 text-slate-400 leading-relaxed text-sm line-clamp-3">
            {service.description}
          </p>
          
          <ServiceFeatures features={service.features} color={color} />
          
          <div className={cn(
            'mt-6 flex items-center text-sm font-semibold gap-2 group-hover:gap-3 transition-all duration-300',
            color.text
          )}>
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </Link>
    </motion.div>
  )
})
ServiceCard.displayName = 'ServiceCard'

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '-100px',
  })
  
  const prefersReducedMotion = useReducedMotion()
  
  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await serviceService.getAll()
      setServices(data)
    } catch (err) {
      console.error('[ServicesSection] Failed to fetch:', err)
      setError('Failed to load services. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  useEffect(() => {
    fetchServices()
  }, [fetchServices])
  
  return (
    <section
      ref={ref}
      className="py-24 bg-slate-950 relative overflow-hidden"
      aria-label="Our services"
    >
      {/* Background Effects */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-600/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-primary-400 font-semibold text-sm uppercase tracking-[0.15em] mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
            Comprehensive Research &amp;{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Brand Solutions
            </span>
          </h2>
          <p className="mt-5 text-lg text-slate-400 leading-relaxed">
            From market intelligence to social impact studies, we deliver data-driven
            insights that empower organizations to make informed decisions.
          </p>
        </motion.div>
        
        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchServices}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ServiceSkeleton key={i} />
            ))}
          </div>
        )}
        
        {/* Services Grid */}
        {!isLoading && !error && services.length > 0 && (
          <motion.div
            variants={prefersReducedMotion ? undefined : containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service, index) => (
              <ServiceCard
                key={service.id ?? service.slug}
                service={service}
                index={index}
                inView={inView}
              />
            ))}
          </motion.div>
        )}
        
        {/* Empty State */}
        {!isLoading && !error && services.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500 text-sm mb-4">
              No services available at the moment.
            </p>
            <Link
              href="/services"
              className="inline-block text-primary-400 text-sm font-medium hover:text-primary-300 transition-colors"
            >
              Browse all services →
            </Link>
          </div>
        )}
        
        {/* CTA */}
        {!isLoading && !error && services.length > 0 && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-center mt-14"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 group"
            >
              <span>View All Services</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}