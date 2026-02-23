/**
 * services/case-study.service.ts
 *
 * ─── CASE STUDY DATA ACCESS LAYER ────────────────────────────────────────
 * Provides data fetching and normalization for case studies.
 * Uses apiFetchSafe — never throws, always returns data or empty fallback.
 *
 * FEATURES:
 * ✓ Fetches from Strapi /api/case-studies endpoint
 * ✓ Normalizes raw data using normalizeCaseStudy()
 * ✓ Handles both flat and nested response structures
 * ✓ Graceful fallback when Strapi is unavailable
 * ✓ Type-safe TypeScript throughout
 *
 * FILE PATH: src/services/case-study.service.ts
 */

import { apiFetchSafe, StrapiListResponse } from '@/lib/api-client'
import { CaseStudy, NormalisedCaseStudy, normalizeCaseStudy } from '@/lib/strapi'

export type { NormalisedCaseStudy as CaseStudy }

export const caseStudyService = {
  /**
   * Fetch all case studies from Strapi
   * Returns normalized data safe for React rendering
   * Returns [] if Strapi unreachable — never throws
   */
  async getAll(): Promise<NormalisedCaseStudy[]> {
    const res = await apiFetchSafe<StrapiListResponse<CaseStudy>>(
      '/case-studies?populate=*&sort=createdAt:desc',
      { next: { revalidate: 300 } } as RequestInit
    )
    
    if (!res?.data) return []
    return res.data.map(normalizeCaseStudy)
  },

  /**
   * Fetch only featured case studies (e.g., for homepage)
   * Useful for showcasing top case studies
   */
  async getFeatured(): Promise<NormalisedCaseStudy[]> {
    const cases = await this.getAll()
    return cases.filter((cs) => cs.featured === true)
  },

  /**
   * Fetch a single case study by slug
   * Used for /case-studies/[slug] detail page
   * Returns normalized data or null if not found
   */
  async getBySlug(slug: string): Promise<NormalisedCaseStudy | null> {
    try {
      const res = await apiFetchSafe<StrapiListResponse<CaseStudy>>(
        `/case-studies?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`,
        { next: { revalidate: 300 } } as RequestInit
      );

      if (!res || !res.data || res.data.length === 0) {
        console.error(`Case study not found for slug: ${slug}`);
        return null;
      }

      const raw = res.data[0];
      return normalizeCaseStudy(raw);
    } catch (error) {
      console.error(`Error fetching case study by slug: ${slug}`, error);
      return null;
    }
  },

  /**
   * Fetch case studies by sector/industry
   * Useful for filtering pages
   */
  async getBySector(sector: string): Promise<NormalisedCaseStudy[]> {
    const cases = await this.getAll()
    return cases.filter((cs) => cs.sector.toLowerCase() === sector.toLowerCase())
  },

  /**
   * Get all unique sectors from case studies
   * Useful for filter UI
   */
  async getAllSectors(): Promise<string[]> {
    const cases = await this.getAll()
    const sectors = new Set(cases.map((cs) => cs.sector))
    return Array.from(sectors).sort()
  },

  /**
   * Get all case study slugs for generateStaticParams
   * Used in app/case-studies/[slug]/page.tsx
   */
  async getAllSlugs(): Promise<string[]> {
    const res = await apiFetchSafe<StrapiListResponse<Pick<CaseStudy, 'slug'>>>(
      '/case-studies?fields[0]=slug&pagination[pageSize]=100'
    )
    return (res?.data ?? []).map((cs) => cs.slug).filter(Boolean)
  },
}
