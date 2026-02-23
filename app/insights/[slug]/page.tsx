'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, Calendar, Clock } from 'lucide-react'
import { getUnsplashUrl, getStrapiMedia } from '@/lib/media'

export default function InsightPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [insight, setInsight] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadInsight() {
      if (!slug) return

      // For now, use fallback data since we don't have an insight service
      // In production, fetch from Strapi /api/case-studies endpoint
      const fallbackInsights = [
        {
          id: 1,
          title: 'Consumer Trends in Digital Payment Adoption',
          slug: 'consumer-trends-digital-payment',
          excerpt: 'A comprehensive study on how Indian consumers are embracing digital payment solutions post-pandemic, with key insights on adoption drivers and barriers.',
          category: 'Market Research',
          date: '2024-01-15',
          readTime: '8 min read',
          content: 'This comprehensive study examines the digital payment adoption trends among Indian consumers. Our research reveals significant shifts in payment preferences post-pandemic, with digital wallets and UPI leading the charge. Key findings include increased adoption across all demographics, with younger consumers showing highest engagement. Barriers to adoption remain around security concerns and digital literacy in rural areas.',
          imageUrl: getUnsplashUrl('digital payment research'),
          imageAlt: 'Digital payment adoption study',
        },
        {
          id: 2,
          title: 'Impact Assessment: Rural Education Programs',
          slug: 'impact-assessment-rural-education',
          excerpt: 'Evaluating the effectiveness of CSR-funded education initiatives across 5 states, measuring outcomes and identifying best practices.',
          category: 'Social Research',
          date: '2024-01-10',
          readTime: '12 min read',
          content: 'This impact evaluation assessed CSR-funded education programs across rural areas. Our mixed-methods study combined surveys, interviews, and baseline/endline data. Key outcomes show 45% improvement in learning outcomes, with strong community engagement. We identified critical success factors and recommendations for scaling.',
          imageUrl: getUnsplashUrl('rural education program'),
          imageAlt: 'Rural education assessment',
        },
        {
          id: 3,
          title: 'Brand Health Tracking: FMCG Sector 2024',
          slug: 'brand-health-fmcg-2024',
          excerpt: 'Key findings from our quarterly brand health study covering top 50 FMCG brands in India, with competitive benchmarking.',
          category: 'Brand Research',
          date: '2024-01-05',
          readTime: '6 min read',
          content: 'Our quarterly brand health tracking study monitored 50 leading FMCG brands. Analysis reveals shifting consumer preferences, with health and sustainability emerging as key decision drivers. Competitive benchmarking shows winners and losers in each category, with detailed recommendations for brand positioning.',
          imageUrl: getUnsplashUrl('FMCG brand research'),
          imageAlt: 'FMCG brand health study',
        },
      ]

      const found = fallbackInsights.find((i) => i.slug === slug)

      if (isMounted) {
        if (!found) {
          router.push('/insights')
        } else {
          setInsight(found)
        }
        setIsLoading(false)
      }
    }

    loadInsight()
    return () => { isMounted = false }
  }, [slug, router])

  if (isLoading) {
    return <div className="pt-40 text-center">Loading...</div>
  }

  if (!insight) {
    return null
  }

  return (
    <main className="pt-20" aria-label="Insight detail page">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-50 via-white to-accent-50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container-custom relative z-10">
          <div className="mb-8">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Insights
            </Link>
          </div>

          <div className="max-w-4xl">
            <div className="mb-6">
              <div className="inline-block px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold mb-4">
                {insight.category}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 tracking-tight mb-6">
              {insight.title}
            </h1>

            <div className="flex flex-wrap gap-6 text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {new Date(insight.date).toLocaleDateString('en-IN', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{insight.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {insight.imageUrl && (
        <section className="relative h-96 md:h-[500px] bg-slate-100 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={insight.imageUrl}
            alt={insight.imageAlt || insight.title}
            className="w-full h-full object-cover"
          />
        </section>
      )}

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="lead text-lg md:text-xl text-slate-600 mb-8">
                {insight.excerpt}
              </p>

              <div className="mt-8 pt-8 border-t border-slate-200">
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {insight.content}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-16 pt-8 border-t border-slate-200">
              <p className="text-slate-600 mb-6">
                Interested in similar research for your business?
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 text-base font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 group"
              >
                Get in Touch
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Insights */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
              More Insights
            </h2>
            <p className="text-slate-600 mt-3 text-lg">
              Explore other case studies and research
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/insights"
              className="inline-flex items-center px-8 py-3 text-base font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              View All Insights
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
