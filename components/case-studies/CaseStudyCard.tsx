'use client'

/**
 * components/case-studies/CaseStudyCard.tsx
 *
 * ─── REUSABLE CASE STUDY CARD COMPONENT ────────────────────────────────────
 * Displays a single case study with image, title, client, and metadata.
 * Designed for gallery grids and listing pages.
 *
 * USAGE:
 * <CaseStudyCard caseStudy={normalizedCaseStudy} href="/case-studies/slug" />
 *
 * FEATURES:
 * ✓ Uses normalized case study data (no [object Object] issues)
 * ✓ Responsive image with fallback
 * ✓ Hover animations
 * ✓ Sector badge
 * ✓ Featured indicator
 * ✓ Accessible
 * ✓ TypeScript safe
 *
 * FILE PATH: src/components/case-studies/CaseStudyCard.tsx
 */

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { NormalisedCaseStudy } from '@/lib/strapi'
import { ArrowRight, Star } from 'lucide-react'

interface CaseStudyCardProps {
  caseStudy: NormalisedCaseStudy
  href?: string
}

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  caseStudy,
  href = `/case-studies/${caseStudy.slug}`,
}) => {
  return (
    <Link href={href}>
      <article
        className="group rounded-xl overflow-hidden bg-white border border-slate-200 hover:border-primary-300 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
        aria-label={`Case Study: ${caseStudy.title}`}
      >
        {/* Featured Badge */}
        {caseStudy.featured && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-md">
            <Star className="w-4 h-4 text-white fill-white" aria-hidden="true" />
            <span className="text-xs font-semibold text-white">Featured</span>
          </div>
        )}

        {/* Cover Image */}
        <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
          <Image
            src={caseStudy.coverImageUrl}
            alt={caseStudy.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-6 gap-4">
          {/* Sector Badge */}
          <div className="flex items-start justify-between gap-3">
            <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
              {caseStudy.sector}
            </span>
          </div>

          {/* Title */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {caseStudy.title}
            </h3>
          </div>

          {/* Client */}
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-slate-500">Client</p>
            <p className="text-base font-semibold text-slate-900 truncate">
              {caseStudy.client}
            </p>
          </div>

          {/* CTA */}
          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-primary-600">View Case Study</span>
            <ArrowRight className="w-4 h-4 text-primary-600 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
          </div>
        </div>
      </article>
    </Link>
  )
}

export default CaseStudyCard
