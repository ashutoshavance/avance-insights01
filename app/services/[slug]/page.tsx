'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, CheckCircle, BarChart3, Users, Database, Lightbulb, Target, PieChart } from 'lucide-react'
import { serviceService } from '@/services/service.service'
import { OverviewSection } from '@/components/services/OverviewSection'

export default function ServicePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [service, setService] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadService() {
      if (!slug) return
      const data = await serviceService.getBySlug(slug)
      if (isMounted) {
        if (!data) {
          router.push('/services')
        } else {
          setService(data)
        }
        setIsLoading(false)
      }
    }

    loadService()
    return () => { isMounted = false }
  }, [slug, router])

  if (isLoading) {
    return <div className="pt-40 text-center">Loading...</div>
  }

  if (!service) {
    return null
  }

  // Map icon names to lucide components
  const ICON_MAP: Record<string, any> = {
    BarChart3,
    Users,
    Database,
    Lightbulb,
    Target,
    PieChart,
  }

  const IconComponent = ICON_MAP[service.iconName] || BarChart3

  return (
    <main className="pt-20" aria-label="Service detail page">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-50 via-white to-accent-50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container-custom relative z-10">
          <div className="mb-8">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Link>
          </div>

          <div className="max-w-3xl">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <IconComponent className="w-8 h-8 text-white" />
              </div>

              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 tracking-tight">
                  {service.title}
                </h1>
                
                <div className="mt-4 text-slate-600 text-lg leading-relaxed max-w-2xl">
                  {service.category && (
                    <div className="inline-block px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold mb-4">
                      {service.category}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl">
              {service.description}
            </p>
          </div>
        </div>
      </section>

      {/* Full Description Section */}
      {service.fullDescription && service.fullDescription.trim().length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">
                Overview
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
                {service.fullDescription.trim()}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Overview Items Section - Renders array of overview objects */}
      {service.overview && Array.isArray(service.overview) && service.overview.length > 0 && (
        <OverviewSection 
          overview={service.overview} 
          title="Key Highlights" 
        />
      )}

      {/* What's Included */}
      {service.features && Array.isArray(service.features) && service.features.length > 0 && (
        <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-12">
                What's Included
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {service.features.map((feature: string, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="w-6 h-6 text-green-500" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {String(feature)}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />

        <div className="container-custom relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight">
            Ready to Get Started?
          </h2>

          <p className="text-white/70 mt-4 max-w-2xl mx-auto text-lg">
            Let's discuss how our {service.title.toLowerCase()} solutions can help you achieve your business goals.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 mt-8 text-base font-semibold text-primary-700 bg-white rounded-lg hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
          >
            Schedule a Consultation
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
              Other Services
            </h2>
            <p className="text-slate-600 mt-3 text-lg">
              Explore our complete range of research solutions
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/services"
              className="inline-flex items-center px-8 py-3 text-base font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              View All Services
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
