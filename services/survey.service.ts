/**
 * services/survey.service.ts
 *
 * ─── KEY FIXES ───────────────────────────────────────────────────────────────
 *
 * FIX 1: Endpoint /surveys → /live-surveys (collection name from Strapi logs)
 *   Strapi log confirms: api::live-survey.live-survey → REST endpoint /api/live-surveys
 *   Manual test /api/live-survey (singular) → 404 (confirmed in terminal logs)
 *
 * FIX 2: filters[status][$eq]=active → filters[surveyStatus][$eq]=Active
 *   Field name is surveyStatus (not status). Value is 'Active' (capital A).
 *   Strapi enumerations are case-sensitive — 'active' never matches.
 *
 * FIX 3: Uses apiFetchSafe — returns [] if Strapi is unreachable, never throws.
 *
 * FIX 4: Normalises SurveyRaw → Survey via normaliseSurvey()
 *   SurveyList.tsx and SurveysClient.tsx consume the normalised Survey shape.
 *
 * ─── WHY SURVEYS SHOW 0 (FROM STRAPI LOGS) ───────────────────────────────────
 * The survey document xurcqi5u1wz53s5acsfx3vpk EXISTS in Strapi but:
 *   a) It may be in DRAFT status — API only serves PUBLISHED documents
 *   b) Public permissions for live-surveys may not be enabled
 *   c) surveyStatus field may not be set to exactly 'Active'
 * See SETUP_GUIDE.md → Part 3 (Permissions) and Part 5 (Publishing content).
 *
 * FILE PATH: src/services/survey.service.ts
 */

import { apiFetchSafe, StrapiListResponse } from '@/lib/api-client'
import { Survey, SurveyRaw, normaliseSurvey } from '@/types/survey'

export type { Survey }

export const surveyService = {
  /**
   * Returns only Active surveys from the live-surveys collection.
   * Returns [] if Strapi is unreachable or permissions not set — never throws.
   *
   * TROUBLESHOOTING: If this returns [] even when Strapi is running:
   *   1. Check survey is PUBLISHED (not Draft) in Strapi Content Manager
   *   2. Check surveyStatus field is 'Active' (capital A)
   *   3. Check Strapi Public role has 'find' enabled for live-surveys
   *   4. Check STRAPI_API_TOKEN is set in .env.local
   */
  async getActive(): Promise<Survey[]> {
    const res = await apiFetchSafe<StrapiListResponse<SurveyRaw>>(
      '/live-surveys?filters[surveyStatus][$eq]=Active&populate=*&sort=createdAt:desc',
      { next: { revalidate: 60 } } as RequestInit
    )
    if (!res?.data || res.data.length === 0) {
      if (!res) {
        console.warn(
          '[surveyService.getActive] Strapi unreachable or permissions not set.\n' +
          '  → Check STRAPI_API_TOKEN in .env.local\n' +
          '  → Check Public permissions for live-surveys in Strapi Admin'
        )
      }
      return []
    }
    return res.data.map(normaliseSurvey)
  },

  /**
   * Returns ALL surveys regardless of status — useful for admin preview.
   */
  async getAll(): Promise<Survey[]> {
    const res = await apiFetchSafe<StrapiListResponse<SurveyRaw>>(
      '/live-surveys?populate=*&sort=createdAt:desc',
      { next: { revalidate: 60 } } as RequestInit
    )
    return (res?.data ?? []).map(normaliseSurvey)
  },

  /**
   * Returns a single survey by Strapi v5 documentId.
   * Example: surveyService.getByDocumentId('xurcqi5u1wz53s5acsfx3vpk')
   */
  async getByDocumentId(documentId: string): Promise<Survey | null> {
    const res = await apiFetchSafe<StrapiListResponse<SurveyRaw>>(
      `/live-surveys?filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate=*`
    )
    const raw = res?.data?.[0]
    return raw ? normaliseSurvey(raw) : null
  },
}