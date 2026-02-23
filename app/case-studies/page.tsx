// Case Studies Page

import { useEffect, useState } from 'react'
import { apiFetchSafe } from '@/lib/api-client'
import { getStrapiMedia } from '@/lib/strapi'
import { getUnsplashUrl } from '@/lib/media'
import { caseStudyService } from '@/services/case-study.service';
import CaseStudyCard from '@/components/case-studies/CaseStudyCard';

// Rich fallback case studies similar to the `SERVICES` structure
const FALLBACK_CASE_STUDIES = [
  {
    id: 1,
    title: 'Market Entry Strategy for FMCG Brand',
    slug: 'market-entry-strategy-fmcg',
    category: 'Market Research',
    imageUrl: '/placeholder-case-1.jpg',
  },
  {
    id: 2,
    title: 'Impact Evaluation of Rural Health Program',
    slug: 'impact-evaluation-rural-health',
    category: 'Social Research',
    imageUrl: '/placeholder-case-2.jpg',
  },
]

export default async function CaseStudiesPage() {
  // Fetch normalized case studies from the service (server-side)
  const caseStudies = await caseStudyService.getAll();

  // If Strapi returns nothing, fall back to local placeholders mapped to normalized shape
  const items = caseStudies.length
    ? caseStudies
    : FALLBACK_CASE_STUDIES.map((f) => ({
        id: Number(f.id),
        documentId: String(f.id),
        title: f.title,
        slug: f.slug,
        client: '',
        sector: f.category || 'Case Study',
        challenge: '',
        solution: '',
        results: '',
        methodology: '',
        coverImageUrl: f.imageUrl,
        featured: false,
      }));

  return (
    <div className="pt-20">
      <section className="py-16 container-custom">
        <h1 className="section-title">Case Studies</h1>
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {items.map((c) => (
            <CaseStudyCard key={c.slug || c.documentId || c.id} caseStudy={c} />
          ))}
        </div>
      </section>
    </div>
  );
}