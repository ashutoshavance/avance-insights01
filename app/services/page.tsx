'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  BarChart3, 
  Users, 
  Database, 
  Lightbulb, 
  Target,
  PieChart,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const services = [
  {
    id: 1,
    title: 'Market Research',
    slug: 'market-research',
    description: 'Comprehensive market analysis, consumer behavior studies, and competitive intelligence to drive strategic decisions.',
    icon: BarChart3,
    color: 'from-blue-500 to-blue-600',
    features: [
      'Consumer Insights & Behavior Analysis',
      'Market Sizing & Opportunity Assessment',
      'Competitive Intelligence',
      'Trend Analysis & Forecasting',
      'Product Testing & Concept Validation',
      'Pricing Research',
    ],
  },
  {
    id: 2,
    title: 'Social Research',
    slug: 'social-research',
    description: 'In-depth social studies, impact assessments, and community research for NGOs, governments, and social enterprises.',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
    features: [
      'Impact Assessment Studies',
      'Baseline & Endline Surveys',
      'Program Evaluation',
      'Community Needs Assessment',
      'Policy Research',
      'Stakeholder Mapping',
    ],
  },
  {
    id: 3,
    title: 'Data Collection',
    slug: 'data-collection',
    description: 'Multi-modal data collection including CAPI, CATI, online surveys, and field research across India.',
    icon: Database,
    color: 'from-green-500 to-green-600',
    features: [
      'CAPI (Computer-Assisted Personal Interviewing)',
      'CATI (Computer-Assisted Telephone Interviewing)',
      'Online & Web Surveys',
      'Focus Group Discussions',
      'In-depth Interviews',
      'Mystery Shopping',
    ],
  },
 
  {
    id: 5,
    title: 'Custom Analytics',
    slug: 'custom-analytics',
    description: 'Advanced data analytics, visualization, and reporting tailored to your business needs.',
    icon: PieChart,
    color: 'from-pink-500 to-pink-600',
    features: [
      'Data Visualization & Dashboards',
      'Predictive Analytics',
      'Statistical Modeling',
      'Segmentation Analysis',
      'Conjoint Analysis',
      'Custom Reporting',
    ],
  },
  {
    id: 6,
    title: 'Strategic Consulting',
    slug: 'strategic-consulting',
    description: 'Expert guidance on research design, methodology, and actionable recommendations.',
    icon: Target,
    color: 'from-teal-500 to-teal-600',
    features: [
      'Research Design & Methodology',
      'Questionnaire Development',
      'Sampling Strategy',
      'Strategic Recommendations',
      'Workshop Facilitation',
      'Knowledge Transfer',
    ],
  },
]

export default function ServicesPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-title"
            >
              Our <span className="gradient-text">Services</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="section-subtitle mt-6 mx-auto"
            >
              Comprehensive research and brand solutions tailored to your business needs. 
              From market intelligence to social impact studies, we deliver insights that matter.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20">
        <div className="container-custom">
          <div className="space-y-16">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-secondary-900">
                    {service.title}
                  </h2>
                  <p className="text-secondary-600 mt-4 text-lg leading-relaxed">
                    {service.description}
                  </p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="btn-primary mt-6 inline-flex group"
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className={`bg-secondary-50 rounded-2xl p-8 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <h3 className="font-semibold text-secondary-900 mb-6">What's Included</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-secondary-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-900 to-secondary-900 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Ready to Get Started?
          </h2>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto">
            Let's discuss how our research expertise can help you make data-driven decisions.
          </p>
          <Link href="/contact" className="btn-primary mt-8 inline-flex">
            Schedule a Consultation
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
