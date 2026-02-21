'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

// Sample testimonials (will be fetched from CMS in production)
const testimonials = [
  {
    id: 1,
    quote: "Avance Insights delivered exceptional market research that helped us understand our customers better. Their insights directly impacted our product strategy and led to a 30% increase in customer satisfaction.",
    author: 'Rajesh Kumar',
    role: 'Head of Strategy',
    company: 'Leading FMCG Company',
    avatar: null,
    rating: 5,
  },
  {
    id: 2,
    quote: "The social impact assessment conducted by Avance was thorough and insightful. Their team's expertise in rural research is unmatched. They helped us refine our CSR initiatives with data-driven recommendations.",
    author: 'Dr. Priya Sharma',
    role: 'Director',
    company: 'National NGO',
    avatar: null,
    rating: 5,
  },
  {
    id: 3,
    quote: "Working with Avance Insights on our brand positioning study was a game-changer. Their analytical approach and clear communication made the complex data actionable for our marketing team.",
    author: 'Amit Verma',
    role: 'Marketing Director',
    company: 'Tech Startup',
    avatar: null,
    rating: 5,
  },
  {
    id: 4,
    quote: "The data collection quality and turnaround time exceeded our expectations. Avance's field team covered 15 states seamlessly, providing us with reliable data for our policy research.",
    author: 'Meera Patel',
    role: 'Research Manager',
    company: 'Government Agency',
    avatar: null,
    rating: 5,
  },
]

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section ref={ref} className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950/60 via-slate-950 to-slate-950" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-600/10 rounded-full blur-[80px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="inline-block text-primary-400 font-semibold text-sm uppercase tracking-[0.15em] mb-4"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white leading-tight"
          >
            What Our Clients Say
          </motion.h2>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative px-4 md:px-16 py-10"
            >
              {/* Decorative quote marks */}
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                  <Quote className="w-7 h-7 text-primary-400" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex justify-center gap-1 mb-8">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote text */}
              <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-slate-200 text-center">
                &ldquo;{testimonials[current].quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="mt-10 flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xl font-bold text-white mb-4 font-display shadow-lg shadow-primary-900/30">
                  {testimonials[current].author.charAt(0)}
                </div>
                <p className="text-lg font-bold text-white">{testimonials[current].author}</p>
                <p className="text-primary-400 text-sm mt-1 font-medium">
                  {testimonials[current].role}, {testimonials[current].company}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-5 mt-8">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 flex items-center justify-center transition-all duration-200 group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    current === index
                      ? 'w-8 bg-primary-400'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  )}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-11 h-11 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 flex items-center justify-center transition-all duration-200 group"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}