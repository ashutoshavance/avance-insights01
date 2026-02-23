

import React from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'

/**
 * Overview item structure
 * Adjust fields based on your actual Strapi schema
 */
interface OverviewItem {
  id?: string | number
  title?: string
  description?: string
  content?: string
  icon?: string
  [key: string]: any
}

interface OverviewSectionProps {
  overview?: OverviewItem[] | null
  title?: string
  className?: string
}

/**
 * Production-ready Overview Section Component
 * Handles array of objects and renders them cleanly
 */
export const OverviewSection: React.FC<OverviewSectionProps> = ({
  overview,
  title = 'Overview',
  className = '',
}) => {
  // Guard: No data
  if (!overview || !Array.isArray(overview) || overview.length === 0) {
    return null
  }

  // Guard: Verify all items are objects
  const validItems = overview.filter((item) => item && typeof item === 'object')
  if (validItems.length === 0) {
    return null
  }

  return (
    <section className={`py-16 md:py-24 bg-gradient-to-br from-slate-50 to-white ${className}`}>
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Section Title */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-2">
              {title}
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" />
          </div>

          {/* Overview Grid */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {validItems.map((item, index) => (
              <OverviewCard key={item.id || index} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Individual Overview Card Component
 * Handles rendering of each overview item
 */
interface OverviewCardProps {
  item: OverviewItem
  index: number
}

const OverviewCard: React.FC<OverviewCardProps> = ({ item, index }) => {
  const { title, description, content } = item

  // Get the text content (try multiple field names)
  const displayText = description || content || item.text || ''

  // Guard: Skip if no displayable content
  if (!title && !displayText) {
    return null
  }

  return (
    <div className="group flex gap-4 p-6 rounded-xl bg-white border border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Icon */}
      <div className="flex-shrink-0 mt-1">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center group-hover:from-primary-200 group-hover:to-primary-100 transition-colors duration-300">
          <CheckCircle2 className="w-6 h-6 text-primary-600" aria-hidden="true" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
            {String(title).trim()}
          </h3>
        )}

        {displayText && (
          <p className="text-slate-600 leading-relaxed text-sm md:text-base">
            {String(displayText).trim()}
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * Alternative: Simple List Version (if you prefer a simpler layout)
 */
export const OverviewSectionSimple: React.FC<OverviewSectionProps> = ({
  overview,
  title = 'Overview',
  className = '',
}) => {
  if (!overview || !Array.isArray(overview) || overview.length === 0) {
    return null
  }

  const validItems = overview.filter((item) => item && typeof item === 'object')
  if (validItems.length === 0) {
    return null
  }

  return (
    <section className={`py-16 md:py-24 bg-white ${className}`}>
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-12">
            {title}
          </h2>

          <div className="space-y-6">
            {validItems.map((item, index) => {
              const displayText = item.description || item.content || item.text || ''
              if (!item.title && !displayText) return null

              return (
                <div key={item.id || index} className="flex gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-6 h-6 text-green-500" aria-hidden="true" />
                  </div>
                  <div>
                    {item.title && (
                      <h3 className="font-semibold text-slate-900 mb-1">
                        {String(item.title).trim()}
                      </h3>
                    )}
                    {displayText && (
                      <p className="text-slate-600 leading-relaxed">
                        {String(displayText).trim()}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default OverviewSection
