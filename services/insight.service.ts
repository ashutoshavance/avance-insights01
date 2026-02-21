/**
 * services/insight.service.ts
 *
 * ─── BUGS FIXED ──────────────────────────────────────────────────────────────
 *
 * FIX 1 (CRITICAL): Returns normalised Insight from @/types/insight — NOT raw InsightRaw.
 *   InsightCard.tsx expects Insight with guaranteed fields: imageUrl, imageAlt, publishDate.
 *   Original returned raw InsightRaw which has: featuredImage?: StrapiMedia | null.
 *   InsightCard crashed trying to access insight.imageUrl (undefined on raw type).
 *   FIX: Call normaliseInsight() on every item before returning.
 *
 * FIX 2: apiFetch → apiFetchSafe
 *   apiFetch throws on error. While the try/catch wrapping worked, apiFetchSafe is
 *   cleaner and consistent with all other services. No UI crashes on Strapi downtime.
 *
 * FIX 3: { revalidate: 60 } as any → { next: { revalidate: 60 } } as RequestInit
 *   RequestInit has NO 'revalidate' key. The old format silently disabled all
 *   Next.js ISR caching. Correct Next.js 13+ format: { next: { revalidate: N } }.
 *
 * FILE PATH: src/services/insight.service.ts
 */

import { apiFetchSafe, StrapiListResponse } from '@/lib/api-client'
import { InsightRaw, getInsightDate, getStrapiMedia } from '@/lib/strapi'
import { Insight, InsightRaw as InsightRawType, normaliseInsight } from '@/types/insight'

export type { Insight }
export { getInsightDate, getStrapiMedia }

export const insightService = {
  /**
   * Returns paginated insights, normalised for UI consumption.
   * InsightCard receives the normalised Insight type — imageUrl/imageAlt are safe strings.
   * Returns { data: [], total: 0 } if Strapi is unreachable — never throws.
   */
  async getAll(page = 1, pageSize = 10): Promise<{ data: Insight[]; total: number }> {
    const res = await apiFetchSafe<StrapiListResponse<InsightRaw>>(
      `/insights?populate=*&sort=createdAt:desc` +
      `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      // FIX 3: was { revalidate: 60 } as any — wrong format, caching was silently disabled
      { next: { revalidate: 60 } } as RequestInit
    )
    if (!res?.data) return { data: [], total: 0 }
    return {
      data:  res.data.map((raw) => normaliseInsight(raw as InsightRawType)),
      total: res.meta?.pagination?.total ?? 0,
    }
  },

  /**
   * Returns 4 most recent insights for homepage FeaturedInsights section.
   * Returns [] if Strapi is unreachable — never throws.
   */
  async getFeatured(): Promise<Insight[]> {
    const res = await apiFetchSafe<StrapiListResponse<InsightRaw>>(
      '/insights?populate=*&sort=createdAt:desc&pagination[pageSize]=4',
      { next: { revalidate: 60 } } as RequestInit
    )
    if (!res?.data) return []
    return res.data.map((raw) => normaliseInsight(raw as InsightRawType))
  },

  /**
   * Returns single insight by slug for /insights/[slug] page.
   * Returns null if not found or Strapi unreachable — never throws.
   */
  async getBySlug(slug: string): Promise<Insight | null> {
    const res = await apiFetchSafe<StrapiListResponse<InsightRaw>>(
      `/insights?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`,
      { next: { revalidate: 60 } } as RequestInit
    )
    const raw = res?.data?.[0]
    return raw ? normaliseInsight(raw as InsightRawType) : null
  },

  /**
   * Returns all slugs — used for generateStaticParams in app/insights/[slug]/page.tsx
   */
  async getAllSlugs(): Promise<string[]> {
    const res = await apiFetchSafe<StrapiListResponse<Pick<InsightRaw, 'slug'>>>(
      '/insights?fields[0]=slug&pagination[pageSize]=200'
    )
    return (res?.data ?? []).map((i) => i.slug).filter(Boolean)
  },
}