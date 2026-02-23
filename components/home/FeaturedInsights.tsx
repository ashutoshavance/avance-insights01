'use client'

/**
 * components/FeaturedInsights.tsx
 *
 * FILE PATH: src/components/FeaturedInsights.tsx
 *
 * CHANGES FROM ORIGINAL:
 *  1. Connected to Strapi via insightService.getFeatured()
 *  2. Falls back to 4 Avance-relevant static insights if CMS is empty
 *  3. Skeleton loading state while fetching
 *  4. Improved card UI — cleaner typography hierarchy
 *  5. No hardcoded image paths — handles Strapi media or placeholder
 *
 * Strapi collection: insights
 * Fields: title, slug, excerpt, featuredImage (Media), category, publishDate, readTime
 */

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react'
import { insightService } from '@/services/insight.service'
import type { Insight } from '@/types/insight'

// ─── Avance-relevant fallback content ────────────────────────────────────────

const FALLBACK_INSIGHTS: Insight[] = [
  {
    id: 1,
    documentId: 'fb-1',
    title: 'Consumer Trends in Digital Payment Adoption Across India',
    excerpt: 'A comprehensive study on how Indian consumers are embracing digital payment solutions across urban and semi-urban markets post-pandemic.',
    content: '',
    category: 'Market Research',
    publishDate: '2025-01-15',
    readTime: '8 min read',
    slug: 'consumer-trends-digital-payment',
    imageUrl: '',
    imageAlt: '',
  },
  {
    id: 2,
    documentId: 'fb-2',
    title: 'Impact Assessment: Rural Education Programs Across 5 States',
    excerpt: 'Evaluating the effectiveness of CSR-funded education initiatives with baseline and endline data from 8,000+ respondents.',
    content: '',
    category: 'Social Research',
    publishDate: '2025-01-10',
    readTime: '12 min read',
    slug: 'impact-assessment-rural-education',
    imageUrl: '',
    imageAlt: '',
  },
  {
    id: 3,
    documentId: 'fb-3',
    title: 'Brand Health Tracking: FMCG Sector — Key Findings 2025',
    excerpt: 'Key findings from our quarterly brand health study covering top 50 FMCG brands on awareness, consideration, and loyalty metrics.',
    content: '',
    category: 'Brand Research',
    publishDate: '2025-01-05',
    readTime: '6 min read',
    slug: 'brand-health-fmcg-2025',
    imageUrl: '',
    imageAlt: '',
  },
  {
    id: 4,
    documentId: 'fb-4',
    title: 'Best Practices in Multi-Lingual Data Collection',
    excerpt: 'Essential guidelines ensuring data quality in field research across India\'s linguistically diverse geographies — CAPI, CATI, and hybrid methods.',
    content: '',
    category: 'Methodology',
    publishDate: '2025-01-01',
    readTime: '10 min read',
    slug: 'multilingual-data-collection-best-practices',
    imageUrl: '',
    imageAlt: '',
  },
]

const CATEGORY_STYLES: Record<string, { text: string; bg: string; border: string }> = {
  'Market Research': { text: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-100' },
  'Social Research': { text: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-100' },
  'Brand Research':  { text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-100' },
  'Methodology':     { text: 'text-teal-700',   bg: 'bg-teal-50',   border: 'border-teal-100' },
  'Analytics':       { text: 'text-rose-700',   bg: 'bg-rose-50',   border: 'border-rose-100' },
}
const DEFAULT_CAT = { text: 'text-primary-700', bg: 'bg-primary-50', border: 'border-primary-100' }

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-slate-100" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-100 rounded w-1/3" />
        <div className="h-5 bg-slate-100 rounded w-full" />
        <div className="h-5 bg-slate-100 rounded w-4/5" />
        <div className="h-4 bg-slate-100 rounded w-full mt-1" />
        <div className="h-4 bg-slate-100 rounded w-3/4" />
        <div className="flex justify-between mt-4">
          <div className="h-3 bg-slate-100 rounded w-16" />
          <div className="h-3 bg-slate-100 rounded w-16" />
        </div>
      </div>
    </div>
  )
}

// ─── Insight card ─────────────────────────────────────────────────────────────

function InsightCard({ insight, index, inView }: { insight: Insight; index: number; inView: boolean }) {
  const cat = CATEGORY_STYLES[insight.category] ?? DEFAULT_CAT

  const formattedDate = insight.publishDate
    ? new Date(insight.publishDate).toLocaleDateString('en-IN', {
        month: 'short',
        day:   'numeric',
        year:  'numeric',
      })
    : ''

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.08 * index, duration: 0.5 }}
    >
      <Link href={`/insights/${insight.slug}`}>
        <div className="group h-full flex flex-col rounded-2xl border border-slate-100 bg-white hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100/80 transition-all duration-300 overflow-hidden">
          {/* Thumbnail */}
          <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
            {insight.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={insight.imageUrl}
                alt={insight.imageAlt || insight.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-primary-500 font-display">
                    {insight.title.charAt(0)}
                  </span>
                </div>
              </div>
            )}

            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${cat.bg} ${cat.text} border ${cat.border} text-xs font-semibold rounded-full backdrop-blur-sm`}>
                <Tag className="w-3 h-3" />
                {insight.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-grow">
            <h3 className="text-base font-display font-bold text-slate-900 group-hover:text-primary-700 transition-colors line-clamp-2 leading-snug">
              {insight.title}
            </h3>

            <p className="mt-2 text-slate-500 text-sm line-clamp-2 flex-grow leading-relaxed">
              {insight.excerpt}
            </p>

            {/* Meta */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              {formattedDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formattedDate}</span>
                </div>
              )}
              {insight.readTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{insight.readTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function FeaturedInsights() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await insightService.getFeatured()
        setInsights(data.length > 0 ? data : FALLBACK_INSIGHTS)
      } catch {
        setInsights(FALLBACK_INSIGHTS)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-[0.15em] mb-4"
            >
              Latest Insights
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="section-title"
            >
              Research &amp; Thought Leadership
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 group transition-colors"
            >
              View All Insights
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : insights.slice(0, 4).map((insight, i) => (
                <InsightCard
                  key={insight.documentId || insight.id}
                  insight={insight}
                  index={i}
                  inView={inView}
                />
              ))}
        </div>
      </div>
    </section>
  )
}