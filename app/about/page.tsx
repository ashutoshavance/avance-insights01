'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Target, 
  Eye, 
  Award, 
  Users, 
  MapPin,
  CheckCircle,
  Building,
  Briefcase
} from 'lucide-react'

// Sample data - in production, fetch from Strapi
const teamMembers = [
  { id: 1, name: 'Manoj Kumar', role: 'Founder & CEO', bio: 'Over 15 years of experience in market research and business strategy.' },
  { id: 2, name: 'Priya Sharma', role: 'Research Director', bio: 'Expert in quantitative research methodologies and data analytics.' },
  { id: 3, name: 'Amit Verma', role: 'Operations Head', bio: 'Manages pan-India field operations and quality control.' },
  { id: 4, name: 'Neha Gupta', role: 'Client Services Lead', bio: 'Ensures seamless client communication and project delivery.' },
]

const certifications = [
  { id: 1, name: 'MRSI Member', description: 'Market Research Society of India' },
  { id: 2, name: 'MSME Registered', description: 'Ministry of Micro, Small and Medium Enterprises' },
  { id: 3, name: 'ISO 9001:2015', description: 'Quality Management System Certified' },
]

const milestones = [
  { year: '2015', title: 'Founded', description: 'Avance Insights established in New Delhi' },
  { year: '2017', title: 'MRSI Membership', description: 'Became a member of Market Research Society of India' },
  { year: '2019', title: 'Pan-India Expansion', description: 'Extended operations to 15+ states' },
  { year: '2021', title: 'ISO Certification', description: 'Achieved ISO 9001:2015 certification' },
  { year: '2023', title: '100+ Projects', description: 'Completed milestone of 100+ successful projects' },
]

export default function AboutPage() {
  const { ref: missionRef, inView: missionInView } = useInView({ threshold: 0.2, triggerOnce: true })
  const { ref: teamRef, inView: teamInView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-title"
            >
              About <span className="gradient-text">Avance Insights</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="section-subtitle mt-6 mx-auto"
            >
              We are a Delhi-based market research and brand solutions agency dedicated to 
              transforming data into actionable insights that drive business growth.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mt-4">
                Empowering Decisions Through Research Excellence
              </h2>
              <p className="text-secondary-600 mt-6 leading-relaxed">
                Founded with a vision to democratize access to quality market research, 
                Avance Insights has grown to become a trusted partner for organizations 
                across India. We combine rigorous research methodologies with cutting-edge 
                technology to deliver insights that matter.
              </p>
              <p className="text-secondary-600 mt-4 leading-relaxed">
                Our team of experienced researchers, analysts, and strategists work 
                collaboratively to understand your unique challenges and deliver 
                customized solutions that drive measurable results.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary-900">100+</div>
                    <div className="text-sm text-secondary-500">Projects Delivered</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-accent-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary-900">15+</div>
                    <div className="text-sm text-secondary-500">States Covered</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary-200" />
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={milestone.year} className="relative pl-12">
                    <div className="absolute left-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-secondary-100">
                      <div className="text-primary-600 font-semibold">{milestone.year}</div>
                      <div className="font-bold text-secondary-900">{milestone.title}</div>
                      <div className="text-sm text-secondary-600 mt-1">{milestone.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section ref={missionRef} className="py-20 bg-secondary-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={missionInView ? { opacity: 1, y: 0 } : {}}
              className="bg-white p-8 rounded-2xl shadow-sm"
            >
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-secondary-900">Our Mission</h3>
              <p className="text-secondary-600 mt-4 leading-relaxed">
                To empower organizations with data-driven insights that enable informed 
                decision-making, foster innovation, and create sustainable competitive 
                advantages in an ever-evolving marketplace.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={missionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm"
            >
              <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-accent-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-secondary-900">Our Vision</h3>
              <p className="text-secondary-600 mt-4 leading-relaxed">
                To be the most trusted research partner for businesses across India, 
                recognized for our commitment to quality, innovation, and delivering 
                actionable insights that transform businesses.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} id="team" className="py-20">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              animate={teamInView ? { opacity: 1 } : {}}
              className="text-primary-600 font-semibold text-sm uppercase tracking-wider"
            >
              Our Team
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={teamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="section-title mt-4"
            >
              Meet the Experts Behind Your Insights
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * index }}
                className="text-center"
              >
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold text-white">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-display font-bold text-secondary-900">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium">{member.role}</p>
                <p className="text-secondary-600 text-sm mt-2">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-gradient-to-br from-primary-900 to-secondary-900 text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-primary-300 font-semibold text-sm uppercase tracking-wider">
              Credentials
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-4">
              Certifications & Memberships
            </h2>
            <p className="text-white/70 mt-4">
              Our commitment to quality and excellence is recognized by leading industry bodies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {certifications.map((cert) => (
              <div key={cert.id} className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center">
                <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <Award className="w-8 h-8 text-primary-300" />
                </div>
                <h3 className="text-xl font-bold">{cert.name}</h3>
                <p className="text-white/70 mt-2">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              Our Values
            </span>
            <h2 className="section-title mt-4">What Drives Us</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Integrity', description: 'We uphold the highest ethical standards in all our research.' },
              { title: 'Excellence', description: 'We strive for excellence in methodology and delivery.' },
              { title: 'Innovation', description: 'We embrace new technologies and approaches.' },
              { title: 'Partnership', description: 'We build lasting relationships with our clients.' },
            ].map((value, index) => (
              <div key={value.title} className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-secondary-900">{value.title}</h3>
                <p className="text-secondary-600 text-sm mt-2">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
