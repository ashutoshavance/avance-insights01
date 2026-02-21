'use client'

/**
 * components/home/HeroVisual.tsx
 *
 * Premium McKinsey/BCG-level animated market research dashboard.
 * Zero Three.js. Zero WebGL. Pure CSS + SVG + React state.
 *
 * Design: Executive intelligence platform — dark navy glassmorphism,
 * animated live data feeds, India map with field coverage points,
 * real-time KPI counter animation, professional data visualization.
 *
 * Drop-in replacement for Globe3D — identical render API.
 * FILE PATH: components/home/HeroVisual.tsx
 */

import { useEffect, useState, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Ticker { label: string; value: string; delta: string; up: boolean }
interface Point   { cx: number; cy: number; size: number; delay: number; label: string }

// ─── Constants ────────────────────────────────────────────────────────────────

const TICKERS: Ticker[] = [
  { label: 'NPS Score',      value: '72',    delta: '+4.2',  up: true  },
  { label: 'CSAT Index',     value: '94.6%', delta: '+1.1%', up: true  },
  { label: 'Field Accuracy', value: '98.1%', delta: '+0.3%', up: true  },
  { label: 'Attrition Risk', value: '2.3%',  delta: '-0.8%', up: false },
  { label: 'Panel Size',     value: '302K',  delta: '+5.4K', up: true  },
]

// Approximate state capitals on a simplified India SVG viewBox 0 0 400 460
const INDIA_POINTS: Point[] = [
  { cx: 180, cy: 110, size: 5, delay: 0,    label: 'Delhi NCR'  },
  { cx: 135, cy: 200, size: 4, delay: 200,  label: 'Mumbai'     },
  { cx: 200, cy: 230, size: 4, delay: 400,  label: 'Hyderabad'  },
  { cx: 195, cy: 290, size: 4, delay: 600,  label: 'Bengaluru'  },
  { cx: 230, cy: 195, size: 3, delay: 800,  label: 'Kolkata'    },
  { cx: 155, cy: 165, size: 3, delay: 1000, label: 'Ahmedabad'  },
  { cx: 195, cy: 165, size: 3, delay: 1200, label: 'Bhopal'     },
  { cx: 175, cy: 250, size: 3, delay: 1400, label: 'Pune'       },
  { cx: 215, cy: 130, size: 3, delay: 1600, label: 'Lucknow'    },
  { cx: 145, cy: 145, size: 3, delay: 1800, label: 'Jaipur'     },
  { cx: 155, cy: 345, size: 3, delay: 2000, label: 'Chennai'    },
  { cx: 135, cy: 265, size: 3, delay: 2200, label: 'Goa'        },
  { cx: 245, cy: 170, size: 2, delay: 2400, label: 'Patna'      },
  { cx: 190, cy: 145, size: 2, delay: 2600, label: 'Agra'       },
  { cx: 170, cy: 125, size: 2, delay: 2800, label: 'Chandigarh' },
]

const SECTORS = [
  { name: 'FMCG',        share: 31, color: '#3b82f6' },
  { name: 'Healthcare',  share: 22, color: '#8b5cf6' },
  { name: 'Media',       share: 18, color: '#d946ef' },
  { name: 'NGO / Dev',   share: 16, color: '#10b981' },
  { name: 'Finance',     share: 13, color: '#f59e0b' },
]

const KPI = [
  { label: 'Projects',  target: 100, suffix: '+',   duration: 1800 },
  { label: 'Respondents', target: 302, suffix: 'K+', duration: 2200 },
  { label: 'Accuracy',  target: 98,  suffix: '%',   duration: 1600 },
  { label: 'States',    target: 15,  suffix: '+',   duration: 1400 },
]

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useCountUp(target: number, duration: number, active: boolean) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!active) return
    let start: number | null = null
    const id = requestAnimationFrame(function step(ts) {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setV(Math.round(p * target))
      if (p < 1) requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(id)
  }, [active, target, duration])
  return v
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({ label, target, suffix, duration, active }: { label: string; target: number; suffix: string; duration: number; active: boolean }) {
  const val = useCountUp(target, duration, active)
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12, padding: '12px 14px',
    }}>
      <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.8)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
        {val.toLocaleString()}{suffix}
      </div>
    </div>
  )
}

function SectorBar({ name, share, color, active, delay }: { name: string; share: number; color: string; active: boolean; delay: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 52, fontSize: 10, color: 'rgba(148,163,184,0.8)', fontWeight: 600, flexShrink: 0, textAlign: 'right' }}>{name}</div>
      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', background: `linear-gradient(90deg, ${color}99, ${color})`,
          borderRadius: 99, width: active ? `${share * 3}%` : '0%',
          transition: `width 1.2s cubic-bezier(.34,1,.64,1) ${delay}ms`,
        }} />
      </div>
      <div style={{ width: 28, fontSize: 10, color, fontWeight: 700 }}>{share}%</div>
    </div>
  )
}

function LiveTicker({ items }: { items: Ticker[] }) {
  const [idx, setIdx] = useState(0)
  const [fade, setFade] = useState(true)
  useEffect(() => {
    const id = setInterval(() => {
      setFade(false)
      setTimeout(() => { setIdx(i => (i + 1) % items.length); setFade(true) }, 300)
    }, 2800)
    return () => clearInterval(id)
  }, [items.length])
  const t = items[idx]
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 10, padding: '8px 12px',
      transition: 'opacity 0.3s', opacity: fade ? 1 : 0,
    }}>
      <span style={{
        display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
        background: '#10b981', boxShadow: '0 0 8px #10b981', flexShrink: 0,
        animation: 'livePulse 1.5s ease-in-out infinite',
      }} />
      <span style={{ fontSize: 10, color: 'rgba(148,163,184,0.7)', fontWeight: 600, letterSpacing: '0.08em' }}>{t.label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginLeft: 'auto' }}>{t.value}</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: t.up ? '#10b981' : '#f43f5e' }}>{t.delta}</span>
    </div>
  )
}

// Simplified India SVG outline (approximate)
function IndiaMap({ points, active }: { points: Point[]; active: boolean }) {
  return (
    <svg viewBox="0 0 400 460" style={{ width: '100%', height: '100%' }} aria-hidden>
      <defs>
        <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
        <filter id="ptGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* India outline — simplified path */}
      <path
        d="M178,32 L198,28 L220,38 L240,60 L255,85 L258,110 L270,125 L275,145 L268,160 L260,178 L270,195 L278,215 L272,235 L260,250 L255,270 L248,290 L238,308 L228,322 L215,335 L205,355 L198,375 L192,390 L185,370 L175,355 L165,340 L158,325 L148,308 L140,290 L130,270 L122,252 L118,230 L120,210 L115,190 L108,172 L112,155 L120,140 L125,120 L132,100 L138,80 L148,62 L160,45 L170,34 Z
             M255,110 L270,105 L285,115 L295,130 L290,148 L278,155 L268,145 L262,130 Z
             M115,190 L100,195 L92,210 L98,225 L112,230 Z"
        fill="rgba(59,130,246,0.04)"
        stroke="rgba(99,102,241,0.25)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Coverage glow */}
      <ellipse cx="195" cy="215" rx="85" ry="110" fill="url(#mapGlow)" />

      {/* Field coverage points */}
      {points.map((p, i) => (
        <g key={i} filter="url(#ptGlow)"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? 'scale(1)' : 'scale(0)',
            transformOrigin: `${p.cx}px ${p.cy}px`,
            transition: `opacity 0.5s ease ${p.delay}ms, transform 0.5s cubic-bezier(.34,1.56,.64,1) ${p.delay}ms`,
          }}>
          {/* Ripple */}
          <circle cx={p.cx} cy={p.cy} r={p.size * 2.5} fill="rgba(59,130,246,0.12)"
            style={{ animation: `ripple 2.5s ease-out infinite`, animationDelay: `${p.delay % 1200}ms` }} />
          {/* Dot */}
          <circle cx={p.cx} cy={p.cy} r={p.size} fill="#3b82f6" opacity={0.9} />
          <circle cx={p.cx} cy={p.cy} r={p.size * 0.5} fill="#93c5fd" />
        </g>
      ))}

      {/* Connection lines between major hubs */}
      {active && [
        [0, 5], [0, 6], [0, 8], [0, 9], [1, 3], [1, 7], [2, 3], [2, 4]
      ].map(([a, b], i) => (
        <line key={i}
          x1={points[a].cx} y1={points[a].cy}
          x2={points[b].cx} y2={points[b].cy}
          stroke="rgba(99,102,241,0.2)" strokeWidth="0.8"
          strokeDasharray="3 4"
          style={{ opacity: active ? 1 : 0, transition: `opacity 0.5s ease ${1800 + i * 150}ms` }}
        />
      ))}
    </svg>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function HeroVisual() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 400)
    return () => clearTimeout(t)
  }, [])

  // Card entrance animation helper
  const enter = (delay: number) => ({
    opacity: ready ? 1 : 0,
    transform: ready ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(.34,1,.64,1) ${delay}ms`,
  })

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden>

      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
        @keyframes ripple { 0%{r:4;opacity:.6} 100%{r:18;opacity:0} }
        @keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes scan { 0%{transform:translateY(0)} 100%{transform:translateY(420px)} }
        @keyframes dash { to { stroke-dashoffset: -12 } }
      `}</style>

      {/* Ambient glow rings */}
      {[340, 440, 540].map((s, i) => (
        <div key={i} style={{
          position: 'absolute', width: s, height: s,
          borderRadius: '50%', border: '1px solid rgba(99,102,241,0.08)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          animation: `floatUp ${5 + i * 1.5}s ease-in-out infinite`,
          animationDirection: i % 2 ? 'reverse' : 'normal',
        }} />
      ))}

      {/* ── Main card ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: 400,
        background: 'linear-gradient(145deg, rgba(10,15,35,0.97) 0%, rgba(20,10,55,0.97) 100%)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 24,
        boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 1px 0 rgba(255,255,255,0.08) inset',
        backdropFilter: 'blur(24px)',
        overflow: 'hidden',
        ...enter(0),
      }}>

        {/* Scan line effect */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.4) 50%, transparent 100%)',
          animation: 'scan 8s linear infinite', zIndex: 1, pointerEvents: 'none',
        }} />

        {/* Header */}
        <div style={{ padding: '16px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#818cf8', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 3 }}>
              Intelligence Platform
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.01em' }}>
              Avance Research Hub
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981', animation: 'livePulse 1.5s ease-in-out infinite' }} />
            <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700, letterSpacing: '0.06em' }}>LIVE</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* KPI grid */}
          <div style={{ ...enter(100) }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {KPI.map((k) => (
                <KpiCard key={k.label} {...k} active={ready} />
              ))}
            </div>
          </div>

          {/* Two-column: India map + metrics */}
          <div style={{ display: 'flex', gap: 14, ...enter(200) }}>

            {/* India map */}
            <div style={{
              flex: '0 0 auto', width: 130, height: 160,
              position: 'relative',
              background: 'rgba(59,130,246,0.04)',
              border: '1px solid rgba(99,102,241,0.12)',
              borderRadius: 12, overflow: 'hidden',
              padding: 4,
            }}>
              <div style={{ fontSize: 8, color: 'rgba(148,163,184,0.6)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 6px 0' }}>Coverage</div>
              <IndiaMap points={INDIA_POINTS} active={ready} />
              <div style={{ position: 'absolute', bottom: 6, left: 0, right: 0, textAlign: 'center', fontSize: 9, color: '#818cf8', fontWeight: 700 }}>15+ States</div>
            </div>

            {/* Sector bars */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(148,163,184,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Sector Mix</div>
              {SECTORS.map((s, i) => (
                <SectorBar key={s.name} name={s.name} share={s.share} color={s.color} active={ready} delay={300 + i * 100} />
              ))}
            </div>
          </div>

          {/* Live ticker */}
          <div style={{ ...enter(400) }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(148,163,184,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
              Live Intelligence Feed
            </div>
            <LiveTicker items={TICKERS} />
          </div>

          {/* Method tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, ...enter(500) }}>
            {['CAPI', 'CATI', 'CAWI', 'FGD', 'IDI', 'Ethnography'].map((m, i) => (
              <span key={m} style={{
                padding: '3px 10px', borderRadius: 99, fontSize: 10, fontWeight: 700,
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.2)',
                color: '#a5b4fc',
                opacity: ready ? 1 : 0,
                transform: ready ? 'scale(1)' : 'scale(0.8)',
                transition: `opacity .4s ease ${500 + i * 60}ms, transform .4s cubic-bezier(.34,1.56,.64,1) ${500 + i * 60}ms`,
              }}>
                {m}
              </span>
            ))}
          </div>

          {/* Footer bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)',
            ...enter(600),
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 9, color: 'rgba(148,163,184,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>ISO 9001:2015</span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(148,163,184,0.3)' }} />
              <span style={{ fontSize: 9, color: 'rgba(148,163,184,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>MRSI Member</span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['#3b82f6','#8b5cf6','#10b981'].map((c, i) => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: c, opacity: 0.7 }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating data chips ──────────────────────────────────── */}
      {[
        { text: 'Brand Tracker • Active',    top: '8%',    left: '-2%',  delay: 100  },
        { text: '↑ 12% Awareness Lift',      top: '20%',   right: '-4%', delay: 600  },
        { text: 'AI Report Ready',           bottom: '24%', left: '-4%', delay: 1100 },
        { text: '98.1% Field Accuracy',      bottom: '10%', right: '-2%',delay: 300  },
      ].map((c, i) => (
        <div key={i} style={{
          position: 'absolute', zIndex: 20,
          ...Object.fromEntries(Object.entries(c).filter(([k]) => ['top','bottom','left','right'].includes(k))),
          padding: '6px 14px',
          background: 'rgba(8,12,30,0.92)',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: 10,
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          fontSize: 11, fontWeight: 700, color: 'rgba(241,245,249,0.9)',
          whiteSpace: 'nowrap',
          opacity: ready ? 1 : 0,
          transform: ready ? 'translateY(0)' : 'translateY(10px)',
          transition: `opacity .5s ease ${c.delay}ms, transform .5s cubic-bezier(.34,1,.64,1) ${c.delay}ms`,
          animation: ready ? `floatUp ${4 + i}s ease-in-out ${c.delay}ms infinite` : 'none',
        }}>
          <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#818cf8', marginRight: 7, verticalAlign: 'middle' }} />
          {c.text}
        </div>
      ))}
    </div>
  )
}