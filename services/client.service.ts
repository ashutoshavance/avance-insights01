/**
 * services/client.service.ts
 *
 * ─── NEW FILE — was completely missing ───────────────────────────────────────
 * ClientsSection.tsx was hardcoded with 12 static names.
 * This service enables real logos and client data from the CMS.
 *
 * FILE PATH: src/services/client.service.ts
 *
 * Strapi CMS Collection: clients
 * Create at: http://localhost:1337/admin → Content Manager → Clients
 *
 * Fields to create in Strapi:
 *   name      (Text, required)       — company name
 *   logo      (Media, single image)  — client logo
 *   sector    (Text)                 — FMCG / Media / Finance / NGO / Govt
 *   website   (Text)                 — optional URL
 *   featured  (Boolean)              — show on homepage
 */

import { apiFetchSafe, StrapiListResponse } from '@/lib/api-client'
import { Client, getStrapiMedia } from '@/lib/strapi'

export type { Client }

/**
 * Fallback client list from Avance PPT — shown when CMS has no data yet.
 * Replace with real logos by populating the clients collection in Strapi.
 */
export const FALLBACK_CLIENTS: Client[] = [
  { id: 1,  documentId: 'fallback-1',  name: 'Times of India',    sector: 'Media' },
  { id: 2,  documentId: 'fallback-2',  name: 'TATA Group',         sector: 'Conglomerate' },
  { id: 3,  documentId: 'fallback-3',  name: 'Sony',               sector: 'Media' },
  { id: 4,  documentId: 'fallback-4',  name: 'Hindustan Unilever', sector: 'FMCG' },
  { id: 5,  documentId: 'fallback-5',  name: 'ICICI Bank',         sector: 'Finance' },
  { id: 6,  documentId: 'fallback-6',  name: 'Reliance',           sector: 'Conglomerate' },
  { id: 7,  documentId: 'fallback-7',  name: 'Godrej',             sector: 'FMCG' },
  { id: 8,  documentId: 'fallback-8',  name: 'Nestle',             sector: 'FMCG' },
  { id: 9,  documentId: 'fallback-9',  name: 'Airtel',             sector: 'Telecom' },
  { id: 10, documentId: 'fallback-10', name: 'HDFC',               sector: 'Finance' },
  { id: 11, documentId: 'fallback-11', name: 'ITC',                sector: 'FMCG' },
  { id: 12, documentId: 'fallback-12', name: 'Mahindra',           sector: 'Auto' },
]

export const clientService = {
  /**
   * Returns all clients from Strapi.
   * Falls back to FALLBACK_CLIENTS if CMS is empty or unreachable — never throws.
   */
  async getAll(): Promise<Client[]> {
    const res = await apiFetchSafe<StrapiListResponse<Client>>(
      '/clients?populate=*&sort=name:asc',
      { next: { revalidate: 600 } } as RequestInit
    )
    if (!res?.data || res.data.length === 0) return FALLBACK_CLIENTS
    return res.data
  },

  /**
   * Returns featured clients (where featured === true in Strapi).
   * Falls back to first 8 from getAll() if no featured flag is set.
   */
  async getFeatured(): Promise<Client[]> {
    const res = await apiFetchSafe<StrapiListResponse<Client>>(
      '/clients?filters[featured][$eq]=true&populate=*&sort=name:asc',
      { next: { revalidate: 600 } } as RequestInit
    )
    if (!res?.data || res.data.length === 0) {
      const all = await clientService.getAll()
      return all.slice(0, 8)
    }
    return res.data
  },

  /** Resolves full logo URL. Returns empty string if no logo set. */
  getLogoUrl(client: Client): string {
    return client.logo?.url ? getStrapiMedia(client.logo.url) : ''
  },

  /** First letter of client name — used as avatar fallback in UI. */
  getInitial(client: Client): string {
    return (client.name ?? '').charAt(0).toUpperCase() || '?'
  },
}