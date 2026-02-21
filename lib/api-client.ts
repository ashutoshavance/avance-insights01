const STRAPI_URL = (
  process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337'
).replace(/\/$/, '')

// Token exists only server-side — undefined in browser (safe by design)
const RAW_TOKEN =
  typeof process !== 'undefined' ? (process.env.STRAPI_API_TOKEN ?? '') : ''

const PLACEHOLDER_TOKENS = [
  'paste_your_token_here',
  'your_token_here',
  'REPLACE_ME',
  '',
]
const STRAPI_TOKEN = PLACEHOLDER_TOKENS.includes(RAW_TOKEN.trim())
  ? undefined
  : RAW_TOKEN.trim()

// ─── Response Envelope Types ──────────────────────────────────────────────────

/** Wraps all Strapi collection endpoints. Example: GET /api/services */
export interface StrapiListResponse<T> {
  data: T[]
  meta: {
    pagination?: {
      page:      number
      pageSize:  number
      pageCount: number
      total:     number
    }
  }
}

/** Wraps Strapi single-type endpoints. Example: GET /api/global */
export interface StrapiSingleResponse<T> {
  data: T
  meta: Record<string, unknown>
}

/**
 * @deprecated Kept so legacy code using StrapiResponse<T> still compiles.
 * Use StrapiSingleResponse<T> in new code.
 */
export type StrapiResponse<T> = StrapiSingleResponse<T>

// ─── Internal fetch ───────────────────────────────────────────────────────────

async function _fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Normalise path — prevent double /api prefix
  const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const path  = clean.startsWith('/api/') ? clean : `/api${clean}`
  const url   = `${STRAPI_URL}${path}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }
  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`
  }

  // 8-second timeout — prevents pages hanging when Strapi is unreachable
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8_000)

  try {
    const res = await fetch(url, { ...options, headers, signal: controller.signal })

    if (!res.ok) {
      let detail = `${res.status} ${res.statusText}`
      try {
        const body = await res.json()
        detail = body?.error?.message ?? body?.message ?? detail
      } catch { /* ignore body parse errors */ }

      // Actionable guidance for the most common errors
      if (res.status === 403 || res.status === 401) {
        console.warn(
          `[api-client] ${res.status} on [${path}].\n` +
          `  Fix 1: Strapi Admin → Settings → Roles → Public → enable "find" for this content type.\n` +
          `  Fix 2: Add STRAPI_API_TOKEN to .env.local and restart Next.js.\n` +
          `  Fix 3: Make sure the content entry is PUBLISHED (not Draft) in Strapi.`
        )
      }

      throw new Error(`[api-client] ${detail} [${path}]`)
    }

    return res.json() as Promise<T>
  } catch (err) {
    const e = err as Error & { code?: string }
    if (e.name === 'AbortError') {
      throw new Error(
        `[api-client] Request timed out after 8 s [${path}].\n` +
        `  Is Strapi running? cd your-strapi-folder && npm run develop`
      )
    }
    if (e.code === 'ECONNREFUSED' || e.message?.includes('ECONNREFUSED')) {
      throw new Error(
        `[api-client] Cannot reach Strapi at ${STRAPI_URL}.\n` +
        `  Start it: cd your-strapi-folder && npm run develop`
      )
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * apiFetch<T>
 * Throws on any error. Use inside service methods that wrap with try/catch.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  return _fetch<T>(endpoint, options)
}

/**
 * apiFetchSafe<T>
 * NEVER throws — returns null on any error and logs a warning.
 *
 * Use in RSC pages, layouts, and client components.
 * Ensures the page always renders, even if Strapi is down or env vars are missing.
 */
export async function apiFetchSafe<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | null> {
  try {
    return await _fetch<T>(endpoint, options)
  } catch (err) {
    console.warn(`[apiFetchSafe] ${(err as Error).message ?? String(err)}`)
    return null
  }
}