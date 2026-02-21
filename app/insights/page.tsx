'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Clock, Tag, Search, Filter, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// Sample insights - in production, fetch from Strapi
const insights = [
  {
    id: 1,
    title: 'Consumer Trends in Digital Payment Adoption',
    excerpt: 'A comprehensive study on how Indian consumers are embracing digital payment solutions post-pandemic, with key insights on adoption drivers and barriers.',
    category: 'Market Research',
    date: '2024-01-15',
    readTime: '8 min read',
    slug: 'consumer-trends-digital-payment',
  },
  {
    id: 2,
    title: 'Impact Assessment: Rural Education Programs',
    excerpt: 'Evaluating the effectiveness of CSR-funded education initiatives across 5 states, measuring outcomes and identifying best practices.',
    category: 'Social Research',
    date: '2024-01-10',
    readTime: '12 min read',
    slug: 'impact-assessment-rural-education',
  },
  {
    id: 3,
    title: 'Brand Health Tracking: FMCG Sector 2024',
    excerpt: 'Key findings from our quarterly brand health study covering top 50 FMCG brands in India, with competitive benchmarking.',
    category: 'Brand Research',
    date: '2024-01-05',
    readTime: '6 min read',
    slug: 'brand-health-fmcg-2024',
  },
  {
    id: 4,
    title: 'Data Collection Best Practices Guide',
    excerpt: 'Essential guidelines for ensuring data quality in field research across diverse geographies and demographics.',
    category: 'Methodology',
    date: '2024-01-01',
    readTime: '10 min read',
    slug: 'data-collection-best-practices',
  },
  {
    id: 5,
    title: 'E-commerce Consumer Behavior Study',
    excerpt: 'Understanding how Indian consumers navigate online shopping platforms, from discovery to purchase decision.',
    category: 'Market Research',
    date: '2023-12-20',
    readTime: '9 min read',
    slug: 'ecommerce-consumer-behavior',
  },
  {
    id: 6,
    title: 'Healthcare Awareness in Tier-2 Cities',
    excerpt: 'Exploring health literacy and healthcare-seeking behaviors in emerging urban markets across India.',
    category: 'Social Research',
    date: '2023-12-15',
    readTime: '11 min read',
    slug: 'healthcare-awareness-tier2',
  },
]

const categories = ['All', 'Market Research', 'Social Research', 'Brand Research', 'Methodology']

export default function InsightsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredInsights = insights.filter((insight) => {
    const matchesCategory = selectedCategory === 'All' || insight.category === selectedCategory
    const matchesSearch = insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-title"
            >
              Case Study & <span className="gradient-text">Research</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="section-subtitle mt-4 mx-auto"
            >
              Explore our latest research findings, industry trends, and thought leadership 
              articles from our team of experts.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-secondary-200">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <Filter className="w-5 h-5 text-secondary-400 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Insights Grid */}
      <section className="py-16">
        <div className="container-custom">
          {filteredInsights.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredInsights.map((insight, index) => (
                <motion.article
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/insights/${insight.slug}`}>
                    <div className="card card-hover h-full flex flex-col group">
                      {/* Image placeholder */}
                      <div className="aspect-[16/10] bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center">
                          <span className="text-3xl font-bold text-primary-600">
                            {insight.title.charAt(0)}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        {/* Category */}
                        <div className="flex items-center gap-2 mb-3">
                          <Tag className="w-4 h-4 text-primary-500" />
                          <span className="text-sm font-medium text-primary-600">
                            {insight.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-display font-bold text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {insight.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="mt-3 text-secondary-600 line-clamp-3 flex-grow">
                          {insight.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="mt-4 pt-4 border-t border-secondary-100 flex items-center justify-between text-sm text-secondary-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(insight.date).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{insight.readTime}</span>
                          </div>
                        </div>

                        {/* Read More */}
                        <div className="mt-4 flex items-center text-primary-600 font-medium group-hover:gap-3 gap-2 transition-all">
                          Read Article
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary-600">No insights found</h3>
              <p className="text-secondary-500 mt-1">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-secondary-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-display font-bold text-secondary-900">
              Stay Updated with Latest Research
            </h2>
            <p className="text-secondary-600 mt-2">
              Subscribe to our newsletter for monthly insights and industry updates.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
