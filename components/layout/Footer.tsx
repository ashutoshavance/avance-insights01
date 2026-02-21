import Link from 'next/link'
import {
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Twitter,
  Facebook,
  ArrowRight,
} from 'lucide-react'

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Team', href: '/about#team' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  services: [
    { name: 'Market Research', href: '/services/market-research' },
    { name: 'Social Research', href: '/services/social-research' },
    { name: 'Data Collection', href: '/services/data-collection' },
    { name: 'Brand Solutions', href: '/services/brand-solutions' },
  ],
  resources: [
    { name: 'Insights & Blog', href: '/insights' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Live Surveys', href: '/surveys' },
    { name: 'AI Assistant', href: '/ai-insights' },
  ],
}

const certifications = ['MRSI Member', 'MSME Registered', 'ISO 9001:2015']

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/avance-insights',
    icon: Linkedin,
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/avanceinsights',
    icon: Twitter,
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/avanceinsights',
    icon: Facebook,
  },
]

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      {/* Top CTA Banner */}
      <div className="border-b border-white/[0.06] bg-gradient-to-r from-primary-950 to-slate-950">
        <div className="container-custom py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white">
                Ready to transform with data-driven insights?
              </h3>
              <p className="text-slate-400 mt-2 text-base">
                Let&apos;s discuss how we can help your business grow.
              </p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all duration-200 whitespace-nowrap shadow-lg shadow-primary-900/30 flex-shrink-0"
            >
              Start a Conversation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg font-display">A</span>
              </div>
              <span className="text-xl font-display font-bold text-white">
                Avance<span className="text-primary-400">Insights</span>
              </span>
            </Link>

            <p className="mt-5 text-slate-400 max-w-sm leading-relaxed text-sm">
              Your trusted partner for market research, social research, and brand solutions.
              Delivering actionable insights that drive business growth.
            </p>

            {/* Contact Info */}
            <div className="mt-7 space-y-3.5">
              <div className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-primary-400 flex-shrink-0" />
                <span>New Delhi, India</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a
                  href="tel:+919999999999"
                  className="hover:text-white transition-colors"
                >
                  +91 99999 99999
                </a>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a
                  href="mailto:info@avanceinsights.in"
                  className="hover:text-white transition-colors"
                >
                  info@avanceinsights.in
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-7 flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-primary-600 border border-white/[0.08] hover:border-primary-500 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors hover:translate-x-0.5 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-5">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors hover:translate-x-0.5 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources + Certifications */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-5">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors hover:translate-x-0.5 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Certifications */}
            <div className="mt-9">
              <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4">
                Certifications
              </h4>
              <div className="flex flex-col gap-2">
                {certifications.map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-2 text-xs font-medium text-slate-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.06]">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
            {/* BUG FIX: Hardcoded year avoids hydration mismatch from new Date() */}
            <p>&copy; 2025 Avance Insights. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}