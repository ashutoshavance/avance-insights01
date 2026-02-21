'use client'

/**
 * app/surveys/SurveysClient.tsx
 *
 * ─── CRITICAL BUG FIX ────────────────────────────────────────────────────────
 *
 * BEFORE: import type { Survey } from '@/lib/strapi'
 *   → This imports the RAW type (SurveyRaw alias) which has: surveyStatus, embedUrl
 *   → But page.tsx passes NORMALISED surveys from surveyService (from @/types/survey)
 *   → Normalised Survey has: status (not surveyStatus)
 *   → survey.surveyStatus was always UNDEFINED on normalised data
 *   → isActive = undefined?.toLowerCase() === 'active' = FALSE always
 *   → Every survey rendered with inactive styling, "Take Survey" button dimmed
 *
 * AFTER: import { Survey, isSurveyActive } from '@/types/survey'
 *   → Normalised Survey type — survey.status is guaranteed 'Active' | 'Inactive'
 *   → isSurveyActive(survey) correctly returns true for active surveys
 *
 * FILE PATH: src/app/surveys/SurveysClient.tsx
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardList,
  ExternalLink,
  ChevronDown,
  Users,
  Tag,
} from 'lucide-react'
import { cn } from '@/lib/utils'
// FIX: was `from '@/lib/strapi'` (raw type). Now uses normalised type.
import { Survey, isSurveyActive } from '@/types/survey'

interface SurveysClientProps {
  surveys: Survey[]
}

// ─── Single survey card ───────────────────────────────────────────────────────

function SurveyCard({ survey }: { survey: Survey }) {
  const [expanded, setExpanded] = useState(false)

  const embedUrl = survey.embedUrl ?? ''
  // FIX: was survey.surveyStatus (undefined on normalised type) → isSurveyActive(survey)
  const isActive = isSurveyActive(survey)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-secondary-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">

            {/* Status + Category badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold',
                isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-secondary-100 text-secondary-500'
              )}>
                <span className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  isActive ? 'bg-green-500 animate-pulse' : 'bg-secondary-400'
                )} />
                {/* FIX: was survey.surveyStatus — use survey.status (normalised field) */}
                {survey.status ?? 'Unknown'}
              </span>

              {survey.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-medium">
                  <Tag className="w-3 h-3" />
                  {survey.category}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl font-display font-bold text-secondary-900 mb-2 truncate">
              {survey.title}
            </h2>

            {/* Description */}
            {survey.description && (
              <p className="text-secondary-600 text-sm leading-relaxed line-clamp-2">
                {survey.description}
              </p>
            )}

            {/* Audience */}
            {survey.audience && (
              <div className="flex items-center gap-1.5 mt-3 text-sm text-secondary-500">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>Target audience: {survey.audience}</span>
              </div>
            )}
          </div>

          {/* Expand / collapse toggle */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-50 hover:bg-primary-100 flex items-center justify-center transition-colors"
            aria-label={expanded ? 'Hide survey' : 'Show survey'}
          >
            <ChevronDown className={cn(
              'w-5 h-5 text-primary-600 transition-transform duration-200',
              expanded && 'rotate-180'
            )} />
          </button>
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="btn-primary text-sm"
          >
            {expanded ? 'Hide Survey' : 'Take Survey'}
          </button>

          {embedUrl && (
            <a
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm inline-flex items-center gap-1.5"
            >
              Open in New Tab
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Embedded iframe — expands on button click */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="embed"
            initial={{ height: 0 }}
            animate={{ height: 620 }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-secondary-100"
          >
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full"
                style={{ height: 620, display: 'block' }}
                title={survey.title}
                allow="camera; microphone"
                loading="lazy"
              />
            ) : (
              <p className="p-8 text-center text-secondary-400 text-sm">
                No embed URL configured for this survey in the CMS.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function SurveysClient({ surveys }: SurveysClientProps) {
  if (surveys.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-20 h-20 mx-auto bg-secondary-100 rounded-full flex items-center justify-center mb-6">
          <ClipboardList className="w-10 h-10 text-secondary-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-secondary-700 mb-3">
          No Active Surveys Right Now
        </h2>
        <p className="text-secondary-500 max-w-md mx-auto text-sm leading-relaxed">
          There are no active surveys at the moment. Check back soon — we add
          new surveys regularly.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 max-w-4xl mx-auto">
      {surveys.map((survey) => (
        <SurveyCard
          key={survey.documentId || String(survey.id)}
          survey={survey}
        />
      ))}
    </div>
  )
}