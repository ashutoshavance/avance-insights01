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

/**
 * Strapi v5 Rich Text Block structure
 * Rich Text editor returns array of block objects with text content
 */
export interface RichTextBlock {
  type?: string
  children?: Array<{
    type?: string
    text?: string
    bold?: boolean
    italic?: boolean
    [key: string]: any
  }>
  level?: number
  [key: string]: any
}

/** Raw shape from Strapi v5 services collection (flat — no .attributes) */
export interface Service {
  id:                number
  documentId:        string
  title:             string
  slug:              string
  shortDescription?: string | null
  fullDescription?:  string | RichTextBlock[] | null  // Can be string or Rich Text blocks
  description?:      string | null   // legacy field name
  category?:         string | null
  iconName?:         string | null
  icon?:             string | null   // legacy field name
  features?:         string[] | Record<string, any>[] | Record<string, string> | null // Flexible features input
  overview?: Array<{
    id?: string | number
    title?: string
    description?: string
    content?: string
    [key: string]: any
  }> | null
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
  overview:        Array<{
    id?: string | number
    title: string
    description: string
  }>
}

/**
 * ─── RICH TEXT BLOCK CONVERTERS ────────────────────────────────────────────────
 * Converts Strapi Rich Text Blocks into plain text for React rendering
 */

/**
 * Extracts all text content from a single Rich Text Block object
 * @param block - A single block from Strapi Rich Text editor
 * @returns Plain text string
 */
function extractTextFromBlock(block: RichTextBlock): string {
  if (!block || typeof block !== 'object') return ''
  
  // If block has direct text property
  if (typeof block.text === 'string') {
    return block.text
  }
  
  // If block has children array, recursively extract text
  if (Array.isArray(block.children)) {
    return block.children
      .map((child: any) => {
        if (typeof child.text === 'string') return child.text
        if (typeof child === 'string') return child
        return extractTextFromBlock(child)
      })
      .filter(Boolean)
      .join(' ')
  }
  
  return ''
}

/**
 * Converts Strapi Rich Text Blocks array into plain text string
 * Handles both array of blocks and plain string inputs
 * @param richText - Raw fullDescription from Strapi (string or RichTextBlock[])
 * @returns Plain text string safe for React rendering
 */
function convertRichTextToString(richText: string | RichTextBlock[] | null | undefined): string {
  // Handle null/undefined
  if (!richText) return ''
  
  // If already a string, just trim and return
  if (typeof richText === 'string') {
    return richText.trim()
  }
  
  // If array of blocks, extract text from each
  if (Array.isArray(richText)) {
    return richText
      .map((block) => extractTextFromBlock(block))
      .filter((text) => text.trim().length > 0)
      .join('\n\n')
      .trim()
  }
  
  // Fallback for unexpected types
  return ''
}

/**
 * ─── FEATURES CONVERTER ────────────────────────────────────────────────────────
 * Converts features from any JSON format into string[]
 */

/**
 * Safely converts features field into string array
 * Handles: string[], objects [], Records, or raw JSON
 * @param features - Raw features from Strapi (can be many formats)
 * @returns Array of feature strings safe for React rendering
 */
function normalizeFeatures(
  features: string[] | Record<string, any>[] | Record<string, string> | string | null | undefined
): string[] {
  // Handle null/undefined
  if (!features) return []
  
  // Already a string array - filter out empty strings
  if (Array.isArray(features)) {
    return features
      .filter((f): f is string | Record<string, any> => {
        if (typeof f === 'string') return f.trim().length > 0
        if (typeof f === 'object' && f !== null) {
          // Handle objects with text/title/name properties
          const text = (f as Record<string, any>).text || 
                       (f as Record<string, any>).title || 
                       (f as Record<string, any>).name || 
                       (f as Record<string, any>).description || 
                       (f as Record<string, any>).label || ''
          return typeof text === 'string' && text.trim().length > 0
        }
        return false
      })
      .map((f) => {
        if (typeof f === 'string') return f.trim()
        // Extract text from object
        const obj = f as Record<string, any>
        const text = obj.text || obj.title || obj.name || obj.description || obj.label || ''
        return String(text).trim()
      })
      .filter((f) => f.length > 0)
  }
  
  // Handle Record<string, string> format (key-value pairs)
  if (typeof features === 'object' && !Array.isArray(features)) {
    return Object.values(features)
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map((value) => value.trim())
  }
  
  // Handle stringified JSON
  if (typeof features === 'string') {
    try {
      const parsed = JSON.parse(features)
      return normalizeFeatures(parsed)
    } catch {
      // If not valid JSON, treat as single feature
      return features.trim().length > 0 ? [features.trim()] : []
    }
  }
  
  // Fallback
  return []
}

/**
 * ─── MAIN NORMALIZATION FUNCTION ──────────────────────────────────────────────
 * Production-ready function that guarantees all returned fields are safe for React
 */

export function normaliseService(s: Service): NormalisedService {
  // Validate input
  if (!s || typeof s !== 'object') {
    throw new Error('normaliseService: Input must be a valid Service object')
  }
  
  // Convert Rich Text Blocks to plain string
  const fullDesc = convertRichTextToString(s.fullDescription) ||
    convertRichTextToString(s.shortDescription) ||
    (typeof s.description === 'string' ? s.description.trim() : '') ||
    ''
  
  // Normalize features from any format to string[]
  const normalizedFeatures = normalizeFeatures(s.features)
  
  // Safely normalize overview array
  const normalizedOverview = Array.isArray(s.overview)
    ? s.overview
        .filter((item) => item && typeof item === 'object')
        .map((item) => ({
          id: item.id,
          title: String(item.title || '').trim(),
          description: String(item.description || item.content || '').trim(),
        }))
        .filter((item) => item.title.length > 0 || item.description.length > 0)
    : []
  
  return {
    id:              s.id ?? 0,
    documentId:      s.documentId ?? '',
    title:           String(s.title || '').trim(),
    slug:            String(s.slug || '').trim(),
    description:     String(s.shortDescription || s.description || '').trim(),
    fullDescription: fullDesc.length > 0
      ? fullDesc
      : `Comprehensive insights and analysis for ${String(s.title || 'this service').trim()}. Our expert team provides detailed research, strategic recommendations, and actionable findings to drive your decision-making.`,
    category:        String(s.category || '').trim(),
    iconName:        String(s.iconName || s.icon || 'BarChart3').trim(),
    features:        normalizedFeatures,
    overview:        normalizedOverview,
  }
}

// ─── Case Study ───────────────────────────────────────────────────────────────

/**
 * Raw Strapi v5 Case Study from the database
 * Handles both nested (data.attributes) and flat responses
 */
export interface CaseStudy {
  id:            number
  documentId:    string
  title:         string
  slug:          string
  client?:       string | null
  sector?:       string | null
  challenge?:    string | null
  solution?:     string | null
  results?:      string | null
  methodology?:  string | null
  coverImage?:   StrapiMedia | null
  featuredImage?: StrapiMedia | null  // Alternative field name
  featured_image?: StrapiMedia | null  // snake_case alternative
  featured?:     boolean | null
  createdAt:     string
  updatedAt:     string
}

/**
 * Normalised Case Study — guaranteed safe for React rendering
 * All fields are strings or proper primitives, never objects
 */
export interface NormalisedCaseStudy {
  id:           number
  documentId:   string
  title:        string
  slug:         string
  client:       string
  sector:       string
  challenge:    string
  solution:     string
  results:      string
  methodology:  string
  coverImageUrl: string
  featured:     boolean
}

/**
 * Production-ready Case Study normalizer
 * 
 * ─── WHAT IT HANDLES ──────────────────────────────────────────────────────
 * ✓ Strapi v5 flat structure (documentId, direct fields)
 * ✓ Nested response structure (data.attributes wrapper)
 * ✓ Media object extraction (turns StrapiMedia into URL)
 * ✓ Rich text and plain text fields
 * ✓ Boolean conversion (featured)
 * ✓ Null/undefined defensive handling
 * ✓ Empty string fallbacks
 * ✓ Fully TypeScript type-safe
 *
 * ─── GUARANTEED RETURN VALUES ──────────────────────────────────────────────
 * All returned fields are:
 *   - Strings (never objects or null)
 *   - Properly trimmed
 *   - Safe for React jsx rendering
 *   - Can be used directly without null checks
 */
export function normalizeCaseStudy(data: any): NormalisedCaseStudy {
  if (!data || typeof data !== 'object') {
    throw new Error('normalizeCaseStudy: Input must be a valid object');
  }

  const cs: Partial<CaseStudy> = data.attributes || data;

  if (!cs || typeof cs !== 'object') {
    throw new Error('normalizeCaseStudy: Could not extract case study data');
  }

  const toSafeString = (value: any, fallback: string = ''): string => {
    if (typeof value === 'string') return value.trim();
    if (typeof value === 'number') return String(value).trim();
    if (value && typeof value === 'object' && 'text' in value) return String(value.text).trim();
    return fallback;
  };

  const getImageUrl = (media: any, csData?: any): string => {
    if (csData) {
      const flatImageCandidates = [
        csData.coverImage,
        csData.featured_image,
        csData.featuredImage,
        csData.attributes?.coverImage,
        csData.attributes?.featured_image,
        csData.attributes?.featuredImage,
      ];

      for (const candidate of flatImageCandidates) {
        if (candidate && typeof candidate === 'object') {
          const url = extractImageUrl(candidate);
          if (url && url !== '/placeholder.png') {
            return url;
          }
        }
      }
    }

    if (media) {
      return extractImageUrl(media);
    }

    return '/placeholder.png';
  };

  const extractImageUrl = (media: any): string => {
    if (!media || typeof media !== 'object') return '/placeholder.png';

    if (typeof media === 'string') {
      return getStrapiMedia(media);
    }

    if (media.url && typeof media.url === 'string') {
      return getStrapiMedia(media.url);
    }

    if (media.formats?.medium?.url) {
      return getStrapiMedia(media.formats.medium.url);
    }

    if (media.formats?.large?.url) {
      return getStrapiMedia(media.formats.large.url);
    }

    if (media.formats?.small?.url) {
      return getStrapiMedia(media.formats.small.url);
    }

    if (media.data?.attributes?.url) {
      return getStrapiMedia(media.data.attributes.url);
    }

    if (media.data?.attributes?.formats?.medium?.url) {
      return getStrapiMedia(media.data.attributes.formats.medium.url);
    }

    return '/placeholder.png';
  };

  return {
    id: cs.id ?? 0,
    documentId: toSafeString(cs.documentId),
    title: toSafeString(cs.title),
    slug: toSafeString(cs.slug),
    client: toSafeString(cs.client),
    sector: toSafeString(cs.sector),
    challenge: toSafeString(cs.challenge),
    solution: toSafeString(cs.solution),
    results: toSafeString(cs.results),
    methodology: toSafeString(cs.methodology),
    coverImageUrl: getImageUrl(cs.coverImage, cs),
    featured: Boolean(cs.featured),
  };
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