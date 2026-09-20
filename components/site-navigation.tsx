'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, Phone, Menu, X, ShieldCheck, ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { CompanySettings, ProductCategory } from '@/lib/types/crm'
import { fallbackSettings } from '@/lib/api/crm'

// Shared module-level cache & in-flight fetch promise for client deduplication
let cachedCategories: ProductCategory[] | null = null
let categoriesFetchPromise: Promise<ProductCategory[]> | null = null

function fetchClientCategories(): Promise<ProductCategory[]> {
  if (cachedCategories && cachedCategories.length > 0) {
    return Promise.resolve(cachedCategories)
  }
  if (!categoriesFetchPromise) {
    categoriesFetchPromise = fetch('/api/categories?pageSize=50')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && Array.isArray(json.data) && json.data.length > 0) {
          cachedCategories = json.data
          return json.data
        }
        return []
      })
      .catch((err) => {
        console.error('Failed to load categories in client navigation fallback:', err)
        return []
      })
      .finally(() => {
        categoriesFetchPromise = null
      })
  }
  return categoriesFetchPromise
}

export function SiteHeader({ settings: customSettings, categories: customCategories }: { settings?: CompanySettings; categories?: ProductCategory[] }) {
  const settings = customSettings || fallbackSettings
  const [categories, setCategories] = useState<ProductCategory[]>(customCategories || [])
  const [mobileOpen, setMobileOpen] = useState(false)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const lastScrollY = useRef(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '')
  const wa = `https://wa.me/${cleanWhatsapp}`

  // Update categories if prop updates or fetch live CRM categories
  useEffect(() => {
    if (customCategories && customCategories.length > 0) {
      setCategories(customCategories)
      cachedCategories = customCategories
    } else {
      let isMounted = true
      fetchClientCategories().then((cats) => {
        if (isMounted && cats.length > 0) {
          setCategories(cats)
        }
      })
      return () => {
        isMounted = false
      }
    }
  }, [customCategories])

  // Track scroll position to add elevated shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="sticky top-0 z-50 w-full">
      {/* Clean, Decent Light Top Bar (Collapses slightly on scroll for compactness) */}
      <div className={`bg-slate-100 px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-600 border-b border-slate-200 transition-all duration-200 ${
        isScrolled ? 'hidden md:block' : 'block'
      }`}>
        <div className="mx-auto flex max-w-[1536px] items-center justify-between gap-4">
          <div className="flex items-center gap-3 truncate min-w-0">
            <span className="truncate font-medium">{settings.address}</span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="hidden sm:inline font-bold text-slate-800 hover:text-[#1877F2] transition shrink-0">
              {settings.phone}
            </a>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-500 font-medium shrink-0">
            <span>{settings.hours}</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`w-full border-b border-slate-200 bg-white/95 backdrop-blur-md transition-shadow duration-200 ${
          isScrolled ? 'shadow-md bg-white/98' : 'shadow-2xs'
        }`}
      >
        <div className="mx-auto flex h-16 sm:h-20 max-w-[1536px] items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 gap-4 sm:gap-8">
          {/* Pure Clean Typography Brand Name */}
          <Link href="/" className="flex flex-col justify-center group shrink-0 select-none py-1">
            <span className="text-xl sm:text-2xl lg:text-[28px] font-black tracking-tight text-[#0F172A] leading-tight whitespace-nowrap">
              TAHIRA <span className="text-[#1877F2]">SYNDICATE</span>
            </span>
            <span className="text-[10px] sm:text-[11px] lg:text-xs font-bold tracking-widest text-slate-500 uppercase leading-none mt-1 whitespace-nowrap">
              Plastics · Extrusion · Wholesale
            </span>
          </Link>

          {/* Desktop Navigation (visible on xl and above for zero overlapping/wrapping) */}
          <nav className="hidden items-center gap-6 lg:gap-7 xl:gap-8 xl:flex shrink-0">
            <Link href="/" className="text-sm lg:text-base font-semibold text-slate-700 transition hover:text-[#1877F2] whitespace-nowrap">
              Home
            </Link>

            {/* Products Direct Link */}
            <Link href="/products" className="text-sm lg:text-base font-semibold text-slate-700 transition hover:text-[#1877F2] whitespace-nowrap">
              All Products
            </Link>

            {/* Categories Link & Dropdown Menu */}
            <div
              className="relative flex items-center group/cat"
              ref={dropdownRef}
              onMouseEnter={() => setCategoryDropdownOpen(true)}
            >
              <Link
                href="/categories"
                className="text-sm lg:text-base font-semibold text-slate-700 transition hover:text-[#1877F2] whitespace-nowrap py-2 pr-0.5"
                onClick={() => setCategoryDropdownOpen(false)}
              >
                Categories
              </Link>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setCategoryDropdownOpen(!categoryDropdownOpen)
                }}
                className="p-1 text-slate-500 hover:text-[#1877F2] transition"
                aria-label="Toggle categories dropdown"
                aria-expanded={categoryDropdownOpen}
              >
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180 text-[#1877F2]' : ''}`} />
              </button>

              <AnimatePresence>
                {categoryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    onMouseLeave={() => setCategoryDropdownOpen(false)}
                    className="absolute left-0 top-full mt-1 w-64 rounded-none border border-slate-200 bg-white py-2 shadow-xl ring-1 ring-black/5 z-50"
                  >
                    <div className="flex flex-col">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/categories/${cat.slug}`}
                          onClick={() => setCategoryDropdownOpen(false)}
                          className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#1877F2] transition"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 mt-1 pt-1.5">
                      <Link
                        href="/categories"
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-xs sm:text-sm font-bold text-[#1877F2] hover:bg-blue-50/50 transition"
                      >
                        <span>View All Categories &rarr;</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/about" className="text-sm lg:text-base font-semibold text-slate-700 transition hover:text-[#1877F2] whitespace-nowrap">
              About Us
            </Link>
            <Link href="/services" className="text-sm lg:text-base font-semibold text-slate-700 transition hover:text-[#1877F2] whitespace-nowrap">
              Services
            </Link>
            <Link href="/projects" className="text-sm lg:text-base font-semibold text-slate-700 transition hover:text-[#1877F2] whitespace-nowrap">
              Projects
            </Link>
            <Link href="/contact" className="text-sm lg:text-base font-semibold text-slate-700 transition hover:text-[#1877F2] whitespace-nowrap">
              Contact
            </Link>
          </nav>

          {/* Right-Side CTA + Mobile/Tablet Menu Button */}
          <div className="flex items-center gap-3.5 shrink-0">
            {/* WhatsApp Direct Action Button (Visible on sm & up) */}
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-5 py-2.5 text-xs sm:text-sm md:text-base font-bold text-[#0F172A] shadow-xs transition hover:brightness-105 active:scale-95 shrink-0 whitespace-nowrap"
            >
              <Phone className="h-4 w-4 md:h-5 md:w-5" /> WhatsApp Direct
            </a>

            {/* Mobile / Tablet Menu Toggle (Visible below xl) */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-sm p-2 text-slate-800 xl:hidden hover:bg-slate-100 transition shrink-0"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Navigation Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-slate-100 bg-white xl:hidden shadow-lg"
            >
              <div className="flex flex-col gap-1 px-5 py-4">
                <Link onClick={() => setMobileOpen(false)} href="/" className="py-2 text-sm font-semibold text-slate-800">
                  Home
                </Link>
                <Link onClick={() => setMobileOpen(false)} href="/products" className="py-2 text-sm font-semibold text-slate-800">
                  All Products
                </Link>
                <div className="flex flex-col">
                  <div className="flex items-center justify-between py-2">
                    <Link
                      onClick={() => setMobileOpen(false)}
                      href="/categories"
                      className="text-sm font-semibold text-slate-800 hover:text-[#1877F2]"
                    >
                      Categories &amp; Materials
                    </Link>
                    {categories.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                        className="p-1.5 text-slate-600 hover:text-[#1877F2] rounded-sm hover:bg-slate-100 transition"
                        aria-label={mobileCategoryOpen ? 'Close categories' : 'Open categories'}
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileCategoryOpen ? 'rotate-180 text-[#1877F2]' : ''}`} />
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {mobileCategoryOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-3 border-l-2 border-slate-100 flex flex-col gap-1 mb-2"
                      >
                        {categories.map((c) => (
                          <Link
                            key={c.id}
                            onClick={() => setMobileOpen(false)}
                            href={`/categories/${c.slug}`}
                            className="py-1.5 text-xs font-medium text-slate-600 hover:text-[#1877F2]"
                          >
                            {c.name}
                          </Link>
                        ))}
                        <Link
                          onClick={() => setMobileOpen(false)}
                          href="/categories"
                          className="py-1.5 text-xs font-bold text-[#1877F2] hover:underline pt-1"
                        >
                          View All Categories &rarr;
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Link onClick={() => setMobileOpen(false)} href="/about" className="py-2 text-sm font-semibold text-slate-800">
                  About Us
                </Link>
                <Link onClick={() => setMobileOpen(false)} href="/services" className="py-2 text-sm font-semibold text-slate-800">
                  Services
                </Link>
                <Link onClick={() => setMobileOpen(false)} href="/projects" className="py-2 text-sm font-semibold text-slate-800">
                  Projects
                </Link>
                <Link onClick={() => setMobileOpen(false)} href="/contact" className="py-2 text-sm font-semibold text-slate-800">
                  Contact
                </Link>
                <div className="pt-3">
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#25D366] py-3 text-sm font-bold text-[#0F172A]"
                  >
                    <Phone className="h-4 w-4" /> WhatsApp Quote
                  </a>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </div>
  )
}

export function SiteFooter({ settings: customSettings, categories: customCategories }: { settings?: CompanySettings; categories?: ProductCategory[] }) {
  const settings = customSettings || fallbackSettings
  const [categories, setCategories] = useState<ProductCategory[]>(customCategories || [])
  const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '')
  const wa = `https://wa.me/${cleanWhatsapp}`

  useEffect(() => {
    if (customCategories && customCategories.length > 0) {
      setCategories(customCategories)
      cachedCategories = customCategories
    } else {
      let isMounted = true
      fetchClientCategories().then((cats) => {
        if (isMounted && cats.length > 0) {
          setCategories(cats)
        }
      })
      return () => {
        isMounted = false
      }
    }
  }, [customCategories])

  return (
    <>
      <footer className="border-t border-slate-300 bg-slate-100 px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 pt-16 pb-12 text-[#0F172A]">
        <div className="mx-auto grid max-w-[1536px] items-start gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand & NAP Summary */}
          <div className="flex flex-col">
            <div className="min-h-[38px] flex items-center">
              <Link href="/" className="flex flex-col select-none group">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A] leading-none">
                  TAHIRA <span className="text-[#1877F2]">SYNDICATE</span>
                </span>
                <span className="text-[11px] sm:text-xs font-bold tracking-widest text-slate-500 uppercase mt-1">
                  Plastics · Extrusion · Wholesale
                </span>
              </Link>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {settings.description}
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm font-bold text-[#059669]">
              <ShieldCheck className="h-5 w-5 shrink-0" /> Verified Karachi Manufacturer &amp; Wholesaler
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="flex flex-col">
            <div className="min-h-[38px] flex items-center">
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-[#0F172A] border-b-2 border-[#1877F2] pb-1.5 inline-block">
                Quick Navigation
              </h3>
            </div>
            <div className="mt-4 flex flex-col gap-2.5 text-sm sm:text-base font-semibold">
              <Link className="text-slate-600 transition hover:text-[#1877F2]" href="/">Home</Link>
              <Link className="text-slate-600 transition hover:text-[#1877F2]" href="/products">All Products Directory</Link>
              <Link className="text-slate-600 transition hover:text-[#1877F2]" href="/categories">Wholesale Categories</Link>
              <Link className="text-slate-600 transition hover:text-[#1877F2]" href="/about">About Tahira Syndicate</Link>
              <Link className="text-slate-600 transition hover:text-[#1877F2]" href="/services">Manufacturing &amp; Rigging</Link>
              <Link className="text-slate-600 transition hover:text-[#1877F2]" href="/projects">Recent Supply Scopes</Link>
              <Link className="text-slate-600 transition hover:text-[#1877F2]" href="/#reviews">Customer Reviews</Link>
              <Link className="text-slate-600 transition hover:text-[#1877F2]" href="/contact">Contact &amp; Quotes</Link>
            </div>
          </div>

          {/* Col 3: Wholesale Categories */}
          <div className="flex flex-col">
            <div className="min-h-[38px] flex items-center">
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-[#0F172A] border-b-2 border-[#1877F2] pb-1.5 inline-block">
                Wholesale Categories
              </h3>
            </div>
            <div className="mt-4 flex flex-col gap-2.5 text-sm sm:text-base text-slate-600 font-semibold">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className="hover:text-[#1877F2] transition">
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/products"
                className="mt-1 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1877F2] hover:underline"
              >
                <span>Browse All Products</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Col 4: Karachi Distribution Hub & Direct Contact */}
          <div className="flex flex-col">
            <div className="min-h-[38px] flex items-center">
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-[#0F172A] border-b-2 border-[#1877F2] pb-1.5 inline-block">
                Karachi Distribution Hub
              </h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {settings.address}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-base sm:text-lg font-bold text-[#059669] hover:text-[#16a34a] hover:underline"
              >
                <Phone className="h-5 w-5 shrink-0" /> {settings.whatsapp || settings.phone}
              </a>
              {settings.phone && settings.whatsapp !== settings.phone && (
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-slate-700 hover:text-[#1877F2]"
                >
                  <Phone className="h-4 w-4 shrink-0 text-slate-400" /> Phone: {settings.phone}
                </a>
              )}
            </div>
            <div className="mt-3 text-xs sm:text-sm font-medium text-slate-500">
              Operating Hours: {settings.hours}
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright & Geographic Anchors */}
        <div className="mx-auto max-w-[1536px] mt-14 pt-8 border-t border-slate-200/90 flex flex-col items-center justify-center gap-2.5 text-center">
          <p className="text-sm sm:text-base font-bold text-[#0F172A] tracking-tight">
            © {new Date().getFullYear()} Tahira Syndicate. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-2xl leading-normal">
            Direct Industrial Manufacturer &amp; Master Wholesale Distributor • Shahra-e-Liaquat Road • Bolton Market • SITE Area, Karachi • Nationwide Pakistan Delivery
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp Speed Dial Button (Visible on Mobile, Tablet & Desktop) */}
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Tahira Syndicate on WhatsApp"
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full sm:rounded-sm bg-[#25D366] text-[#0F172A] shadow-xl ring-2 ring-white/80 transition hover:scale-110 active:scale-95"
      >
        <Phone className="h-6 w-6 fill-current" />
      </a>
    </>
  )
}
