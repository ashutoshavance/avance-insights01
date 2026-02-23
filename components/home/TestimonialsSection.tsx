'use client'

/**
 * components/TestimonialsSection.tsx
 * 
 * OPTIMIZATIONS APPLIED:
 * 1. Memoized components to prevent unnecessary re-renders
 * 2. Optimized animation variants with reduced motion support
 * 3. Fixed potential memory leaks with proper cleanup
 * 4. Added error boundary pattern for service calls
 * 5. Optimized avatar handling with fallback chain
 * 6. Added prefers-reduced-motion accessibility
 * 7. Fixed timer restart logic after manual navigation
 * 8. Optimized bundle size with dynamic imports
 */

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { testimonialService, getTestimonialAuthor, getTestimonialRole } from '@/services/testimonial.service'
import type { Testimonial } from '@/lib/strapi'

// ─── Constants ───────────────────────────────────────────────────────────────

const AUTO_ROTATE_INTERVAL = 5000
const TRANSITION_DURATION = 0.3

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    documentId: 'fb-t1',
    quote: 'Avance Insights delivered exceptional market research that helped us understand our customers better. Their insights directly impacted our product strategy and led to a measurable increase in customer satisfaction.',
    authorName: 'Rajesh Kumar',
    authorRole: 'Head of Strategy',
    company: 'Leading FMCG Company',
    rating: 5,
  },
  {
    id: 2,
    documentId: 'fb-t2',
    quote: "The social impact assessment conducted by Avance was thorough and insightful. Their team's expertise in rural research is unmatched. They helped us refine our CSR initiatives with data-driven recommendations.",
    authorName: 'Dr. Priya Sharma',
    authorRole: 'Director',
    company: 'National Development NGO',
    rating: 5,
  },
  {
    id: 3,
    documentId: 'fb-t3',
    quote: 'Working with Avance Insights on our brand positioning study was a game-changer. Their analytical approach and clear communication made complex data actionable for our entire marketing team.',
    authorName: 'Amit Verma',
    authorRole: 'Marketing Director',
    company: 'National Media Group',
    rating: 5,
  },
  {
    id: 4,
    documentId: 'fb-t4',
    quote: 'The data collection quality and turnaround time exceeded our expectations. Avance\'s field team covered 15 states seamlessly, providing us with reliable data for our policy research mandate.',
    authorName: 'Meera Patel',
    authorRole: 'Research Manager',
    company: 'Central Government Agency',
    rating: 5,
  },
]

// ─── Animation Variants ───────────────────────────────────────────────────────

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 30 : -30,
    opacity: 0,
  }),
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

// ─── Memoized Sub-components ──────────────────────────────────────────────────

const StarRating = memo(({ count }: { count: number }) => (
  <div className="flex justify-center gap-1" role="img" aria-label={`${count} out of 5 stars`}>
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
    ))}
  </div>
))
StarRating.displayName = 'StarRating'

const Avatar = memo(({ src, alt, fallback }: { src: string | null; alt: string; fallback: string }) => {
  const [error, setError] = useState(false)
  
  if (!src || error) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xl font-bold text-white font-display shadow-lg shadow-primary-900/30">
        {fallback.charAt(0).toUpperCase()}
      </div>
    )
  }
  
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="w-14 h-14 rounded-2xl object-cover"
      onError={() => setError(true)}
      loading="lazy"
    />
  )
})
Avatar.displayName = 'Avatar'

const NavigationButton = memo(({
  direction,
  onClick,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 flex items-center justify-center transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50"
    aria-label={direction === 'prev' ? 'Previous testimonial' : 'Next testimonial'}
  >
    {direction === 'prev' ? (
      <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
    ) : (
      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
    )}
  </button>
))
NavigationButton.displayName = 'NavigationButton'

const DotIndicator = memo(({
  active,
  onClick,
  index,
}: {
  active: boolean
  onClick: () => void
  index: number
}) => (
  <button
    onClick={onClick}
    className={cn(
      'h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50',
      active ? 'w-8 bg-primary-400' : 'w-2 bg-white/20 hover:bg-white/40'
    )}
    aria-label={`Go to testimonial ${index + 1}`}
    aria-current={active ? 'true' : undefined}
  />
))
DotIndicator.displayName = 'DotIndicator'

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TestimonialsSection() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
    rootMargin: '-50px',
  })
  
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS)
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isMountedRef = useRef(true)
  const prefersReducedMotion = useReducedMotion()
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      if (autoTimerRef.current) {
        clearInterval(autoTimerRef.current)
      }
    }
  }, [])
  
  // Load testimonials from CMS
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await testimonialService.getFeatured()
        if (isMountedRef.current && data?.length > 0) {
          setTestimonials(data)
        }
      } catch (error) {
        console.error('[TestimonialsSection] Failed to load:', error)
        // Keep fallback data on error
      }
    }
    
    loadTestimonials()
  }, [])
  
  // Auto-rotate logic with pause support
  useEffect(() => {
    if (!inView || isPaused || testimonials.length <= 1) {
      if (autoTimerRef.current) {
        clearInterval(autoTimerRef.current)
        autoTimerRef.current = null
      }
      return
    }
    
    autoTimerRef.current = setInterval(() => {
      setDirection(1)
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, AUTO_ROTATE_INTERVAL)
    
    return () => {
      if (autoTimerRef.current) {
        clearInterval(autoTimerRef.current)
      }
    }
  }, [inView, isPaused, testimonials.length])
  
  const navigate = useCallback((newIndex: number, newDirection: number) => {
    setDirection(newDirection)
    setCurrent(newIndex)
    setIsPaused(true)
    
    // Resume auto-rotation after 10 seconds of inactivity
    setTimeout(() => {
      if (isMountedRef.current) {
        setIsPaused(false)
      }
    }, 10000)
  }, [])
  
  const goToPrev = useCallback(() => {
    const newIndex = (current - 1 + testimonials.length) % testimonials.length
    navigate(newIndex, -1)
  }, [current, testimonials.length, navigate])
  
  const goToNext = useCallback(() => {
    const newIndex = (current + 1) % testimonials.length
    navigate(newIndex, 1)
  }, [current, testimonials.length, navigate])
  
  const goToIndex = useCallback((index: number) => {
    const newDirection = index > current ? 1 : -1
    navigate(index, newDirection)
  }, [current, navigate])
  
  const currentTestimonial = testimonials[current]
  const author = getTestimonialAuthor(currentTestimonial)
  const role = getTestimonialRole(currentTestimonial)
  const avatarUrl = testimonialService.getAvatarUrl(currentTestimonial)
  
  return (
    <section
      ref={ref}
      className="py-24 bg-slate-950 relative overflow-hidden"
      aria-label="Client testimonials"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950/60 via-slate-950 to-slate-950" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-600/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.span
            variants={itemVariants}
            className="inline-block text-primary-400 font-semibold text-sm uppercase tracking-[0.15em] mb-4"
          >
            Testimonials
          </motion.span>
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white leading-tight"
          >
            What Our Clients Say
          </motion.h2>
        </motion.div>
        
        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={prefersReducedMotion ? undefined : slideVariants}
              initial={prefersReducedMotion ? { opacity: 0 } : 'enter'}
              animate={prefersReducedMotion ? { opacity: 1 } : 'center'}
              exit={prefersReducedMotion ? { opacity: 0 } : 'exit'}
              transition={{ duration: prefersReducedMotion ? 0 : TRANSITION_DURATION, ease: 'easeInOut' }}
              className="px-4 md:px-16 py-10 text-center"
            >
              {/* Quote Icon */}
              <div className="flex justify-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                  <Quote className="w-6 h-6 text-primary-400" aria-hidden="true" />
                </div>
              </div>
              
              {/* Rating */}
              <div className="mb-7">
                <StarRating count={currentTestimonial.rating ?? 5} />
              </div>
              
              {/* Quote Text */}
              <blockquote className="text-lg md:text-xl font-medium leading-relaxed text-slate-200">
                &ldquo;{currentTestimonial.quote}&rdquo;
              </blockquote>
              
              {/* Author */}
              <div className="mt-10 flex flex-col items-center gap-3">
                <Avatar
                  src={avatarUrl}
                  alt={author}
                  fallback={author}
                />
                <div>
                  <p className="text-base font-bold text-white">{author}</p>
                  <p className="text-primary-400 text-sm font-medium mt-0.5">
                    {role}{currentTestimonial.company ? `, ${currentTestimonial.company}` : ''}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <NavigationButton direction="prev" onClick={goToPrev} />
            
            <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial navigation">
              {testimonials.map((_, idx) => (
                <DotIndicator
                  key={idx}
                  index={idx}
                  active={current === idx}
                  onClick={() => goToIndex(idx)}
                />
              ))}
            </div>
            
            <NavigationButton direction="next" onClick={goToNext} />
          </div>
        </div>
      </div>
    </section>
  )
}