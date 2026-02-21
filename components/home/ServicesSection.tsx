'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'
import {
  BarChart3,
  Users,
  Database,
  Lightbulb,
  Target,
  PieChart,
  ArrowRight,
  LucideIcon
} from 'lucide-react'
import { serviceService } from '@/services/service.service'
import { Service } from '@/types/service'

const iconMap: Record<string, LucideIcon> = {
  'BarChart3': BarChart3,
  'Users': Users,
  'Database': Database,
  'Lightbulb': Lightbulb,
  'Target': Target,
  'PieChart': PieChart,
}

const colorMap: Record<string, { gradient: string; text: string; bg: string; border: string }> = {
  'market-research':      { gradient: 'from-blue-500 to-blue-600',    text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20' },
  'social-research':      { gradient: 'from-purple-500 to-purple-600', text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  'data-collection':      { gradient: 'from-emerald-500 to-teal-600',  text: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/20' },
  'brand-solutions':      { gradient: 'from-orange-500 to-amber-600',  text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  'custom-analytics':     { gradient: 'from-pink-500 to-rose-600',     text: 'text-pink-400',   bg: 'bg-pink-500/10',   border: 'border-pink-500/20' },
  'strategic-consulting': { gradient: 'from-teal-500 to-cyan-600',     text: 'text-teal-400',   bg: 'bg-teal-500/10',   border: 'border-teal-500/20' },
}

const defaultColor = { gradient: 'from-primary-500 to-primary-600', text: 'text-primary-400', bg: 'bg-primary-500/10', border: 'border-primary-500/20' }

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceService.getAll()
        setServices(data)
      } catch (error) {
        console.error('Failed to fetch services:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchServices()
  }, [])

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section ref={ref} className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="inline-block text-primary-400 font-semibold text-sm uppercase tracking-[0.15em] mb-4"
          >
            Our Services
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white leading-tight"
          >
            Comprehensive Research &{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Brand Solutions
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="mt-5 text-lg text-slate-400 leading-relaxed"
          >
            From market intelligence to social impact studies, we deliver data-driven 
            insights that empower organizations to make informed decisions.
          </motion.p>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {/* Services Grid */}
        {!isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = iconMap[service.iconName] || BarChart3
              const color = colorMap[service.slug] || defaultColor

              return (
                <motion.div
                  key={service.id || index}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.08 * index, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Link href={`/services/${service.slug}`}>
                    <div className={`group relative h-full p-8 rounded-2xl border ${color.border} bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 overflow-hidden`}>
                      {/* Hover glow */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${color.gradient} blur-2xl -z-10`} style={{ opacity: 0 }} />

                      {/* Icon */}
                      <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${color.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className={`text-xl font-display font-bold text-white group-hover:${color.text} transition-colors duration-200`}>
                        {service.title}
                      </h3>
                      <p className="mt-3 text-slate-400 leading-relaxed text-sm">
                        {service.description}
                      </p>

                      {/* Features */}
                      <div className="mt-6 flex flex-wrap gap-2">
                        {service.features.map((feature) => (
                          <span
                            key={feature}
                            className={`px-3 py-1 ${color.bg} ${color.text} text-xs font-medium rounded-full border ${color.border}`}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* Link */}
                      <div className={`mt-6 flex items-center ${color.text} text-sm font-semibold gap-2 group-hover:gap-3 transition-all`}>
                        Learn More
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>

                      {/* Bottom accent */}
                      <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${color.text.replace('text-', 'via-')}/20 to-transparent`} />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-14"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl backdrop-blur-sm transition-all duration-300"
          >
            View All Services
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}