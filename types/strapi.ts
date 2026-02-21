/**
 * types/strapi.ts
 *
 * FIXES BUG 7: global.ts, InsightCard.tsx, InsightGrid.tsx all import
 * StrapiData and StrapiImage from this file — which was MISSING, causing
 * "Module not found: Can't resolve '@/types/strapi'" crash on every page.
 *
 * Strapi v5 returns FLAT objects — NO .attributes wrapper.
 * All types here reflect that flat structure.
 *
 * FILE PATH: types/strapi.ts
 */

// ─── Core v5 response envelopes ───────────────────────────────────────────────

export interface StrapiListResponse<T> {
  data: T[]
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface StrapiSingleResponse<T> {
  data: T
  meta: Record<string, unknown>
}

// ─── Generic flat entity (used by global.ts as StrapiData<T>) ────────────────

/**
 * StrapiData<T> — base type for any Strapi v5 flat entity.
 * Example: StrapiData<GlobalAttributes> gives { id, documentId, siteName, ... }
 */
export type StrapiData<T> = {
  id: number
  documentId: string
} & T

// ─── Media / Image ─────────────────────────────────────────────────────────────

/**
 * StrapiImage — flat v5 media shape.
 * NOT { data: { attributes: { url } } } (that was v4).
 * v5: the image IS the object: { url, alternativeText, ... }
 */
export interface StrapiImage {
  id?: number
  url: string
  alternativeText?: string | null
  width?: number | null
  height?: number | null
  formats?: {
    thumbnail?: { url: string; width: number; height: number }
    small?:     { url: string; width: number; height: number }
    medium?:    { url: string; width: number; height: number }
    large?:     { url: string; width: number; height: number }
  } | null
}

// ─── Backward-compat alias (old code used StrapiEntity<T> with .attributes) ──

/**
 * @deprecated Strapi v5 is flat — no .attributes. Kept only so old
 * code that references this type does not crash with "not found".
 * Migrate usages to StrapiData<T> when possible.
 */
export interface StrapiEntity<T> {
  id: number
  attributes: T
}