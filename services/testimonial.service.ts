/**
 * services/testimonial.service.ts
 *
 * ─── FIXES ───────────────────────────────────────────────────────────────────
 * FIX 1: apiFetch → apiFetchSafe — Strapi downtime returns [] instead of crashing.
 * FIX 2: { revalidate: 300 } as any → { next: { revalidate: 300 } } as RequestInit
 *   RequestInit has no 'revalidate' key. Old format silently disabled all caching.
 *
 * FILE PATH: src/services/testimonial.service.ts
 *
 * Strapi CMS Collection: testimonials
 * API endpoint: GET /api/testimonials?populate=*
 * Fields: quote (required), authorName, authorRole, company, rating (1-5), avatar (media)
 */

import { apiFetchSafe, StrapiListResponse } from '@/lib/api-client'
import {
  Testimonial,
  getStrapiMedia,
  getTestimonialAuthor,
  getTestimonialRole,
} from '@/lib/strapi'

export type { Testimonial }
export { getTestimonialAuthor, getTestimonialRole }

export const testimonialService = {
  /**
   * Returns all testimonials sorted by creation date.
   * Returns [] if Strapi is unreachable — never throws.
   */
  async getAll(): Promise<Testimonial[]> {
    const res = await apiFetchSafe<StrapiListResponse<Testimonial>>(
      '/testimonials?populate=*&sort=createdAt:desc',
      { next: { revalidate: 300 } } as RequestInit
    )
    return res?.data ?? []
  },

  /**
   * Returns testimonials with rating ≥ 4 — for featured/homepage sections.
   * Falls back to all testimonials if none have ratings set.
   */
  async getFeatured(): Promise<Testimonial[]> {
    const all = await testimonialService.getAll()
    const high = all.filter((t) => (t.rating ?? 0) >= 4)
    return high.length > 0 ? high : all
  },

  /**
   * Resolves the avatar URL — falls back to placeholder if none set.
   */
  getAvatarUrl(t: Testimonial): string {
    return t.avatar?.url
      ? getStrapiMedia(t.avatar.url)
      : '/avatar-placeholder.png'
  },
}