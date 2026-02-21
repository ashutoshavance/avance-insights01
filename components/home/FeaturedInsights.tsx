'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react'

// Sample insights (will be fetched from CMS in production)
const featuredInsights = [
  {
    id: 1,
    title: 'Consumer Trends in Digital Payment Adoption',
    excerpt: 'A comprehensive study on how Indian consumers are embracing digital payment solutions post-pandemic.',
    category: 'Market Research',
    date: '2024-01-15',
    readTime: '8 min read',
    slug: 'consumer-trends-digital-payment',
    image: null,
  },
  {
    id: 2,
    title: 'Impact Assessment: Rural Education Programs',
    excerpt: 'Evaluating the effectiveness of CSR-funded education initiatives across 5 states.',
    category: 'Social Research',
    date: '2024-01-10',
    readTime: '12 min read',
    slug: 'impact-assessment-rural-education',
    image: null,
  },
  {
    id: 3,
    title: 'Brand Health Tracking: FMCG Sector 2024',
    excerpt: 'Key findings from our quarterly brand health study covering top 50 FMCG brands.',
    category: 'Brand Solutions',
    date: '2024-01-05',
    readTime: '6 min read',
    slug: 'brand-health-fmcg-2024',
    image: null,
  },
  {
    id: 4,
    title: 'Data Collection Best Practices Guide',
    excerpt: 'Essential guidelines for ensuring data quality in field research across diverse geographies.',
    category: 'Methodology',
    date: '2024-01-01',
    readTime: '10 min read',
    slug: 'data-collection-best-practices',
    image: null,
  },
]

const categoryColors: Record<string, { text: string; bg: string }> = {
  'Market Research': { text: 'text-blue-600', bg: 'bg-blue-50' },
  'Social Research': { text: 'text-purple-600', bg: 'bg-purple-50' },
  'Brand Solutions': { text: 'text-orange-600', bg: 'bg-orange-50' },
  'Methodology': { text: 'text-teal-600', bg: 'bg-teal-50' },
}

export default function FeaturedInsights() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="container-custom">
        {/* Section Header */}
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
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="section-title"
            >
              Research & Thought Leadership
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

        {/* Insights Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredInsights.map((insight, index) => {
            const catColor = categoryColors[insight.category] || { text: 'text-primary-600', bg: 'bg-primary-50' }

            return (
              <motion.article
                key={insight.id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.09 * index, duration: 0.6 }}
              >
                <Link href={`/insights/${insight.slug}`}>
                  <div className="group h-full flex flex-col rounded-2xl border border-slate-100 bg-white hover:border-primary-200 hover:shadow-xl hover:shadow-primary-50/50 transition-all duration-300 overflow-hidden">
                    {/* Image placeholder */}
                    <div className="relative aspect-[16/9] bg-gradient-to-br from-slate-100 to-primary-50 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <span className="text-2xl font-bold text-primary-600 font-display">
                            {insight.title.charAt(0)}
                          </span>
                        </div>
                      </div>
                      {/* Category badge overlay */}
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${catColor.bg} ${catColor.text} text-xs font-semibold rounded-full`}>
                          <Tag className="w-3 h-3" />
                          {insight.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      {/* Title */}
                      <h3 className="text-base font-display font-bold text-slate-900 group-hover:text-primary-700 transition-colors line-clamp-2 leading-snug">
                        {insight.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="mt-2 text-slate-500 text-sm line-clamp-2 flex-grow leading-relaxed">
                        {insight.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {new Date(insight.date).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{insight.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}