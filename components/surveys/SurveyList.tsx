'use client'

/**
 * components/SurveyList.tsx
 *
 * BUGS FIXED:
 *  BUG 1: survey.status === 'Active' ← was 'active' (wrong case). Strapi stores 'Active'.
 *  BUG 2: survey.estimatedTime — FIELD DOES NOT EXIST in Strapi. Removed.
 *  BUG 3: survey.koboEmbedUrl  — WRONG FIELD NAME. Correct: survey.embedUrl.
 *  BUG 4: survey.responses     — FIELD DOES NOT EXIST in Strapi. Removed.
 *
 * UI design is UNCHANGED — only the data field references are corrected.
 *
 * FILE PATH: components/SurveyList.tsx
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ClipboardList,
  Users,
  CheckCircle,
  ChevronRight,
  Filter,
  Search,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Survey, isSurveyActive } from '@/types/survey'

interface SurveyListProps {
  initialSurveys: Survey[]
}

const categories = [
  'All',
  'Market Research',
  'Social Research',
  'Brand Research',
  'Consumer Research',
  'Financial Services',
]

export default function SurveyList({ initialSurveys }: SurveyListProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery]           = useState('')
  const [selectedSurvey, setSelectedSurvey]     = useState<Survey | null>(null)

  const filteredSurveys = initialSurveys.filter((survey) => {
    const matchesCategory =
      selectedCategory === 'All' || survey.category === selectedCategory
    const matchesSearch =
      survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (survey.description ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    // FIX BUG 1: use isSurveyActive() — handles 'Active' with capital A
    return matchesCategory && matchesSearch && isSurveyActive(survey)
  })

  // ── Embedded survey view ────────────────────────────────────────────────────
  if (selectedSurvey) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-secondary-200">
          <button
            onClick={() => setSelectedSurvey(null)}
            className="text-primary-600 hover:text-primary-700 font-medium mb-4 flex items-center gap-1"
          >
            ← Back to Surveys
          </button>
          <h2 className="text-2xl font-display font-bold text-secondary-900">
            {selectedSurvey.title}
          </h2>
          {selectedSurvey.description && (
            <p className="text-secondary-600 mt-2">{selectedSurvey.description}</p>
          )}

          {/* FIX BUG 2 + BUG 4: removed estimatedTime and responses — use audience instead */}
          <div className="flex items-center gap-4 mt-4 text-sm text-secondary-500">
            {selectedSurvey.audience && (
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {selectedSurvey.audience}
              </span>
            )}
            {selectedSurvey.category && (
              <span className="flex items-center gap-1">
                <ClipboardList className="w-4 h-4" />
                {selectedSurvey.category}
              </span>
            )}
            {/* Link to open in new tab */}
            {selectedSurvey.embedUrl && (
              <a
                href={selectedSurvey.embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary-600 hover:text-primary-700 ml-auto"
              >
                <ExternalLink className="w-4 h-4" />
                Open in new tab
              </a>
            )}
          </div>
        </div>

        {/* FIX BUG 3: use embedUrl instead of koboEmbedUrl */}
        <div className="h-[600px]">
          {selectedSurvey.embedUrl ? (
            <iframe
              src={selectedSurvey.embedUrl}
              className="w-full h-full border-0"
              title={selectedSurvey.title}
              allow="geolocation"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-secondary-400">
              <div className="text-center">
                <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>Survey embed URL not configured in CMS.</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  // ── Survey listing view ─────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="text"
            placeholder="Search surveys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-5 h-5 text-secondary-400 flex-shrink-0" />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Survey Grid */}
      {filteredSurveys.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredSurveys.map((survey, index) => (
            <motion.div
              key={survey.documentId || String(survey.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                  {survey.category || 'General'}
                </span>
                {/* FIX BUG 1: status is already normalised to 'Active'/'Inactive' */}
                <span className="flex items-center gap-1 text-green-600 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {survey.status}
                </span>
              </div>

              <h3 className="text-xl font-display font-bold text-secondary-900 mb-2">
                {survey.title}
              </h3>
              {survey.description && (
                <p className="text-secondary-600 mb-4 line-clamp-2">
                  {survey.description}
                </p>
              )}

              {/* FIX BUG 2 + 4: removed estimatedTime and responses — only audience shown */}
              <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6">
                {survey.audience && (
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {survey.audience}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Live Survey
                </span>
              </div>

              <button
                onClick={() => setSelectedSurvey(survey)}
                className="btn-primary w-full group flex items-center justify-center"
              >
                Take Survey
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ClipboardList className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-600">No surveys found</h3>
          <p className="text-secondary-500 mt-1">
            {searchQuery || selectedCategory !== 'All'
              ? 'Try adjusting your filters or search query.'
              : 'No active surveys available at the moment. Check back soon!'}
          </p>
        </div>
      )}
    </div>
  )
}