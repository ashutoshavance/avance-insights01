'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Phone, Mail, MessageSquare } from 'lucide-react'

export default function CTASection() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-white to-accent-50/50" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent" />

      {/* Decorative blobs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary-100/60 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-accent-100/60 rounded-full blur-[80px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl border border-primary-100 bg-white shadow-2xl shadow-primary-100/50 overflow-hidden p-10 md:p-16 text-center"
          >
            {/* Inner accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-500 rounded-t-3xl" />

            <motion.span
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-[0.15em] mb-5"
            >
              Get Started
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight"
            >
              Ready to Transform Your Business with{' '}
              <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                Data-Driven Insights?
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed"
            >
              Let's discuss how our research expertise can help you make informed decisions, 
              understand your market better, and drive growth.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-300 w-full sm:w-auto shadow-lg shadow-primary-200 hover:shadow-primary-300 hover:-translate-y-0.5"
              >
                Schedule a Consultation
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/surveys"
                className="group inline-flex items-center justify-center px-8 py-4 border border-slate-200 hover:border-primary-300 bg-white hover:bg-primary-50 text-slate-700 hover:text-primary-700 font-semibold rounded-xl transition-all duration-300 w-full sm:w-auto hover:-translate-y-0.5"
              >
                <MessageSquare className="mr-2 w-5 h-5" />
                Participate in Surveys
              </Link>
            </motion.div>

            {/* Quick Contact Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-6"
            >
              <a
                href="tel:+919999999999"
                className="flex items-center gap-3 text-slate-600 hover:text-primary-600 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                  <Phone className="w-4 h-4 text-primary-600" />
                </div>
                <span className="font-medium text-sm">+91 99999 99999</span>
              </a>
              <div className="w-px h-8 bg-slate-200 hidden sm:block" />
              <a
                href="mailto:info@avanceinsights.in"
                className="flex items-center gap-3 text-slate-600 hover:text-primary-600 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                  <Mail className="w-4 h-4 text-primary-600" />
                </div>
                <span className="font-medium text-sm">info@avanceinsights.in</span>
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="mt-10 pt-8 border-t border-slate-100"
            >
              <p className="text-sm text-slate-400 mb-4">
                Join 50+ organizations that trust Avance Insights
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
                {[
                  'Quick Response Time',
                  'Free Initial Consultation',
                  'Customized Solutions',
                ].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}