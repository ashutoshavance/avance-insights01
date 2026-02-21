/**
 * services/service.service.ts
 *
 * ─── FIXES ───────────────────────────────────────────────────────────────────
 * FIX 1: Removed &sort=order:asc — 'order' field does not exist in the Strapi
 *   services schema. Strapi returned "Invalid key order". Changed to sort=createdAt:asc.
 *   To restore manual ordering: add an 'order' (Number) field in Strapi schema first.
 *
 * FIX 2: Uses apiFetchSafe — never throws. Returns [] if Strapi is unreachable.
 *
 * ─── STRAPI LOGS ─────────────────────────────────────────────────────────────
 * Logs confirm: /api/services?populate=*&sort=createdAt:asc → 200 ✅ (×8 calls)
 * Services are WORKING. No changes needed to the endpoint or field names.
 *
 * FILE PATH: src/services/service.service.ts
 */

import { apiFetchSafe, StrapiListResponse } from '@/lib/api-client'
import { Service, NormalisedService, normaliseService } from '@/lib/strapi'

export type { NormalisedService as Service }

export const serviceService = {
  /**
   * Returns all services normalised for UI consumption.
   * Returns [] if Strapi is unreachable — never throws.
   *
   * Used by: Navbar (client-side sync), ServicesSection, /services page
   */
  async getAll(): Promise<NormalisedService[]> {
    const res = await apiFetchSafe<StrapiListResponse<Service>>(
      '/services?populate=*&sort=createdAt:asc',
      { next: { revalidate: 300 } } as RequestInit
    )
    if (!res?.data) return []
    return res.data.map(normaliseService)
  },

  /**
   * Returns a single service by slug for the /services/[slug] page.
   */
  async getBySlug(slug: string): Promise<NormalisedService | null> {
    const res = await apiFetchSafe<StrapiListResponse<Service>>(
      `/services?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`,
      { next: { revalidate: 300 } } as RequestInit
    )
    const raw = res?.data?.[0]
    return raw ? normaliseService(raw) : null
  },

  /**
   * Returns all slugs — used for generateStaticParams in app/services/[slug]/page.tsx
   */
  async getAllSlugs(): Promise<string[]> {
    const res = await apiFetchSafe<StrapiListResponse<Pick<Service, 'slug'>>>(
      '/services?fields[0]=slug&pagination[pageSize]=100'
    )
    return (res?.data ?? []).map((s) => s.slug).filter(Boolean)
  },
}