/**
 * types/insight.ts
 *
 * FIXES BUG 10: InsightCard.tsx and InsightGrid.tsx both import
 * `Insight` from '@/types/insight' — which was MISSING.
 *
 * Handles Strapi v5 flat format AND both field name variants:
 *   featuredImage (camelCase) OR featured_image (snake_case)
 *   publishDate   (camelCase) OR publish_date   (snake_case)
 *
 * FILE PATH: types/insight.ts
 */

import type { StrapiImage } from './strapi'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

function resolveUrl(url?: string | null): string {
  if (!url) return '/placeholder.png'
  if (url.startsWith('http') || url.startsWith('//')) return url
  return `${STRAPI_URL}${url}`
}

/** Raw shape from Strapi v5 insight / case-study collection (flat — no .attributes) */
export interface InsightRaw {
  id: number
  documentId: string
  title: string
  slug: string
  excerpt?: string | null
  content?: string | null
  /** Strapi v5 camelCase field name */
  featuredImage?: StrapiImage | null
  /** Strapi v4 snake_case field name — kept for compat */
  featured_image?: StrapiImage | null
  category?: string | null
  /** Strapi v5 camelCase */
  publishDate?: string | null
  /** Strapi v4 snake_case */
  publish_date?: string | null
  readTime?: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Insight — normalised shape consumed by InsightCard and InsightGrid.
 * All fields are safe (no nulls, no undefined).
 *
 * InsightCard uses: imageUrl, imageAlt, category, publishDate, slug, title, excerpt
 */
export interface Insight {
  id: number
  documentId: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  publishDate: string
  readTime: string
  /** Fully resolved URL — use directly as <Image src={insight.imageUrl} /> */
  imageUrl: string
  imageAlt: string
}

/** Transforms raw Strapi v5 insight into the normalised Insight shape */
export function normaliseInsight(raw: InsightRaw): Insight {
  const image = raw.featuredImage ?? raw.featured_image ?? null
  return {
    id:          raw.id,
    documentId:  raw.documentId,
    title:       raw.title       ?? '',
    slug:        raw.slug        ?? '',
    excerpt:     raw.excerpt     ?? '',
    content:     raw.content     ?? '',
    category:    raw.category    ?? 'Research',
    publishDate: raw.publishDate ?? raw.publish_date ?? raw.createdAt ?? '',
    readTime:    raw.readTime    ?? '5 min read',
    imageUrl:    resolveUrl(image?.url),
    imageAlt:    image?.alternativeText ?? raw.title ?? '',
  }
}