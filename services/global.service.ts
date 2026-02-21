/**
 * services/global.service.ts
 *
 * ─── BUGS FIXED (FROM ORIGINAL) ──────────────────────────────────────────────
 * (a) import { StrapiResponse } — does not exist → StrapiSingleResponse
 * (b) import from '@/types/global' — file did not exist → moved to @/lib/strapi
 * (c) import getStrapiMedia from '@/lib/media' — file did not exist → @/lib/strapi
 * (d) strapiGlobal.attributes — Strapi v4 pattern. v5 is flat, no .attributes.
 * (e) apiFetch('/global', { params: { populate: '*' } }) — params object not valid.
 *     Query params must be in the URL string. Changed to apiFetchSafe.
 *
 * FILE PATH: src/services/global.service.ts
 *
 * Strapi CMS: global (Single Type)
 * API endpoint: GET /api/global?populate=*
 * Fields: siteName, siteDescription, contactEmail, contactPhone, address, logo, socialLinks
 */

import { apiFetchSafe, StrapiSingleResponse } from '@/lib/api-client'
import { getStrapiMedia, StrapiGlobal, GlobalSettings } from '@/lib/strapi'

export type { GlobalSettings }

/**
 * Transforms flat Strapi v5 global single-type into GlobalSettings.
 * Returns hardcoded Avance Insights defaults when Strapi is unavailable.
 */
function normaliseGlobal(raw: StrapiGlobal | null | undefined): GlobalSettings {
  if (!raw) {
    return {
      siteName:        'Avance Insights',
      siteDescription: 'One-Stop Platform Driven by Data, Defined by Excellence',
      contactEmail:    'info@avanceinsights.in',
      contactPhone:    '',
      address:         'New Delhi, India',
      logoUrl:         '/logo.png',
      socialLinks:     [],
    }
  }

  return {
    siteName:        raw.siteName        ?? 'Avance Insights',
    siteDescription: raw.siteDescription ?? 'One-Stop Platform Driven by Data, Defined by Excellence',
    contactEmail:    raw.contactEmail    ?? 'info@avanceinsights.in',
    contactPhone:    raw.contactPhone    ?? '',
    address:         raw.address         ?? 'New Delhi, India',
    logoUrl:         raw.logo?.url ? getStrapiMedia(raw.logo.url) : '/logo.png',
    socialLinks:     Array.isArray(raw.socialLinks) ? raw.socialLinks : [],
  }
}

export const globalService = {
  /**
   * Returns global company settings from Strapi.
   * Falls back to Avance Insights defaults if Strapi is unreachable.
   * Safe to call in RSC layouts — never throws.
   */
  async getSettings(): Promise<GlobalSettings> {
    const res = await apiFetchSafe<StrapiSingleResponse<StrapiGlobal>>(
      '/global?populate=*',
      { next: { revalidate: 3600 } } as RequestInit
    )
    return normaliseGlobal(res?.data ?? null)
  },
}