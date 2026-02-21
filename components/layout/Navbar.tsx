'use client'

/**
 * components/Navbar.tsx
 *
 * FIXES:
 * 1. href='/live-surveys' → '/surveys' (page exists at app/surveys/, not app/live-surveys/)
 * 2. initialNavigation now includes ALL 7 services from Avance PPT as hardcoded fallback
 *    so the dropdown always shows all services even when Strapi is unreachable
 * 3. Strapi sync still runs — if CMS has services, they REPLACE the fallback list
 */

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, ChevronDown, BarChart3, Users,
  FileText, MessageSquare, ClipboardList, Phone, Bot,
  TrendingUp, Globe2, Languages,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { serviceService } from '@/services/service.service'

const iconMap: Record<string, any> = {
  BarChart3, Users, FileText, MessageSquare, ClipboardList,
  Bot, Phone, TrendingUp, Globe2, Languages,
}

interface NavigationItem {
  name: string
  href: string
  icon?: any
  description?: string
  children?: { name: string; href: string; icon?: any; description?: string }[]
}

// FIX 2: ALL 7 services from Avance Insights PPT as hardcoded fallback
// These match EXACTLY the slugs you must create in Strapi CMS
const ALL_SERVICES_FALLBACK = [
  {
    name: 'Market Research',
    href: '/services/market-research',
    icon: BarChart3,
    description: 'Consumer surveys, brand tracking, U&A studies',
  },
  {
    name: 'Social Research',
    href: '/services/social-research',
    icon: Users,
    description: 'Impact assessments, policy research, NGO evaluations',
  },
  {
    name: 'Data Collection',
    href: '/services/data-collection',
    icon: FileText,
    description: 'CAPI, CATI, CAWI across 15+ Indian states',
  },
  {
    name: 'Survey Programming',
    href: '/services/survey-programming',
    icon: ClipboardList,
    description: 'Advanced skip logic, multi-language surveys',
  },
  {
    name: 'Data Processing',
    href: '/services/data-processing',
    icon: TrendingUp,
    description: 'SPSS, Quantum, cross-tabulations, analytics',
  },
  {
    name: 'Translation & Transcription',
    href: '/services/translation',
    icon: Languages,
    description: 'Multi-language research capabilities',
  },
  {
    name: 'Strategic Consulting',
    href: '/services/strategic-consulting',
    icon: Globe2,
    description: 'Research design, business intelligence, insight reports',
  },
]

const initialNavigation: NavigationItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  {
    name: 'Services',
    href: '/services',
    // FIX 2: All 7 services as fallback — not just 3
    children: ALL_SERVICES_FALLBACK,
  },
  { name: 'Case Studies', href: '/case-studies' },
  // FIX 1: '/live-surveys' → '/surveys' (that's where app/surveys/page.tsx lives)
  { name: 'Live Surveys', href: '/surveys', icon: ClipboardList },
  { name: 'AI Insights', href: '/ai-insights', icon: Bot },
  { name: 'Contact', href: '/contact', icon: Phone },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [navigation, setNavigation] = useState<NavigationItem[]>(initialNavigation)
  const closeTimer = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

  // Sync services from Strapi CMS — if available, REPLACE the fallback list
  useEffect(() => {
    const syncServices = async () => {
      try {
        const strapiServices = await serviceService.getAll()
        if (strapiServices && strapiServices.length > 0) {
          const dynamicChildren = strapiServices.map((item) => ({
            name: item.title,
            href: `/services/${item.slug}`,
            icon: iconMap[item.iconName] || BarChart3,
          }))
          setNavigation(prev =>
            prev.map(navItem =>
              navItem.name === 'Services'
                ? { ...navItem, children: dynamicChildren }
                : navItem
            )
          )
        }
        // If strapiServices is empty, keep initialNavigation fallback (all 7 services)
      } catch {
        // Strapi unreachable — silently keep the 7-service fallback. No console.error needed.
      }
    }
    syncServices()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  const isHomePage = pathname === '/'
  const isTransparent = !scrolled && isHomePage

  const handleMouseEnter = (name: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveDropdown(name)
  }

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 150)
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-100'
          : isHomePage
          ? 'bg-transparent'
          : 'bg-white shadow-sm'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg shadow-blue-200">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className={cn(
              'text-2xl font-bold tracking-tight transition-colors duration-300',
              isTransparent ? 'text-white' : 'text-slate-900'
            )}>
              Avance<span className="text-blue-600">Insights</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.children && handleMouseEnter(item.name)}
                onMouseLeave={item.children ? handleMouseLeave : undefined}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'px-4 py-2 rounded-full text-[15px] font-semibold transition-all flex items-center gap-1.5',
                    isTransparent
                      ? 'text-white/90 hover:text-white hover:bg-white/10'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50',
                    (pathname === item.href || (item.children && pathname.startsWith(item.href))) &&
                    (isTransparent ? 'bg-white/20 text-white' : 'text-blue-600 bg-blue-50')
                  )}
                >
                  {item.name}
                  {item.children && (
                    <ChevronDown className={cn(
                      'w-4 h-4 transition-transform duration-300',
                      activeDropdown === item.name && 'rotate-180'
                    )} />
                  )}
                </Link>

                {/* Desktop Dropdown — wider for 7 services */}
                <AnimatePresence>
                  {item.children && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50"
                    >
                      <div className="grid grid-cols-1 gap-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-blue-50 group transition-all"
                          >
                            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0">
                              {child.icon && <child.icon className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-slate-900 leading-tight">{child.name}</div>
                              {(child as any).description && (
                                <p className="text-[11px] text-slate-500 font-medium truncate">{(child as any).description}</p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                      {/* Footer CTA */}
                      <div className="mt-2 pt-2 border-t border-slate-100">
                        <Link href="/services" className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-blue-600 hover:bg-blue-50 text-sm font-bold transition-colors">
                          View All Services →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className={cn(
                'hidden md:block px-7 py-2.5 rounded-full font-bold text-sm transition-all transform active:scale-95',
                isTransparent
                  ? 'bg-white text-blue-600 hover:shadow-lg hover:shadow-white/20'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100'
              )}
            >
              Consult an Expert
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                'lg:hidden p-2 rounded-xl transition-colors',
                isTransparent ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'
              )}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="p-4 space-y-1 max-h-[80vh] overflow-y-auto">
              {navigation.map((item) => (
                <div key={item.name} className="space-y-1">
                  <Link
                    href={item.href}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-900 font-bold hover:bg-slate-50 transition-colors"
                  >
                    {item.name}
                    {item.children && <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </Link>
                  {item.children && (
                    <div className="ml-4 space-y-1 border-l-2 border-blue-50 pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="flex items-center gap-3 px-3 py-2 text-slate-600 text-sm font-medium hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          {child.icon && <child.icon className="w-4 h-4 flex-shrink-0" />}
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 pb-2">
                <Link href="/contact" className="block w-full text-center bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-colors">
                  Get Started Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}