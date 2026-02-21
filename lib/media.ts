// BUG FIX: Trim trailing slash so we don't get double-slash URLs like
// "http://localhost:1337//uploads/foo.jpg"
const STRAPI_URL = (process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

/**
 * Gets the full URL for a Strapi media asset.
 * Returns an empty string if no URL is provided (safe to use in <img src>).
 */
export function getStrapiMedia(url: string | null | undefined): string {
  if (!url) return ''
  // Already an absolute URL — return as-is
  if (url.startsWith('http') || url.startsWith('//')) return url
  // Relative path — prepend Strapi base URL
  return `${STRAPI_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

/**
 * Gets the alt text for a Strapi image, with a fallback.
 */
export function getStrapiAlt(alt: string | null | undefined, fallback: string): string {
  return alt?.trim() || fallback
}