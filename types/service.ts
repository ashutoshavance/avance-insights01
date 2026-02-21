/**
 * types/service.ts
 *
 * FIXES BUG 8: ServicesSection.tsx and Navbar.tsx both import
 * `Service` from '@/types/service' — which was MISSING, causing
 * TypeScript error and runtime crash.
 *
 * FILE PATH: types/service.ts
 */

/** Raw shape returned by Strapi v5 (flat — no .attributes) */
export interface ServiceRaw {
  id: number
  documentId: string
  title: string
  slug: string
  /** Strapi schema field (maps to description in UI) */
  shortDescription?: string | null
  /** Full detail description */
  fullDescription?: string | null
  /** Legacy alias — some Strapi setups use this name */
  description?: string | null
  category?: string | null
  /** Icon component name e.g. 'BarChart3' */
  iconName?: string | null
  /** Legacy alias */
  icon?: string | null
  /** Array of feature strings */
  features?: string[] | null
  order?: number | null
  createdAt: string
  updatedAt: string
}

/**
 * Service — normalised shape consumed by ServicesSection, Navbar, etc.
 * All fields are GUARANTEED non-null so UI never crashes on missing data.
 *
 * Export named `Service` to match existing imports:
 *   import { Service } from '@/types/service'
 */
export interface Service {
  id: number
  documentId: string
  title: string
  slug: string
  /** Always populated — mapped shortDescription → description → '' */
  description: string
  /** Full detail — always a string */
  fullDescription: string
  category: string
  /** Icon component name, e.g. 'BarChart3' — always a string */
  iconName: string
  /** Always an array — never null */
  features: string[]
}

/** Transforms raw Strapi v5 service into the normalised Service shape */
export function normaliseService(raw: ServiceRaw): Service {
  return {
    id:              raw.id,
    documentId:      raw.documentId,
    title:           raw.title              ?? '',
    slug:            raw.slug               ?? '',
    description:     raw.shortDescription   ?? raw.description ?? '',
    fullDescription: raw.fullDescription    ?? raw.shortDescription ?? raw.description ?? '',
    category:        raw.category           ?? 'General',
    iconName:        raw.iconName           ?? raw.icon ?? 'BarChart3',
    features:        Array.isArray(raw.features) ? raw.features : [],
  }
}