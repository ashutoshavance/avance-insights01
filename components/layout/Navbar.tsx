'use client'

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import {
  Menu, X, ChevronDown, BarChart3, Users,
  FileText, MessageSquare, ClipboardList, Phone, Bot,
  TrendingUp, Globe2, Languages, ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { serviceService } from '@/services/service.service'

// Types
interface NavChild {
  name: string
  href: string
  icon?: React.ElementType
  description?: string
}

interface NavigationItem {
  name: string
  href: string
  icon?: React.ElementType
  children?: NavChild[]
}

// Constants
const ICON_MAP: Record<string, React.ElementType> = {
  BarChart3, Users, FileText, MessageSquare, ClipboardList,
  Bot, Phone, TrendingUp, Globe2, Languages,
}

const ALL_SERVICES_FALLBACK: NavChild[] = [
  { name: 'Market Research', href: '/services/market-research', icon: BarChart3, description: 'Consumer surveys, brand tracking, U&A studies' },
  { name: 'Social Research', href: '/services/social-research', icon: Users, description: 'Impact assessments, policy research, NGO evaluations' },
  { name: 'Data Collection', href: '/services/data-collection', icon: FileText, description: 'CAPI, CATI, CAWI across 15+ Indian states' },
  { name: 'Survey Programming', href: '/services/survey-programming', icon: ClipboardList, description: 'Advanced skip logic, multi-language surveys' },
  { name: 'Data Processing', href: '/services/data-processing', icon: TrendingUp, description: 'SPSS, Quantum, cross-tabulations, analytics' },
  { name: 'Translation & Transcription', href: '/services/translation', icon: Languages, description: 'Multi-language research capabilities' },
  { name: 'Strategic Consulting', href: '/services/strategic-consulting', icon: Globe2, description: 'Research design, business intelligence' },
]

const BASE_NAVIGATION: NavigationItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services', children: ALL_SERVICES_FALLBACK },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'Live Surveys', href: '/surveys', icon: ClipboardList },
  { name: 'AI Insights', href: '/ai-insights', icon: Bot },
  { name: 'Contact', href: '/contact', icon: Phone },
]

// Animation variants
const dropdownVariants = {
  hidden: { 
    opacity: 0, 
    y: 8, 
    scale: 0.96, 
    transition: { duration: 0.15, ease: 'easeIn' } 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.2, ease: 'easeOut' } 
  },
  exit: { 
    opacity: 0, 
    y: 8, 
    scale: 0.96, 
    transition: { duration: 0.15, ease: 'easeIn' } 
  },
}

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' } },
}

// Memoized child components
const ServiceIcon = memo(({ icon: Icon, isHovered }: { icon?: React.ElementType; isHovered: boolean }) => {
  if (!Icon) return null
  return (
    <div className={cn(
      "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0",
      isHovered ? "bg-primary-600 text-white shadow-md" : "bg-slate-50 text-slate-400"
    )}>
      <Icon className="w-4 h-4" />
    </div>
  )
})
ServiceIcon.displayName = 'ServiceIcon'

const DropdownItem = memo(({ child }: { child: NavChild }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <Link
      href={child.href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary-50/80 group transition-all duration-200"
    >
      <ServiceIcon icon={child.icon} isHovered={isHovered} />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-slate-800 leading-tight group-hover:text-primary-700 transition-colors duration-200">
          {child.name}
        </div>
        {child.description && (
          <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate group-hover:text-slate-500 transition-colors">
            {child.description}
          </p>
        )}
      </div>
    </Link>
  )
})
DropdownItem.displayName = 'DropdownItem'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [navigation, setNavigation] = useState<NavigationItem[]>(BASE_NAVIGATION)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()
  const { scrollY } = useScroll()
  
  // Optimized scroll detection using Framer Motion
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20)
  })

  // Fetch services from Strapi
  useEffect(() => {
    let isMounted = true
    
    serviceService.getAll().then((items) => {
      if (!isMounted) return;

      const children: NavChild[] = items.length
        ? items.map((s) => ({
            name: s.title,
            href: `/services/${s.slug}`,
            icon: ICON_MAP[s.iconName] ?? BarChart3,
            description: s.description,
          }))
        : ALL_SERVICES_FALLBACK;

      setNavigation((prev) =>
        prev.map((item) => (item.name === 'Services' ? { ...item, children } : item))
      );
    }).catch(() => {
      // On error, use fallback services
      setNavigation((prev) =>
        prev.map((item) => (item.name === 'Services' ? { ...item, children: ALL_SERVICES_FALLBACK } : item))
      );
    });
    
    return () => { isMounted = false }
  }, [])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isHomePage = pathname === '/'
  const isTransparent = !isScrolled && isHomePage

  // FIXED: Better mouse handling with delay
  const handleMouseEnter = useCallback((name: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setActiveDropdown(name)
  }, [])

  const handleMouseLeave = useCallback(() => {
    closeTimerRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 200) // Increased delay for better UX
  }, [])

  // FIXED: Handle dropdown container mouse enter/leave
  const handleDropdownMouseEnter = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const handleDropdownMouseLeave = useCallback(() => {
    closeTimerRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 200)
  }, [])

  const handleDropdownToggle = useCallback((name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name))
  }, [])

  // Determine active state
  const isItemActive = useCallback((item: NavigationItem) => {
    if (pathname === item.href) return true
    if (item.children && pathname.startsWith('/services')) return true
    return false
  }, [pathname])

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : isHomePage ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 1)',
        backdropFilter: isScrolled ? 'blur(12px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-shadow duration-300',
        isScrolled && 'shadow-sm border-b border-slate-100/80',
        !isScrolled && !isHomePage && 'border-b border-slate-100'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Main navigation">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg"
            aria-label="Avance Insights Home"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-600/20 group-hover:bg-primary-700 transition-colors duration-300"
            >
              <span className="text-white font-bold text-base tracking-tight">A</span>
            </motion.div>
            <span className={cn(
              'text-xl font-bold tracking-tight transition-colors duration-300',
              isTransparent ? 'text-white' : 'text-slate-900'
            )}>
              Avance<span className={isTransparent ? 'text-primary-300' : 'text-primary-600'}>Insights</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const hasDropdown = !!item.children
              const isActive = isItemActive(item)
              const isDropdownOpen = activeDropdown === item.name
              
              return (
                <div
                  key={item.name}
                  className="relative"
                  ref={hasDropdown ? dropdownRef : undefined}
                  onMouseEnter={hasDropdown ? () => handleMouseEnter(item.name) : undefined}
                  onMouseLeave={hasDropdown ? handleMouseLeave : undefined}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      if (hasDropdown) {
                        e.preventDefault()
                        handleDropdownToggle(item.name)
                      }
                    }}
                    className={cn(
                      'relative px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                      isTransparent
                        ? 'text-white/90 hover:text-white hover:bg-white/10'
                        : 'text-slate-600 hover:text-primary-700 hover:bg-primary-50/60',
                      isActive && (isTransparent 
                        ? 'text-white bg-white/15' 
                        : 'text-primary-700 bg-primary-50/80'
                      )
                    )}
                    aria-expanded={hasDropdown ? isDropdownOpen : undefined}
                    aria-haspopup={hasDropdown ? 'true' : undefined}
                  >
                    <span>{item.name}</span>
                    {hasDropdown && (
                      <motion.span
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4 opacity-70" />
                      </motion.span>
                    )}
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className={cn(
                          "absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                          isTransparent ? "bg-white" : "bg-primary-600"
                        )}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu - FIXED: Added padding to bridge gap */}
                  <AnimatePresence>
                    {hasDropdown && isDropdownOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onMouseEnter={handleDropdownMouseEnter}
                        onMouseLeave={handleDropdownMouseLeave}
                        className="absolute top-full left-0 pt-2 z-50"
                        style={{ minWidth: '320px' }}
                      >
                        <div className="w-80 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 p-2 overflow-hidden">
                          <div className="space-y-0.5">
                            {item.children?.map((child) => (
                              <DropdownItem 
                                key={child.name} 
                                child={child}
                              />
                            ))}
                          </div>
                          
                          <div className="mt-2 pt-2 border-t border-slate-100">
                            <Link
                              href="/services"
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-primary-600 hover:bg-primary-50 text-sm font-semibold transition-all duration-200 group"
                            >
                              <span>View All Services</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/contact"
                className={cn(
                  'hidden md:inline-flex items-center px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 shadow-md',
                  isTransparent
                    ? 'bg-white text-primary-700 hover:bg-slate-50 hover:shadow-lg'
                    : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-primary-600/25 shadow-primary-600/20'
                )}
              >
                Consult an Expert
              </Link>
            </motion.div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                'lg:hidden p-2.5 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                isTransparent ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'
              )}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="lg:hidden bg-white border-t border-slate-100 shadow-xl shadow-slate-900/5 overflow-hidden"
          >
            <div className="p-4 space-y-1 max-h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href
                const hasChildren = !!item.children
                
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="space-y-0.5"
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-all duration-200 text-sm',
                        isActive
                          ? 'bg-primary-50 text-primary-700 shadow-sm'
                          : 'text-slate-800 hover:bg-slate-50'
                      )}
                    >
                      <span>{item.name}</span>
                      {hasChildren && <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </Link>
                    
                    {hasChildren && item.children && (
                      <div className="ml-3 border-l-2 border-primary-100 pl-3 space-y-0.5 mt-1">
                        {item.children.map((child, childIndex) => (
                          <motion.div
                            key={child.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (index * 0.05) + (childIndex * 0.03) }}
                          >
                            <Link
                              href={child.href}
                              className="flex items-center gap-2.5 px-3 py-2.5 text-slate-600 text-sm font-medium hover:text-primary-700 hover:bg-primary-50/70 rounded-lg transition-all duration-200"
                            >
                              {child.icon && <child.icon className="w-4 h-4 flex-shrink-0 text-slate-400" />}
                              <span>{child.name}</span>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )
              })}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-4 pb-2"
              >
                <Link
                  href="/contact"
                  className="block w-full text-center bg-primary-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-primary-700 transition-all duration-300 shadow-lg shadow-primary-600/20 hover:shadow-xl hover:shadow-primary-600/30"
                >
                  Get Started Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}