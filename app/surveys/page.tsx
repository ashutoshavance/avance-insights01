import { motion } from 'framer-motion'
import { ClipboardList } from 'lucide-react'
import { surveyService } from '@/services/survey.service'
import SurveyList from '@/components/surveys/SurveyList'

export const metadata = {
  title: 'Live Surveys | Participate in Research',
  description: 'Join our active research studies. Your participation helps shape products, services and policies.',
}

export default async function SurveysPage() {
  const surveys = await surveyService.getActive()

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ClipboardList className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="section-title">Participate in Live Surveys</h1>
            <p className="section-subtitle mt-4 mx-auto">
              Your voice matters. Join our research studies and help shape products,
              services, and policies that impact millions.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-10">
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
            </div>
          </div>
        </div>
      </section>

      {/* Survey List — CMS-driven */}
      <section className="py-16">
        <div className="container-custom">
          <SurveyList initialSurveys={surveys} />
        </div>
      </section>

      {/* Privacy note */}
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
