'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ClipboardList, 
  Users, 
  Clock, 
  CheckCircle,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Sample surveys - in production, fetch from Strapi CMS
const surveys = [
  {
    id: '1',
    title: 'Consumer Shopping Behavior Survey 2024',
    description: 'Help us understand how Indian consumers make purchasing decisions in the digital age.',
    category: 'Market Research',
    audience: 'General Public',
    status: 'active' as const,
    estimatedTime: '10 mins',
    responses: 1234,
    koboEmbedUrl: 'https://ee.kobotoolbox.org/x/K2oAc6Sd',
  },
  {
    id: '2',
    title: 'Digital Payment Adoption Study',
    description: 'Share your experiences with digital payment platforms and help shape the future of fintech.',
    category: 'Financial Services',
    audience: 'Adults 18+',
    status: 'active' as const,
    estimatedTime: '8 mins',
    responses: 856,
    koboEmbedUrl: 'https://ee.kobotoolbox.org/x/example2',
  },
  {
    id: '3',
    title: 'Healthcare Access Survey',
    description: 'Participate in our study on healthcare accessibility and quality in urban areas.',
    category: 'Social Research',
    audience: 'Urban Residents',
    status: 'active' as const,
    estimatedTime: '12 mins',
    responses: 2341,
    koboEmbedUrl: 'https://ee.kobotoolbox.org/x/example3',
  },
  {
    id: '4',
    title: 'Brand Perception Study - Tech Products',
    description: 'Share your thoughts on leading technology brands and their products.',
    category: 'Brand Research',
    audience: 'Tech Users',
    status: 'active' as const,
    estimatedTime: '7 mins',
    responses: 567,
    koboEmbedUrl: 'https://ee.kobotoolbox.org/x/example4',
  },
]

const categories = ['All', 'Market Research', 'Social Research', 'Brand Research', 'Financial Services']

export default function SurveysPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSurvey, setSelectedSurvey] = useState<typeof surveys[0] | null>(null)

  const filteredSurveys = surveys.filter((survey) => {
    const matchesCategory = selectedCategory === 'All' || survey.category === selectedCategory
    const matchesSearch = survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      survey.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch && survey.status === 'active'
  })

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <ClipboardList className="w-8 h-8 text-primary-600" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-title"
            >
              Participate in Live Surveys
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="section-subtitle mt-4 mx-auto"
            >
              Your voice matters. Join our research studies and help shape products, 
              services, and policies that impact millions.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-8 mt-10"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">50K+</div>
                <div className="text-sm text-secondary-500">Survey Responses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">100+</div>
                <div className="text-sm text-secondary-500">Studies Conducted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">15+</div>
                <div className="text-sm text-secondary-500">States Covered</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Surveys List */}
      <section className="py-16">
        <div className="container-custom">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
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

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-secondary-400" />
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
          {selectedSurvey ? (
            // Survey Embed View
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
                <p className="text-secondary-600 mt-2">{selectedSurvey.description}</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-secondary-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedSurvey.estimatedTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {selectedSurvey.audience}
                  </span>
                </div>
              </div>
              <div className="h-[600px]">
                <iframe
                  src={selectedSurvey.koboEmbedUrl}
                  className="w-full h-full border-0"
                  title={selectedSurvey.title}
                  allow="geolocation"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            </motion.div>
          ) : (
            // Survey List View
            <div className="grid md:grid-cols-2 gap-6">
              {filteredSurveys.map((survey, index) => (
                <motion.div
                  key={survey.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card card-hover p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                      {survey.category}
                    </span>
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      Active
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-secondary-900 mb-2">
                    {survey.title}
                  </h3>
                  <p className="text-secondary-600 mb-4 line-clamp-2">
                    {survey.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {survey.estimatedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {survey.audience}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      {survey.responses.toLocaleString()} responses
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedSurvey(survey)}
                    className="btn-primary w-full group"
                  >
                    Take Survey
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {filteredSurveys.length === 0 && !selectedSurvey && (
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary-600">No surveys found</h3>
              <p className="text-secondary-500 mt-1">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-secondary-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-display font-bold text-secondary-900 mb-4">
              Your Privacy Matters
            </h2>
            <p className="text-secondary-600">
              All survey responses are anonymous and used solely for research purposes. 
              Your personal information is protected according to our privacy policy and 
              industry best practices. By participating, you help improve products and 
              services for millions of people.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
