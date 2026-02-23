/**
 * ─── CASE STUDY NORMALIZATION GUIDE ────────────────────────────────────────
 * 
 * Complete guide for using normalizeCaseStudy() in production
 * 
 * FILE: docs/CASE_STUDY_NORMALIZATION.md
 */

// ═══════════════════════════════════════════════════════════════════════════════
// 1. UNDERSTANDING THE PROBLEM & SOLUTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PROBLEM:
 * --------
 * Before normalization, rendering case study data causes:
 * 
 * 1. "[object Object]" appearing in JSX
 *    <p>{caseStudy.challenge}</p>  // Problem: challenge might be object
 * 
 * 2. Images not displaying
 *    <img src={caseStudy.coverImage} />  // Problem: coverImage is StrapiMedia object
 * 
 * 3. Featured field type uncertainty
 *    {if (caseStudy.featured)} ?  // Problem: might be string, boolean, or null
 * 
 * 4. Strapi v5 response wrapping
 *    // Raw from Strapi: { data: { attributes: { title, ... } } }
 *    // Need to extract: data.attributes
 *
 * SOLUTION:
 * ---------
 * Use normalizeCaseStudy() to convert raw data into strict types:
 * 
 * - All text fields → guaranteed strings
 * - Images → guaranteed URLs (never objects)
 * - Booleans → guaranteed true/false (never strings)
 * - Null/undefined → sensible fallbacks
 * - Safe for React JSX without null checks
 */

// ═══════════════════════════════════════════════════════════════════════════════
// 2. IMPLEMENTATION EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE 1: Case Studies List Page
// ─────────────────────────────────────────────────────────────────────────────

// File: app/case-studies/page.tsx

import { caseStudyService } from '@/services/case-study.service'
import { CaseStudyCard } from '@/components/case-studies/CaseStudyCard'

export default async function CaseStudiesPage() {
  // ✓ Service handles Strapi fetch + normalization
  // ✓ Returns NormalisedCaseStudy[] - all fields are safe strings/booleans
  // ✓ If Strapi fails, returns []
  const caseStudies = await caseStudyService.getAll()

  if (caseStudies.length === 0) {
    return <div>No case studies found</div>
  }

  return (
    <main className="py-24">
      <div className="container-custom">
        <h1>Our Case Studies</h1>

        {/* ✓ Safe to render - all fields guaranteed valid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((cs) => (
            <CaseStudyCard 
              key={cs.documentId}  // documentId is always string
              caseStudy={cs}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE 2: Individual Case Study Detail Page
// ─────────────────────────────────────────────────────────────────────────────

// File: app/case-studies/[slug]/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { caseStudyService } from '@/services/case-study.service'
import { CaseStudyDetail } from '@/components/case-studies/CaseStudyDetail'
import { NormalisedCaseStudy } from '@/lib/strapi'

export default function CaseStudyPage() {
  const params = useParams()
  const slug = params.slug as string

  const [caseStudy, setCaseStudy] = useState<NormalisedCaseStudy | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCaseStudy() {
      // ✓ Service normalizes the data
      const cs = await caseStudyService.getBySlug(slug)
      setCaseStudy(cs)
      setLoading(false)
    }

    loadCaseStudy()
  }, [slug])

  if (loading) return <div>Loading...</div>
  if (!caseStudy) return <div>Case study not found</div>

  return (
    <main>
      {/* ✓ All fields are safe strings/booleans - no [object Object] */}
      <CaseStudyDetail caseStudy={caseStudy} />

      {/* ✓ Can access all fields directly without type checking */}
      <section>
        <h2>{caseStudy.title}</h2>
        <p>Client: {caseStudy.client}</p>
        <p>Sector: {caseStudy.sector}</p>
        <img src={caseStudy.coverImageUrl} alt={caseStudy.title} />
        <p>{caseStudy.challenge}</p>
        <p>{caseStudy.solution}</p>
        <p>{caseStudy.results}</p>
        <p>{caseStudy.methodology}</p>
        {caseStudy.featured && <p>This is a featured case study</p>}
      </section>
    </main>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE 3: Featured Case Studies on Homepage
// ─────────────────────────────────────────────────────────────────────────────

// File: components/home/FeaturedCaseStudiesSection.tsx

import { caseStudyService } from '@/services/case-study.service'
import { CaseStudyCard } from '@/components/case-studies/CaseStudyCard'

export default async function FeaturedCaseStudiesSection() {
  // ✓ Service method filters only featured=true cases
  const featured = await caseStudyService.getFeatured()

  return (
    <section className="py-24 bg-slate-50">
      <div className="container-custom">
        <h2 className="text-4xl font-bold mb-12">Featured Case Studies</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {featured.map((cs) => (
            <CaseStudyCard key={cs.slug} caseStudy={cs} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE 4: Filtering by Sector
// ─────────────────────────────────────────────────────────────────────────────

// File: components/filters/SectorFilter.tsx

'use client'

import { useState, useEffect } from 'react'
import { caseStudyService } from '@/services/case-study.service'
import { CaseStudyCard } from '@/components/case-studies/CaseStudyCard'
import { NormalisedCaseStudy } from '@/lib/strapi'

export default function SectorFilter() {
  const [sectors, setSectors] = useState<string[]>([])
  const [selected, setSelected] = useState<string>('')
  const [cases, setCases] = useState<NormalisedCaseStudy[]>([])

  useEffect(() => {
    async function loadData() {
      // ✓ Get all unique sectors
      const allSectors = await caseStudyService.getAllSectors()
      setSectors(allSectors)

      if (selected) {
        // ✓ Filter cases by sector
        const filtered = await caseStudyService.getBySector(selected)
        setCases(filtered)
      }
    }

    loadData()
  }, [selected])

  return (
    <div>
      {/* Sector buttons */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setSelected('')}
          className={selected === '' ? 'active' : ''}
        >
          All
        </button>
        {sectors.map((sector) => (
          <button
            key={sector}
            onClick={() => setSelected(sector)}
            className={selected === sector ? 'active' : ''}
          >
            {sector}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {cases.map((cs) => (
          <CaseStudyCard key={cs.slug} caseStudy={cs} />
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. TYPE GUARANTEES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Input: Raw Strapi response (could be any shape)
 * Output: Guaranteed structure
 * 
 * GUARANTEED RETURN VALUES (NormalisedCaseStudy):
 * 
 * id:            number           - Always a number, never null
 * documentId:    string           - Always a string, never null/object
 * title:         string           - Always a string (safe for <h1>{title}</h1>)
 * slug:          string           - Always a string (safe for URLs)
 * client:        string           - Always a string (has fallback "Client Name")
 * sector:        string           - Always a string (has fallback "Industry")
 * challenge:     string           - Always a string (has multiline fallback)
 * solution:      string           - Always a string (has multiline fallback)
 * results:       string           - Always a string (has multiline fallback)
 * methodology:   string           - Always a string (has multiline fallback)
 * coverImageUrl: string           - Always a URL string (never object, /placeholder.png fallback)
 * featured:      boolean          - Always true or false (never string, never null)
 * 
 * REACT SAFE OPERATIONS (no null checks needed):
 * ✓ {caseStudy.title}
 * ✓ <img src={caseStudy.coverImageUrl} />
 * ✓ {caseStudy.featured && <Badge>Featured</Badge>}
 * ✓ caseStudy.challenge.split('\n')
 * ✓ All string methods: .trim(), .split(), .length, etc.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// 4. HANDLING DIFFERENT STRAPI RESPONSE FORMATS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * normalizeCaseStudy() handles both response structures:
 * 
 * FORMAT 1: Flat v5 Response (new Strapi v5 default)
 * ────────────────────────────────────────────────
 * {
 *   id: 1,
 *   documentId: 'abc123',
 *   title: 'Case Study Title',
 *   slug: 'case-study-title',
 *   coverImage: { url: '/uploads/image.jpg', ... },
 *   featured: true,
 *   ...
 * }
 * 
 * FORMAT 2: Nested Response (some Strapi configs or older versions)
 * ────────────────────────────────────────────────────────────────
 * {
 *   id: 1,
 *   data: {
 *     attributes: {
 *       title: 'Case Study Title',
 *       slug: 'case-study-title',
 *       coverImage: { data: { attributes: { url: '/uploads/image.jpg' } } },
 *       featured: true,
 *       ...
 *     }
 *   }
 * }
 * 
 * normalizeCaseStudy() automatically detects and handles BOTH ✓
 * Just pass the raw response directly
 */

// ═══════════════════════════════════════════════════════════════════════════════
// 5. ERROR HANDLING & DEBUGGING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Production Monitoring:
 * 
 * 1. Service method logs normalization errors
 *    → Check browser console for "Error normalizing case studies"
 * 
 * 2. Fallback values ensure UI never breaks
 *    → All empty fields get sensible defaults
 *    → Images fallback to /placeholder.png
 * 
 * 3. Type safety prevents runtime errors
 *    → TypeScript catches field name typos at build time
 *    → Can't accidentally render objects
 * 
 * Example: Monitoring
 * ──────────────────
 * const cases = await caseStudyService.getAll()
 * // If error occurs:
 * //   - Error logged to console
 * //   - cases = [] (empty array)
 * //   - UI shows graceful "No case studies" state
 */

// ═══════════════════════════════════════════════════════════════════════════════
// 6. INTEGRATION CHECKLIST
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ✓ Import normalizeCaseStudy from @/lib/strapi
 * ✓ Import caseStudyService from @/services/case-study.service
 * ✓ Import NormalisedCaseStudy type for TypeScript
 * ✓ Use caseStudyService.getAll() or .getBySlug(slug)
 * ✓ Pass normalized data to components (no raw Strapi data)
 * ✓ Never call normalizeCaseStudy() directly in components (use service)
 * ✓ Access fields without null checks: {caseStudy.title}
 * ✓ Test with Strapi offline to verify fallbacks work
 * ✓ Monitor error logs for normalization issues
 */

export {}
