'use client'

import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import { motion } from 'framer-motion'
import { TrendingUp, Users, FileCheck, Globe } from 'lucide-react'

const stats = [
  {
    id: 1,
    value: 100,
    suffix: '+',
    label: 'Projects Completed',
    description: 'Successful research projects delivered',
    icon: FileCheck,
    color: 'text-primary-400',
    bgColor: 'bg-primary-500/10',
    borderColor: 'border-primary-500/20',
    glowColor: 'shadow-primary-500/10',
  },
  {
    id: 2,
    value: 50000,
    suffix: '+',
    label: 'Survey Responses',
    description: 'Data points collected and analyzed',
    icon: TrendingUp,
    color: 'text-accent-400',
    bgColor: 'bg-accent-500/10',
    borderColor: 'border-accent-500/20',
    glowColor: 'shadow-accent-500/10',
  },
  {
    id: 3,
    value: 50,
    suffix: '+',
    label: 'Happy Clients',
    description: 'Organizations trust our insights',
    icon: Users,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    glowColor: 'shadow-emerald-500/10',
  },
  {
    id: 4,
    value: 15,
    suffix: '+',
    label: 'States Covered',
    description: 'Pan-India research presence',
    icon: Globe,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    glowColor: 'shadow-orange-500/10',
  },
]

export default function StatsSection() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  return (
    <section ref={ref} className="py-20 bg-slate-900 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.12, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className={`relative group p-6 md:p-8 rounded-2xl border ${stat.borderColor} bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm transition-all duration-300 shadow-xl ${stat.glowColor} text-center`}
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 ${stat.bgColor} rounded-xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>

              {/* Number */}
              <div className={`text-4xl md:text-5xl font-display font-bold ${stat.color} tabular-nums`}>
                {inView ? (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    separator=","
                    suffix={stat.suffix}
                  />
                ) : (
                  `0${stat.suffix}`
                )}
              </div>

              <h3 className="mt-2 text-base font-semibold text-white/90">
                {stat.label}
              </h3>
              <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                {stat.description}
              </p>

              {/* Bottom accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.4 + index * 0.12, duration: 0.6 }}
                className={`absolute bottom-0 left-8 right-8 h-px ${stat.bgColor} origin-left rounded-full`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}