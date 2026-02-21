/**
 * lib/strapi.ts
 *
 * ─── SINGLE SOURCE OF TRUTH FOR ALL STRAPI TYPES + UTILITIES ─────────────────
 *
 * All service files import from here. This keeps types consistent across
 * the entire app and prevents the "module not found" crashes seen in the originals.
 *
 * WHAT'S HERE:
 *   Types:     StrapiMedia / StrapiImage, Service, NormalisedService,
 *              InsightRaw, Insight (alias), Client, Testimonial, TeamMember,
 *              SurveyRaw, GlobalSettings, StrapiGlobal
 *   Functions: normaliseService, getStrapiMedia, getInsightDate,
 *              getTestimonialAuthor, getTestimonialRole, isSurveyActive
 *   Re-exports: apiFetch, apiFetchSafe, StrapiListResponse, StrapiSingleResponse
 *
 * FILE PATH: src/lib/strapi.ts
 */

import {
  apiFetch,
  apiFetchSafe,
  StrapiListResponse,
  StrapiSingleResponse,
} from '@/lib/api-client'

export {
  apiFetch,
  apiFetchSafe,
  type StrapiListResponse,
  type StrapiSingleResponse,
}

// ─── Config ───────────────────────────────────────────────────────────────────

const STRAPI_URL = (
  process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337'
).replace(/\/$/, '')

// ─── Media ────────────────────────────────────────────────────────────────────

/**
 * Strapi v5 flat media object.
 * NOT v4's nested { data: { attributes: { url } } }
 */
export interface StrapiMedia {
  id?:              number
  url:              string
  alternativeText?: string | null
  width?:           number | null
  height?:          number | null
  formats?: {
    thumbnail?: { url: string }
    small?:     { url: string }
    medium?:    { url: string }
    large?:     { url: string }
  } | null
}

/** @deprecated Use StrapiMedia. Kept for backward compatibility. */
export type StrapiImage = StrapiMedia

// ─── Service ──────────────────────────────────────────────────────────────────

/** Raw shape from Strapi v5 services collection (flat — no .attributes) */
export interface Service {
  id:                number
  documentId:        string
  title:             string
  slug:              string
  shortDescription?: string | null
  fullDescription?:  string | null
  description?:      string | null   // legacy field name
  category?:         string | null
  iconName?:         string | null
  icon?:             string | null   // legacy field name
  features?:         string[] | null
  createdAt:         string
  updatedAt:         string
}

/** Normalised shape — all fields guaranteed safe strings/arrays for UI */
export interface NormalisedService {
  id:              number
  documentId:      string
  title:           string
  slug:            string
  description:     string
  fullDescription: string
  category:        string
  iconName:        string
  features:        string[]
}

export function normaliseService(s: Service): NormalisedService {
  return {
    id:              s.id,
    documentId:      s.documentId,
    title:           s.title            ?? '',
    slug:            s.slug             ?? '',
    description:     s.shortDescription ?? s.description ?? '',
    fullDescription: s.fullDescription  ?? s.shortDescription ?? s.description ?? '',
    category:        s.category         ?? '',
    iconName:        s.iconName         ?? s.icon ?? 'BarChart3',
    features:        Array.isArray(s.features) ? s.features : [],
  }
}

// ─── Insight ──────────────────────────────────────────────────────────────────

/**
 * InsightRaw — raw flat Strapi v5 insight.
 * Named InsightRaw to avoid collision with the normalised Insight in @/types/insight.
 * Service methods receive InsightRaw from Strapi, then call normaliseInsight() before returning.
 */
export interface InsightRaw {
  id:              number
  documentId:      string
  title:           string
  slug:            string
  excerpt?:        string | null
  content?:        string | null
  featuredImage?:  StrapiMedia | null
  featured_image?: StrapiMedia | null  // snake_case alias from some Strapi configs
  category?:       string | null
  publishDate?:    string | null
  publish_date?:   string | null       // snake_case alias
  readTime?:       string | null
  createdAt:       string
  updatedAt:       string
}

/**
 * @deprecated Alias kept so legacy imports of `Insight` from this file still compile.
 * New code: use InsightRaw for raw data OR import Insight from @/types/insight for normalised.
 */
export type Insight = InsightRaw

// ─── Client ───────────────────────────────────────────────────────────────────

export interface Client {
  id:        number
  documentId: string
  name:      string
  logo?:     StrapiMedia | null
  website?:  string | null
  sector?:   string | null
  featured?: boolean | null
}

// ─── Testimonial ──────────────────────────────────────────────────────────────

export interface Testimonial {
  id:           number
  documentId:   string
  quote:        string
  authorName?:  string | null
  author_name?: string | null  // snake_case alias
  authorRole?:  string | null
  author_role?: string | null  // snake_case alias
  company?:     string | null
  rating?:      number | null
  avatar?:      StrapiMedia | null
}

// ─── Team Member ──────────────────────────────────────────────────────────────

export interface TeamMember {
  id:         number
  documentId: string
  name:       string
  role?:      string | null
  bio?:       string | null
  photo?:     StrapiMedia | null
}

// ─── Survey (raw — used by survey.service.ts) ─────────────────────────────────

/** Raw Strapi v5 survey from the live-surveys collection */
export interface SurveyRaw {
  id:           number
  documentId:   string
  title:        string
  description?: string | null
  category?:    string | null
  audience?:    string | null
  surveyStatus: 'Active' | 'Inactive' | string
  embedUrl:     string
  createdAt:    string
  updatedAt:    string
  publishedAt?: string | null
}

// ─── Global / Company Settings ────────────────────────────────────────────────

/** Normalised company-wide settings — used in Layout, Footer, Navbar */
export interface GlobalSettings {
  siteName:        string
  siteDescription: string
  contactEmail:    string
  contactPhone:    string
  address:         string
  logoUrl:         string
  socialLinks:     { platform: string; url: string }[]
}

/** Raw Strapi v5 global single-type */
export interface StrapiGlobal {
  id:               number
  documentId?:      string
  siteName?:        string | null
  siteDescription?: string | null
  contactEmail?:    string | null
  contactPhone?:    string | null
  address?:         string | null
  logo?:            StrapiMedia | null
  favicon?:         StrapiMedia | null
  socialLinks?:     { platform: string; url: string }[] | null
}

// ─── Utility Functions ────────────────────────────────────────────────────────

/**
 * getStrapiMedia — resolves any Strapi media URL to a full absolute URL.
 * Handles relative paths, already-absolute URLs, null/undefined → placeholder.
 */
export function getStrapiMedia(url: string | null | undefined): string {
  if (!url) return '/placeholder.png'
  if (url.startsWith('http') || url.startsWith('//')) return url
  return `${STRAPI_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

/** Returns the best available date field from an InsightRaw */
export function getInsightDate(insight: InsightRaw): string {
  return insight.publishDate ?? insight.publish_date ?? insight.createdAt ?? ''
}

/** Returns authorName — supports both camelCase and snake_case field names */
export function getTestimonialAuthor(t: Testimonial): string {
  return t.authorName ?? t.author_name ?? 'Anonymous'
}

/** Returns authorRole — supports both camelCase and snake_case field names */
export function getTestimonialRole(t: Testimonial): string {
  return t.authorRole ?? t.author_role ?? ''
}

/** Returns true when a SurveyRaw is Active — case-insensitive */
export function isSurveyActive(survey: SurveyRaw): boolean {
  return typeof survey.surveyStatus === 'string' &&
    survey.surveyStatus.toLowerCase() === 'active'
}