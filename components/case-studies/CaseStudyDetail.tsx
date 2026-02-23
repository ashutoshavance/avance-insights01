'use client'

/**
 * components/case-studies/CaseStudyDetail.tsx
 *
 * ─── CASE STUDY DETAIL DISPLAY COMPONENT ────────────────────────────────────
 * Renders comprehensive case study information without [object Object] issues.
 * All data comes from normalized case study object.
 *
 * USAGE:
 * <CaseStudyDetail caseStudy={normalizedCaseStudy} />
 *
 * FEATURES:
 * ✓ Safe rendering of all fields (no objects in JSX)
 * ✓ Professional two-column layout
 * ✓ Responsive design
 * ✓ Image handling with fallback
 * ✓ TypeScript safe
 *
 * FILE PATH: src/components/case-studies/CaseStudyDetail.tsx
 */

import React from 'react'
import Image from 'next/image'
import { NormalisedCaseStudy } from '@/lib/strapi'
import { CheckCircle } from 'lucide-react'

interface CaseStudyDetailProps {
  caseStudy: NormalisedCaseStudy
}

export const CaseStudyDetail: React.FC<CaseStudyDetailProps> = ({ caseStudy }) => {
  return (
    <article className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold">
              {caseStudy.sector}
            </span>
            {caseStudy.featured && (
              <span className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-semibold">
                Featured Case Study
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            {caseStudy.title}
          </h1>

          <p className="text-xl text-slate-600">
            Client: <span className="font-semibold text-slate-900">{caseStudy.client}</span>
          </p>
        </div>

        {/* Featured Image */}
        <div className="mb-12 md:mb-16 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={caseStudy.coverImageUrl}
            alt={caseStudy.title}
            width={1200}
            height={600}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        {/* Main Content - Two Column */}
        <div className="grid lg:grid-cols-3 gap-12 md:gap-16">
          {/* Left Column - Challenge & Solution */}
          <div className="lg:col-span-2 space-y-12">
            {/* Challenge Section */}
            <section>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">
                The Challenge
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
                {caseStudy.challenge}
              </p>
            </section>

            {/* Solution Section */}
            <section>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">
                Our Solution
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
                {caseStudy.solution}
              </p>
            </section>

            {/* Methodology Section */}
            <section>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">
                Methodology
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
                {caseStudy.methodology}
              </p>
            </section>
          </div>

          {/* Right Column - Results Highlight */}
          <aside>
            <div className="sticky top-20 p-8 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border border-primary-200">
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-6">
                Results
              </h3>

              <div className="space-y-4">
                {caseStudy.results.split('\n').filter(Boolean).map((result, index) => (
                  <div key={index} className="flex gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-slate-900 leading-relaxed">
                      {result.trim()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Fallback if results is single string */}
              {!caseStudy.results.includes('\n') && (
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-slate-900 leading-relaxed">
                    {caseStudy.results}
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </article>
  )
}

export default CaseStudyDetail
