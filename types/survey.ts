/**
 * types/survey.ts
 *
 * FIXES BUG 9: SurveyList.tsx imports Survey from '@/types/survey' — MISSING.
 *
 * ALSO FIXES field mismatches between old frontend code and real Strapi v5 schema:
 *   OLD (wrong)           →  CORRECT (Strapi v5)
 *   survey.koboEmbedUrl   →  survey.embedUrl
 *   survey.status         →  survey.surveyStatus ('Active' / 'Inactive')
 *   survey.estimatedTime  →  (REMOVED — field does not exist in Strapi)
 *   survey.responses      →  (REMOVED — field does not exist in Strapi)
 *
 * FILE PATH: types/survey.ts
 */

/** Raw shape from Strapi v5 live-survey collection (flat — no .attributes) */
export interface SurveyRaw {
  id: number
  documentId: string
  title: string
  description?: string | null
  category?: string | null
  audience?: string | null
  /** Strapi field: 'Active' | 'Inactive' (capital first letter) */
  surveyStatus: 'Active' | 'Inactive' | string
  /** KoboToolbox Enketo embed URL */
  embedUrl: string
  createdAt: string
  updatedAt: string
  publishedAt?: string | null
}

/**
 * Survey — normalised shape consumed by SurveyList and SurveysClient.
 * All fields safe — no nulls.
 *
 * NOTE: We expose `status` (not `surveyStatus`) in the normalised shape
 * so existing SurveyList comparisons using `survey.status` continue to
 * work after normalisation — just ensure you compare against 'Active'
 * (capital A) which is what Strapi stores.
 */
export interface Survey {
  id: number
  documentId: string
  title: string
  description: string
  category: string
  audience: string
  /** Normalised from surveyStatus — values: 'Active' | 'Inactive' */
  status: string
  /** KoboToolbox Enketo embed URL — use this in <iframe src={...} /> */
  embedUrl: string
  createdAt: string
}

/** Transforms raw Strapi v5 survey into the normalised Survey shape */
export function normaliseSurvey(raw: SurveyRaw): Survey {
  return {
    id:          raw.id,
    documentId:  raw.documentId,
    title:       raw.title        ?? '',
    description: raw.description  ?? '',
    category:    raw.category     ?? 'General',
    audience:    raw.audience     ?? 'All',
    status:      raw.surveyStatus ?? 'Inactive',
    embedUrl:    raw.embedUrl     ?? '',
    createdAt:   raw.createdAt    ?? '',
  }
}

/**
 * Returns true when the survey is active.
 * Case-insensitive so 'active' and 'Active' both return true.
 */
export function isSurveyActive(survey: Survey | SurveyRaw): boolean {
  const status =
    'status' in survey
      ? (survey as Survey).status
      : (survey as SurveyRaw).surveyStatus
  return typeof status === 'string' && status.toLowerCase() === 'active'
}