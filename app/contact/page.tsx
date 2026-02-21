'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle,
  Loader2,
  Building,
  User,
  MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  organization: z.string().optional(),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().max(0), // Spam protection
})

type ContactFormData = z.infer<typeof contactSchema>

const services = [
  'Market Research',
  'Social Research',
  'Data Collection',
  'Brand Solutions',
  'Custom Analytics',
  'Other',
]

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      honeypot: '',
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      setIsSubmitted(true)
      reset()
    } catch (error) {
      setSubmitError('Something went wrong. Please try again or email us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-title"
            >
              Let's Start a Conversation
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="section-subtitle mt-4 mx-auto"
            >
              Have a research project in mind? Need strategic insights? 
              We're here to help transform your data into actionable intelligence.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6">
                Get in Touch
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900">Office Address</h3>
                    <p className="text-secondary-600 mt-1">
                      New Delhi, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900">Phone</h3>
                    <a 
                      href="tel:+919999999999" 
                      className="text-secondary-600 mt-1 hover:text-primary-600 transition-colors"
                    >
                      +91 99999 99999
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900">Email</h3>
                    <a 
                      href="mailto:info@avanceinsights.in" 
                      className="text-secondary-600 mt-1 hover:text-primary-600 transition-colors"
                    >
                      info@avanceinsights.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900">Business Hours</h3>
                    <p className="text-secondary-600 mt-1">
                      Mon - Fri: 9:00 AM - 6:00 PM IST
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-10 p-6 bg-secondary-50 rounded-2xl">
                <h3 className="font-semibold text-secondary-900 mb-4">Why Choose Us</h3>
                <ul className="space-y-3 text-sm text-secondary-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    100+ successful projects delivered
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Pan-India research capabilities
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    MRSI & ISO certified
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Quick turnaround time
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="card p-8">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-secondary-900">
                      Thank You!
                    </h3>
                    <p className="text-secondary-600 mt-2 max-w-md mx-auto">
                      We've received your message and will get back to you within 24 hours. 
                      Check your email for a confirmation.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="btn-primary mt-6"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6">
                      Send Us a Message
                    </h2>

                    {/* Honeypot field - hidden from users */}
                    <input
                      type="text"
                      {...register('honeypot')}
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="label-text">
                          <User className="inline w-4 h-4 mr-1" />
                          Full Name *
                        </label>
                        <input
                          id="name"
                          type="text"
                          {...register('name')}
                          className={cn('input-field', errors.name && 'border-red-500')}
                          placeholder="John Doe"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="label-text">
                          <Mail className="inline w-4 h-4 mr-1" />
                          Email Address *
                        </label>
                        <input
                          id="email"
                          type="email"
                          {...register('email')}
                          className={cn('input-field', errors.email && 'border-red-500')}
                          placeholder="john@company.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label htmlFor="phone" className="label-text">
                          <Phone className="inline w-4 h-4 mr-1" />
                          Phone Number *
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          {...register('phone')}
                          className={cn('input-field', errors.phone && 'border-red-500')}
                          placeholder="+91 99999 99999"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                        )}
                      </div>

                      {/* Organization */}
                      <div>
                        <label htmlFor="organization" className="label-text">
                          <Building className="inline w-4 h-4 mr-1" />
                          Organization
                        </label>
                        <input
                          id="organization"
                          type="text"
                          {...register('organization')}
                          className="input-field"
                          placeholder="Company Name"
                        />
                      </div>
                    </div>

                    {/* Service Interest */}
                    <div>
                      <label htmlFor="service" className="label-text">
                        Service Interest *
                      </label>
                      <select
                        id="service"
                        {...register('service')}
                        className={cn('input-field', errors.service && 'border-red-500')}
                      >
                        <option value="">Select a service</option>
                        {services.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                      {errors.service && (
                        <p className="text-red-500 text-sm mt-1">{errors.service.message}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="label-text">
                        <MessageSquare className="inline w-4 h-4 mr-1" />
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        {...register('message')}
                        rows={5}
                        className={cn('input-field resize-none', errors.message && 'border-red-500')}
                        placeholder="Tell us about your project or research needs..."
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                      )}
                    </div>

                    {submitError && (
                      <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                        {submitError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
