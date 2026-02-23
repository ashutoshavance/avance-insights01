'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ChevronDown, ShieldCheck, BarChart2, Globe } from 'lucide-react'
import dynamic from 'next/dynamic'

const HeroVisual = dynamic(() => import('./HeroVisual'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-primary-900/30 to-slate-900/30 rounded-2xl animate-pulse" />
  ),
})

const CREDIBILITY_BADGES = [
  { icon: ShieldCheck, label: 'MRSI Member' },
  { icon: BarChart2,   label: 'MSME Registered' },
  { icon: Globe,       label: 'ISO 9001:2015' },
]

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-primary-950 to-slate-900" />

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Ambient glows */}
      <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-accent-500/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-custom relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Text Column ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center lg:text-left"
          >
            {/* Trust pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 border border-primary-500/30 bg-primary-500/10 text-primary-300 rounded-full text-sm font-medium mb-8 backdrop-blur-sm"
            >
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
              Trusted by 100+ Organizations Across India
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.1] tracking-tight"
            >
              One-Stop Platform{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-300 bg-clip-text text-transparent">
                  Driven by Data
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
                  className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-primary-400/0 via-accent-400/60 to-primary-400/0 origin-left"
                />
              </span>{' '}
              Defined by Excellence
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-6 text-lg md:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Transform raw data into actionable insights. We deliver comprehensive
              market research, social research, and brand solutions that drive
              measurable business growth.
            </motion.p>

            {/* Inline proof metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.6 }}
              className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6"
            >
              {[
                { value: '100+', label: 'Projects' },
                { value: '50+',  label: 'Clients' },
                { value: '15+',  label: 'States' },
                { value: '50K+', label: 'Responses' },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl font-display font-bold text-white tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.6 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all duration-300 w-full sm:w-auto shadow-lg shadow-primary-900/40 hover:shadow-primary-800/50 hover:-translate-y-0.5"
              >
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/services"
                className="group inline-flex items-center justify-center px-8 py-4 border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 w-full sm:w-auto hover:-translate-y-0.5"
              >
                Explore Services
              </Link>
            </motion.div>

            {/* Accreditation badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-12 pt-8 border-t border-white/10"
            >
              <p className="text-xs text-slate-500 mb-4 uppercase tracking-wider font-medium">
                Proud Associations
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                {CREDIBILITY_BADGES.map(({ icon: Icon, label }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 + i * 0.1 }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 rounded-lg text-slate-300 text-sm font-medium transition-colors cursor-default"
                  >
                    <Icon className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
                    {label}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── Visual Column ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative h-[400px] lg:h-[600px]"
          >
            {/* Orbital rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-[80%] h-[80%] rounded-full border border-primary-500/10 animate-spin"
                style={{ animationDuration: '30s' }}
              />
              <div
                className="absolute w-[95%] h-[95%] rounded-full border border-accent-500/5 animate-spin"
                style={{ animationDuration: '45s', animationDirection: 'reverse' }}
              />
            </div>
            <HeroVisual />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-slate-500 uppercase tracking-widest font-medium">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5 text-slate-500" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
