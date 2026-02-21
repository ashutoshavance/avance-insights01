'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// Sample client names (logos will come from CMS)
const clients = [
  { id: 1, name: 'Times of India' },
  { id: 2, name: 'TATA Group' },
  { id: 3, name: 'Sony' },
  { id: 4, name: 'Hindustan Unilever' },
  { id: 5, name: 'ICICI Bank' },
  { id: 6, name: 'Reliance' },
  { id: 7, name: 'Godrej' },
  { id: 8, name: 'Nestle' },
  { id: 9, name: 'Airtel' },
  { id: 10, name: 'HDFC' },
  { id: 11, name: 'ITC' },
  { id: 12, name: 'Mahindra' },
]

export default function ClientsSection() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-[0.15em] mb-4"
          >
            Trusted By
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title mt-2"
          >
            Our Valued Clients
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="section-subtitle mt-4 mx-auto"
          >
            We've partnered with leading organizations across industries to deliver 
            actionable insights and drive growth.
          </motion.p>
        </div>

        {/* Client Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {clients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.04 * index, duration: 0.5 }}
              className="group flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-100 bg-white hover:border-primary-200 hover:shadow-lg hover:shadow-primary-50 transition-all duration-300 cursor-default"
            >
              {/* Logo placeholder */}
              <div className="w-14 h-14 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-primary-50 group-hover:to-primary-100 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-105">
                <span className="text-xl font-bold text-slate-400 group-hover:text-primary-600 transition-colors font-display">
                  {client.name.charAt(0)}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium text-center group-hover:text-slate-700 transition-colors leading-tight">
                {client.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55 }}
          className="mt-16 pt-12 border-t border-slate-100"
        >
          <div className="text-center">
            <p className="text-sm text-slate-500 uppercase tracking-widest font-medium mb-6">
              Certified & Accredited
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['MRSI Member', 'MSME Registered', 'ISO 9001:2015'].map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-3 px-6 py-3.5 bg-white border border-slate-200 hover:border-primary-300 hover:shadow-md hover:shadow-primary-50 rounded-xl transition-all duration-200 group cursor-default"
                >
                  <div className="w-8 h-8 bg-primary-50 group-hover:bg-primary-100 rounded-full flex items-center justify-center transition-colors flex-shrink-0">
                    <svg className="w-4 h-4 text-primary-600" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="font-semibold text-slate-700 text-sm">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}