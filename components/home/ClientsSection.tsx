'use client'

/**
 * components/ClientsSection.tsx
 *
 * FILE PATH: src/components/ClientsSection.tsx
 *
 * CHANGES FROM ORIGINAL:
 *  1. Real 19 clients from Avance PPT (not 12 generic names)
 *  2. Connected to Strapi CMS — CMS data replaces fallback when available
 *  3. Professional infinite marquee scroll (replaces static grid)
 *  4. Shows actual logos from CMS if uploaded, else letter placeholder
 *  5. Same trust badges section preserved
 *
 * Strapi collection: clients
 * Fields: name (Text, required), logo (Media), sector (Text), featured (Boolean)
 */

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { clientService } from '@/services/client.service'
import type { Client } from '@/lib/strapi'

// ─── Real 19 clients from Avance PPT ─────────────────────────────────────────
// Sector data helps generate unique placeholder colours
const FALLBACK_CLIENTS: Array<{ name: string; sector: string }> = [
  { name: 'Times of India',    sector: 'Media' },
  { name: 'Publicis Groupe',   sector: 'Advertising' },
  { name: 'Tilaknagar',        sector: 'FMCG' },
  { name: 'Reliance Digital',  sector: 'Retail' },
  { name: 'Sony',              sector: 'Media' },
  { name: 'TATA',              sector: 'Conglomerate' },
  { name: 'Technopak',         sector: 'Consulting' },
  { name: 'Jagran',            sector: 'Media' },
  { name: 'TVS Credit',        sector: 'Finance' },
  { name: 'Bacardi',           sector: 'FMCG' },
  { name: 'Cambridge',         sector: 'Education' },
  { name: 'CavinKare',         sector: 'FMCG' },
  { name: 'Dentsu',            sector: 'Advertising' },
  { name: 'Greenply',          sector: 'Manufacturing' },
  { name: 'Lok Satta',         sector: 'Government' },
  { name: 'McCann',            sector: 'Advertising' },
  { name: 'Polycab',           sector: 'Manufacturing' },
  { name: 'Surgo Ventures',    sector: 'NGO' },
  { name: 'Torrent Pharma',    sector: 'Healthcare' },
]

// Professional sector → colour mapping for the letter-avatar placeholders
const SECTOR_COLORS: Record<string, { bg: string; text: string }> = {
  'Media':         { bg: '#EFF6FF', text: '#1D4ED8' },
  'Advertising':   { bg: '#FDF4FF', text: '#7E22CE' },
  'FMCG':          { bg: '#F0FDF4', text: '#15803D' },
  'Finance':       { bg: '#FFF7ED', text: '#C2410C' },
  'Healthcare':    { bg: '#FFF1F2', text: '#BE123C' },
  'Education':     { bg: '#ECFDF5', text: '#065F46' },
  'Government':    { bg: '#EEF2FF', text: '#3730A3' },
  'NGO':           { bg: '#F0FDFA', text: '#0F766E' },
  'Consulting':    { bg: '#FEF3C7', text: '#92400E' },
  'Retail':        { bg: '#FCE7F3', text: '#9D174D' },
  'Manufacturing': { bg: '#F1F5F9', text: '#475569' },
  'Conglomerate':  { bg: '#F0F9FF', text: '#0369A1' },
}

// ─── Single client logo card ──────────────────────────────────────────────────

function ClientCard({ name, logoUrl, sector }: { name: string; logoUrl?: string; sector?: string }) {
  const colors = SECTOR_COLORS[sector ?? ''] ?? { bg: '#F8FAFC', text: '#475569' }
  const initial = name.charAt(0).toUpperCase()

  return (
    <div
      className="flex-shrink-0 flex flex-col items-center justify-center gap-2.5 px-6 py-4 mx-3 rounded-xl border border-slate-100 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-300 cursor-default group"
      style={{ minWidth: 140 }}
    >
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={name}
          className="h-10 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
        />
      ) : (
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform duration-300"
          style={{ background: colors.bg, color: colors.text }}
        >
          {initial}
        </div>
      )}
      <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-800 text-center leading-tight transition-colors max-w-[120px]">
        {name}
      </span>
    </div>
  )
}

// ─── Marquee row ──────────────────────────────────────────────────────────────

function Marquee({
  clients,
  reverse = false,
}: {
  clients: Array<{ name: string; logoUrl?: string; sector?: string }>
  reverse?: boolean
}) {
  // Duplicate for seamless loop
  const items = [...clients, ...clients]

  return (
    <div className="overflow-hidden relative">
      {/* Fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent" />

      <div
        className="flex"
        style={{
          animation: `marquee${reverse ? 'Reverse' : ''} ${clients.length * 4}s linear infinite`,
        }}
      >
        {items.map((client, i) => (
          <ClientCard
            key={`${client.name}-${i}`}
            name={client.name}
            logoUrl={client.logoUrl}
            sector={client.sector}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0%   { transform: translateX(0) }
          100% { transform: translateX(-50%) }
        }
        @keyframes marqueeReverse {
          0%   { transform: translateX(-50%) }
          100% { transform: translateX(0) }
        }
      `}</style>
    </div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function ClientsSection() {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true })
  const [clients, setClients] = useState<Array<{
    name: string
    logoUrl?: string
    sector?: string
  }>>(FALLBACK_CLIENTS)

  useEffect(() => {
    const load = async () => {
      try {
        const cmsClients: Client[] = await clientService.getAll()
        if (cmsClients && cmsClients.length > 0) {
          setClients(
            cmsClients.map((c) => ({
              name:    c.name,
              logoUrl: c.logo?.url
                ? clientService.getLogoUrl(c)
                : undefined,
              sector:  c.sector ?? undefined,
            }))
          )
        }
        // If CMS returns empty, FALLBACK_CLIENTS remain
      } catch {
        // Strapi unreachable — keep fallback silently
      }
    }
    load()
  }, [])

  // Split clients into two rows for visual variety
  const row1 = clients.slice(0, Math.ceil(clients.length / 2))
  const row2 = clients.slice(Math.ceil(clients.length / 2))

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/60 to-white" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="relative z-10">
        {/* Header */}
        <div className="container-custom text-center max-w-3xl mx-auto mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-[0.15em] mb-4"
          >
            Trusted By
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title mt-2"
          >
            19+ Leading Organizations
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="section-subtitle mt-4 mx-auto"
          >
            We've partnered with India's most respected brands across FMCG, media, 
            finance, healthcare, and social sectors to deliver research that drives decisions.
          </motion.p>
        </div>

        {/* Marquee rows */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-4 py-2"
        >
          <Marquee clients={row1} />
          {row2.length > 0 && <Marquee clients={row2} reverse />}
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="container-custom mt-16 pt-12 border-t border-slate-100"
        >
          <div className="text-center">
            <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold mb-6">
              Certified &amp; Accredited
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: 'MRSI Member',        desc: 'Market Research Society of India' },
                { label: 'MSME Registered',    desc: 'Ministry of MSME, Govt. of India' },
                { label: 'ISO 9001:2015',      desc: 'Quality Management Certified' },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-3 px-6 py-3.5 bg-white border border-slate-200 hover:border-primary-300 hover:shadow-md hover:shadow-primary-50 rounded-xl transition-all duration-200 group cursor-default"
                >
                  <div className="w-8 h-8 bg-primary-50 group-hover:bg-primary-100 rounded-full flex items-center justify-center transition-colors flex-shrink-0">
                    <svg className="w-4 h-4 text-primary-600" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{badge.label}</div>
                    <div className="text-slate-400 text-[11px] font-medium">{badge.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}