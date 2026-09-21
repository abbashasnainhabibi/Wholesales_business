'use client'

import { useState, useMemo, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Truck,
  Award,
  Factory,
  Search,
  X,
} from 'lucide-react'
import type { CompanySettings, ProductItem, ProductCategory } from '@/lib/types/crm'
import { fallbackSettings, submitInquiry } from '@/lib/api/crm'
import { SiteHeader, SiteFooter } from '@/components/site-navigation'
import { SourcingEstimator } from '@/components/sourcing-estimator'
import Image from 'next/image'
import { OptimizedVideo } from '@/components/optimized-video'
import { resolveMediaUrl } from '@/lib/utils'
import {
  siteContainer,
  siteContainerWide,
  eyebrowText,
  h2Text,
  h3CardTitle,
  h3SubTitle,
  bodyLead,
  bodyText,
  bulletHighlight,
  scopePillText,
  specLabel,
  ctaButtonPrimary,
  ctaButtonWhatsApp,
  ctaButtonWhatsAppLarge,
  sectionFullWidthLight,
} from '@/lib/typography'

const clientProjects = [
  { name: 'Beaconhouse School System', project: 'Sports Netting & Shading' },
  { name: 'Karachi Grammar School', project: 'Basketball Court Canopy' },
  { name: 'SLM Tyres Nooriabad', project: 'Cantilever Parking Sheds' },
  { name: 'Sindh Agro Nurseries', project: 'Agro Shade Netting 75%' },
  { name: 'S.I.T.E. Industrial Units', project: 'Heavy Polythene Liners' },
  { name: 'Marine Shipping Stevedores', project: 'Wooden Rung Pilot Ladders' },
  { name: 'Emergency Relief Camps', project: 'Canvas Relief Tents' },
  { name: 'Korangi Warehouse Logistics', project: 'Waterproof Tarpaulins' },
  { name: 'Defence Housing Authority (DHA)', project: 'Balcony & Safety Nets' },
]

import { ReviewsList } from '@/components/reviews-list'
import type { ReviewItem } from '@/lib/types/crm'

export function WholesaleHome({
  initialSettings,
  initialProducts,
  initialCategories,
  initialReviews,
}: {
  initialSettings?: CompanySettings
  initialProducts?: ProductItem[]
  initialCategories?: ProductCategory[]
  initialReviews?: ReviewItem[]
}) {
  const router = useRouter()
  const settings = initialSettings || fallbackSettings
  const products = initialProducts || []
  const categories = initialCategories || []
  const reviews = initialReviews || []

  // Live Material Search State
  const [searchQuery, setSearchQuery] = useState('')

  // Quote Form State
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formMsg, setFormMsg] = useState('')

  const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '')
  const wa = `https://wa.me/${cleanWhatsapp}`

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/products')
    }
  }

  const handleQuoteSubmit = (e: FormEvent) => {
    e.preventDefault()
    submitInquiry({
      name: formName,
      phone: formPhone,
      email: formEmail,
      materialNeeded: formMsg,
    })
    const text =
      `*New Wholesale Quote Request - Tahira Syndicate*\n\n` +
      `*Name:* ${formName || 'N/A'}\n` +
      `*Phone:* ${formPhone || 'N/A'}\n` +
      `*Email:* ${formEmail || 'N/A'}\n` +
      `*Material / Requirement:* ${formMsg || 'N/A'}`
    window.open(`${wa}?text=${encodeURIComponent(text)}`, '_blank')
  }

  // Filtered Products for Live Search Preview
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase().trim()
    return products
      .filter((p) => {
        const name = (p.name || '').toLowerCase()
        const cat = (p.category?.name || '').toLowerCase()
        const sku = (p.sku || '').toLowerCase()
        const desc = (p.usage || p.metaDescription || '').toLowerCase()
        return name.includes(q) || cat.includes(q) || sku.includes(q) || desc.includes(q)
      })
      .slice(0, 6)
  }, [searchQuery, products])

  // Available Real Categories from CRM
  const realCategories = useMemo(() => {
    return categories
  }, [categories])

  return (
    <div className="bg-white text-[#0F172A] flex flex-col justify-between min-h-screen">
      <SiteHeader settings={settings} categories={categories} />

      <main className="flex-1">
        {/* =========================================================================
            1. PREVIOUS REFINED EXECUTIVE HERO BANNER (Light Blue + Video Tour)
           ========================================================================= */}
        <section className="relative flex min-h-[540px] sm:min-h-[580px] md:min-h-[640px] items-center bg-gradient-to-br from-[#EBF4FF] via-[#F3F8FF] to-[#E6F1FF] border-b border-[#D4E5FA]">
          <div className={`${siteContainerWide} py-12 sm:py-16 md:py-20 lg:py-24`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 xl:gap-16 items-center">
              {/* Left Column: Authoritative B2B Typography & Actions */}
              <div className="lg:col-span-7">
                <p className="mb-2.5 sm:mb-3.5 text-xs sm:text-sm md:text-base font-bold uppercase tracking-[.15em] sm:tracking-[.2em] text-[#1877F2]">
                  Direct Manufacturing &amp; Wholesale • Shahra-e-Liaquat Road • Bolton Market • SITE Area Karachi
                </p>

                <h1 className="max-w-3xl text-balance font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.12] tracking-tight text-[#0F172A]">
                  {settings.tagline}
                </h1>
                <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-slate-600 font-normal">
                  Direct factory manufacturer &amp; wholesale master distributor of natural &amp; synthetic ropes, agricultural &amp; construction safety nets (hara parda), certified webbing slings &amp; ratchet cargo belts, waterproof canvas &amp; HDPE tarpaulins, flexible suction &amp; delivery pipes, construction polythene rolls, and industrial PP/PET strapping materials in Karachi and across Pakistan.
                </p>

                <div className="mt-8 sm:mt-10 flex flex-col gap-3.5 max-w-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Link
                      href="/products"
                      className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#1877F2] px-6 py-4 text-sm sm:text-base font-bold text-white shadow-sm transition hover:bg-[#1565C0] active:scale-95 text-center"
                    >
                      Browse Materials Catalog <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                    <Link
                      href="/services"
                      className="inline-flex items-center justify-center gap-2 rounded-sm border border-slate-300/90 bg-white px-6 py-4 text-sm sm:text-base font-bold text-slate-800 shadow-xs transition hover:bg-slate-50 hover:text-[#0F172A] text-center"
                    >
                      Installation Services
                    </Link>
                  </div>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 rounded-sm bg-[#25D366] px-6 py-4 text-sm sm:text-base md:text-lg font-bold text-[#0F172A] shadow-sm transition hover:brightness-105 active:scale-95 text-center"
                  >
                    <Phone className="h-5 w-5" /> WhatsApp Direct Inquiries &amp; Orders
                  </a>
                </div>
              </div>

              {/* Right Column: Enlarged, High-Definition Video Player */}
              <div className="lg:col-span-5">
                <div className="relative aspect-[16/10] lg:aspect-[4/3] xl:aspect-[16/11] w-full overflow-hidden rounded-none bg-slate-900 shadow-xl border border-slate-200">
                  <OptimizedVideo
                    src="/hero/tahira-syndicate-warehouse-tour-karachi.mp4"
                    poster="/hero/tahira-syndicate-warehouse-tour-karachi-poster.jpg"
                    isHero={true}
                    ariaLabel="Tahira Syndicate Karachi warehouse and shop walkthrough showing wholesale inventory of ropes, pipes, polymers, tarpaulins and netting"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. NEW COMPONENT 1: FIND YOUR MATERIAL OR PRODUCT (Search & Directory Box)
            ========================================================================= */}
        <section className="bg-slate-50 border-b border-slate-200 py-12 sm:py-16">
          <div className={`${siteContainer}`}>
            <div className="rounded-none border border-slate-200 bg-white shadow-md p-6 sm:p-8 md:p-10 lg:p-12">
              {/* Header / Section Title */}
              <div className="mb-6 sm:mb-8">
                <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-wider text-[#0F172A] flex items-center gap-3">
                  <Search className="h-6 w-6 text-[#1877F2]" />
                  Find Your Material or Product
                </h2>
                <p className="mt-1.5 text-sm sm:text-base text-slate-500">
                  Instant catalog lookup for wholesale buyers, builders, factories, and agricultural contractors.
                </p>
              </div>

              {/* Live Search Input Bar */}
              <div className="relative mb-6 sm:mb-8">
                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <label htmlFor="home-material-search" className="sr-only">
                      Search wholesale materials, polymers, pipes, and netting
                    </label>
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-slate-400" />
                    <input
                      id="home-material-search"
                      name="material_query"
                      type="text"
                      placeholder="Search by material, grade, diameter, GSM (e.g. HDPE, 75% Shade Net, 110mm Pipe)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search wholesale materials, polymers, pipes, and netting"
                      autoComplete="off"
                      className="w-full rounded-none border border-slate-300 bg-slate-50/50 pl-12 sm:pl-14 pr-10 py-4 text-base sm:text-lg text-slate-900 outline-none transition focus:border-[#1877F2] focus:bg-white focus:ring-1 focus:ring-[#1877F2]"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear search query"
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    aria-label="Submit search for wholesale materials"
                    className="rounded-none bg-[#1877F2] px-8 py-4 text-base font-bold text-white transition hover:bg-blue-600"
                  >
                    Search
                  </button>
                </form>

                {/* Live Search Results Popup / Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-none border border-slate-200 bg-white shadow-2xl overflow-hidden divide-y divide-slate-100">
                    <div className="bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Matching Materials ({searchResults.length} found)
                    </div>
                    {searchResults.map((prod: ProductItem) => (
                      <Link
                        key={prod.id}
                        href={`/products/${prod.slug}`}
                        className="flex items-center justify-between p-4 hover:bg-blue-50/60 transition group"
                      >
                        <div>
                          <span className="text-base font-bold text-[#0F172A] group-hover:text-[#1877F2]">
                            {prod.name}
                          </span>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mt-0.5">
                            <span>SKU: {prod.sku}</span>
                            <span>•</span>
                            <span>{prod.category?.name || 'Wholesale Material'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1877F2]">
                          <span>View Specs</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Real Available Categories / Products Directory */}
              {(realCategories.length > 0 || products.length > 0) && (
                <div>
                  <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400 mb-3.5 flex items-center gap-2">
                    <Boxes className="h-4 w-4 text-slate-500" />
                    {realCategories.length > 0 ? 'Available Product Categories:' : 'Available Wholesale Products:'}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
                    {realCategories.length > 0
                      ? realCategories.map((item: ProductCategory) => (
                          <Link
                            key={item.id}
                            href={`/categories/${item.slug}`}
                            className="flex items-center justify-between p-3 sm:p-4 rounded-none border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#1877F2] hover:shadow-2xs transition group"
                          >
                            <span className="text-xs sm:text-sm md:text-base font-bold text-slate-800 group-hover:text-[#1877F2] transition line-clamp-1">
                              {item.name}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 group-hover:text-[#1877F2] group-hover:translate-x-0.5 transition shrink-0 ml-1.5" />
                          </Link>
                        ))
                      : products.slice(0, 8).map((prod: ProductItem) => (
                          <Link
                            key={prod.id}
                            href={`/products/${prod.slug}`}
                            className="flex items-center justify-between p-3 sm:p-4 rounded-none border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#1877F2] hover:shadow-2xs transition group"
                          >
                            <span className="text-xs sm:text-sm md:text-base font-bold text-slate-800 group-hover:text-[#1877F2] transition line-clamp-1">
                              {prod.name}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 group-hover:text-[#1877F2] group-hover:translate-x-0.5 transition shrink-0 ml-1.5" />
                          </Link>
                        ))}
                  </div>

                  {/* View Full Catalog Link */}
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 text-xs sm:text-sm md:text-base">
                    <span className="text-slate-500 font-medium">Need full technical specifications &amp; bulk quantities?</span>
                    <Link href="/products" className="font-bold text-[#1877F2] hover:underline inline-flex items-center gap-1.5">
                      View Full Catalog <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. NEW COMPONENT 2: BY CHOOSING TAHIRA SYNDICATE YOUR ADVANTAGE IS REAL (4 Trust Pillars)
           ========================================================================= */}
        <section className="bg-white py-16 sm:py-24 border-b border-slate-200">
          <div className={`${siteContainer} text-center`}>
            <h2 className={h2Text}>
              Why Buyers Choose Tahira Syndicate
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-500 max-w-3xl mx-auto">
              Over 10 years of trusted wholesale supply. Real factory prices, honest weights, and fast delivery right from our Karachi warehouse.
            </p>

            {/* 4-Column Feature Grid (2 per row on mobile) with Aligned Circular Badges */}
            <div className="mt-10 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 items-stretch">
              {/* Pillar 1: Direct Pricing */}
              <div className="flex flex-col justify-between items-center text-center h-full rounded-none border border-transparent hover:border-slate-200 hover:bg-slate-50/60 p-3 sm:p-6 transition duration-200 group">
                <div className="flex flex-col items-center">
                  <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-full border-2 border-slate-200 bg-slate-50 flex items-center justify-center text-[#1877F2] group-hover:border-[#1877F2] group-hover:bg-blue-50 transition duration-300 shadow-2xs mb-3 sm:mb-5">
                    <Factory className="h-6 w-6 sm:h-9 sm:w-9" />
                  </div>
                  <h3 className="font-heading text-xs sm:text-base lg:text-lg font-black uppercase tracking-tight text-[#0F172A] group-hover:text-[#1877F2] transition leading-snug">
                    Direct Factory Rates
                  </h3>
                  <p className="mt-1.5 sm:mt-2.5 text-xs sm:text-base text-slate-600 leading-snug sm:leading-relaxed max-w-xs">
                    Buy directly from our factory and warehouse. You get genuine wholesale rates with zero middleman commissions.
                  </p>
                </div>
                <div className="mt-4 sm:mt-6 pt-1">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-sm font-bold text-[#1877F2] hover:underline"
                  >
                    Explore Products <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Pillar 2: Immediate Dispatch */}
              <div className="flex flex-col justify-between items-center text-center h-full rounded-none border border-transparent hover:border-slate-200 hover:bg-slate-50/60 p-3 sm:p-6 transition duration-200 group">
                <div className="flex flex-col items-center">
                  <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-full border-2 border-slate-200 bg-slate-50 flex items-center justify-center text-[#1877F2] group-hover:border-[#1877F2] group-hover:bg-blue-50 transition duration-300 shadow-2xs mb-3 sm:mb-5">
                    <Truck className="h-6 w-6 sm:h-9 sm:w-9" />
                  </div>
                  <h3 className="font-heading text-xs sm:text-base lg:text-lg font-black uppercase tracking-tight text-[#0F172A] group-hover:text-[#1877F2] transition leading-snug">
                    Ready Stock &amp; Fast Delivery
                  </h3>
                  <p className="mt-1.5 sm:mt-2.5 text-xs sm:text-base text-slate-600 leading-snug sm:leading-relaxed max-w-xs">
                    We maintain ready bulk stock in our warehouses for same-day dispatch across Karachi and quick delivery all over Pakistan.
                  </p>
                </div>
                <div className="mt-4 sm:mt-6 pt-1">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-sm font-bold text-[#1877F2] hover:underline"
                  >
                    Our Locations <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Pillar 3: Tested & Certified */}
              <div className="flex flex-col justify-between items-center text-center h-full rounded-none border border-transparent hover:border-slate-200 hover:bg-slate-50/60 p-3 sm:p-6 transition duration-200 group">
                <div className="flex flex-col items-center">
                  <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-full border-2 border-slate-200 bg-slate-50 flex items-center justify-center text-[#059669] group-hover:border-[#059669] group-hover:bg-emerald-50 transition duration-300 shadow-2xs mb-3 sm:mb-5">
                    <ShieldCheck className="h-6 w-6 sm:h-9 sm:w-9" />
                  </div>
                  <h3 className="font-heading text-xs sm:text-base lg:text-lg font-black uppercase tracking-tight text-[#0F172A] group-hover:text-[#059669] transition leading-snug">
                    Honest Weight &amp; Quality
                  </h3>
                  <p className="mt-1.5 sm:mt-2.5 text-xs sm:text-base text-slate-600 leading-snug sm:leading-relaxed max-w-xs">
                    No shortcuts on quality. Every order comes with verified scale weight slips and tested materials that match your exact specs.
                  </p>
                </div>
                <div className="mt-4 sm:mt-6 pt-1">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-sm font-bold text-[#059669] hover:underline"
                  >
                    About Our Standards <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Pillar 4: Technical Rigging */}
              <div className="flex flex-col justify-between items-center text-center h-full rounded-none border border-transparent hover:border-slate-200 hover:bg-slate-50/60 p-3 sm:p-6 transition duration-200 group">
                <div className="flex flex-col items-center">
                  <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-full border-2 border-slate-200 bg-slate-50 flex items-center justify-center text-[#1877F2] group-hover:border-[#1877F2] group-hover:bg-blue-50 transition duration-300 shadow-2xs mb-3 sm:mb-5">
                    <Award className="h-6 w-6 sm:h-9 sm:w-9" />
                  </div>
                  <h3 className="font-heading text-xs sm:text-base lg:text-lg font-black uppercase tracking-tight text-[#0F172A] group-hover:text-[#1877F2] transition leading-snug">
                    On-Site Installation Team
                  </h3>
                  <p className="mt-1.5 sm:mt-2.5 text-xs sm:text-base text-slate-600 leading-snug sm:leading-relaxed max-w-xs">
                    Our experienced team handles complete fitting and setup for shade structures, school sports nets, and safety netting.
                  </p>
                </div>
                <div className="mt-4 sm:mt-6 pt-1">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-sm font-bold text-[#1877F2] hover:underline"
                  >
                    Installation Services <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. WHOLESALE MATERIAL CATEGORIES (Silos)
           ========================================================================= */}
        <section className="bg-white py-16 sm:py-24">
          <div className={`${siteContainer}`}>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-14">
              <div>
                <p className={`mb-2.5 ${eyebrowText}`}>Category Taxonomy</p>
                <h2 className={h2Text}>Wholesale Material Sectors</h2>
              </div>
              <Link href="/categories" className="mt-4 md:mt-0 text-sm sm:text-base md:text-lg font-bold text-[#1877F2] hover:underline inline-flex items-center gap-1.5">
                {categories.length > 0 ? `Explore All ${categories.length} Categories` : 'Explore All Categories'} <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>

            {categories.length === 0 ? (
              <div className="rounded-none border border-dashed border-slate-200 p-12 text-center text-slate-500 bg-slate-50/50">
                <Boxes className="mx-auto h-10 w-10 text-slate-400 mb-3" />
                <p className="text-base font-bold text-slate-800">Catalog Currently Syncing</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Categories created in the CRM will appear here automatically.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                {categories.map((cat) => {
                  const slug = (cat.slug || '').toLowerCase()
                  const defaultCatFallback =

                    slug.includes('polythene') || slug.includes('plastic') || slug.includes('film')
                      ? '/uploads/categories/polythene-sheets-films.jpeg'
                      : slug.includes('pipe') || slug.includes('tube')
                      ? '/uploads/categories/building-flexible-pipes.jpeg'
                      : slug.includes('tarpaulin') || slug.includes('canvas') || slug.includes('tent')
                      ? '/uploads/categories/tarpaulins-canvas-tents.jpeg'
                      : slug.includes('belt') || slug.includes('sling') || slug.includes('harness') || slug.includes('lashing')
                      ? '/uploads/categories/safety-belts-webbing-slings.jpeg'
                      : slug.includes('net')
                      ? '/uploads/categories/nets.jpeg'
                      : slug.includes('rope') || slug.includes('cord')
                      ? '/uploads/categories/ropes.jpeg'
                      : '/uploads/categories/polythene-sheets-films.jpeg'

                  const coverImg = resolveMediaUrl(cat.image, resolveMediaUrl(defaultCatFallback))

                  return (

                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className="group flex flex-col justify-between overflow-hidden rounded-none border border-slate-200 bg-white shadow-xs hover:border-[#1877F2] hover:shadow-sm transition duration-200"
                    >
                      <div>
                        {/* Category Image Header */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-none bg-slate-100">
                          <Image
                            src={coverImg}
                            alt={`${cat.name} wholesale materials supply Karachi - Tahira Syndicate`}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-cover transition duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
                        </div>

                        {/* Text Content */}
                        <div className="p-3.5 sm:p-5">
                          <h3 className="font-heading text-sm sm:text-base lg:text-lg font-bold text-[#0F172A] group-hover:text-[#1877F2] transition line-clamp-1 leading-snug">
                            {cat.name}
                          </h3>
                          {cat.description && (
                            <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                              {cat.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Footer CTA */}
                      <div className="p-3.5 sm:p-5 pt-0">
                        <div className="pt-2.5 sm:pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm md:text-base font-bold text-[#1877F2]">
                          <span>Browse Materials</span>
                          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* =========================================================================
            6. FEATURED PRODUCTS (Verified Stock)
           ========================================================================= */}
        <section className="bg-slate-50 border-y border-slate-200 py-16 sm:py-24">
          <div className={`${siteContainer}`}>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12">
              <div>
                <p className={`mb-2.5 ${eyebrowText}`}>Verified Stock</p>
                <h2 className={h2Text}>In Stock at Our Shahra-e-Liaquat Road Warehouse</h2>
              </div>
              <Link href="/products" className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm sm:text-base md:text-lg font-bold text-[#1877F2] hover:underline">
                Open Complete Catalog <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 4).map((prod) => {
                const rawImg = prod.images?.[0]?.src || 'https://images.unsplash.com/photo-1586864387789-628af9feed72?auto=format&fit=crop&w=800&q=80'
                const imgSrc = resolveMediaUrl(rawImg)
                const imgAlt = prod.images?.[0]?.alt || `${prod.name} wholesale supply Shahra-e-Liaquat Road Karachi - Tahira Syndicate`
                return (
                  <div key={prod.id} className="transition-transform duration-200 hover:-translate-y-1">
                    <div className="group flex h-full flex-col justify-between overflow-hidden rounded-none border border-slate-200 bg-white shadow-xs transition duration-200 hover:border-slate-400 hover:shadow-sm">
                      <div>
                        {/* Image Container */}
                        <Link
                          href={`/products/${prod.slug}`}
                          className="relative block aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-none bg-slate-100 focus:outline-none"
                          aria-label={`View details for ${prod.name}`}
                        >
                          <Image
                            src={imgSrc}
                            alt={imgAlt}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition duration-700 group-hover:scale-105"
                          />
                          {prod.availability === 'InStock' && (
                            <div className="absolute right-2 top-2 sm:right-3 sm:top-3 rounded-sm bg-[#25D366] px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[11px] font-black uppercase tracking-wider text-[#0F172A] shadow-xs">
                              In Stock
                            </div>
                          )}
                        </Link>

                        {/* Content */}
                        <div className="p-4 sm:p-5">
                          <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            <span className="text-[#1877F2] font-semibold">{prod.category?.name || 'Wholesale Material'}</span>
                            <span>SKU: {prod.sku}</span>
                          </div>

                          <h3 className="font-heading text-base sm:text-lg lg:text-xl font-black text-[#0F172A] group-hover:text-[#1877F2] transition line-clamp-2 leading-snug tracking-tight">
                            <Link href={`/products/${prod.slug}`}>
                              {prod.name}
                            </Link>
                          </h3>

                          <p className="mt-2 text-xs sm:text-sm md:text-base line-clamp-2 text-slate-600 leading-relaxed">
                            {prod.usage || prod.metaDescription || 'In stock at our Shahra-e-Liaquat Road warehouse — ready for same-day pickup or dispatch.'}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-4 sm:p-5 pt-0 space-y-2 border-t border-slate-100 pt-3">
                        <a
                          href={`${wa}?text=${encodeURIComponent(`Hi Tahira Syndicate, I would like to get a wholesale quote for: ${prod.name} (SKU: ${prod.sku})`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#25D366] py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[#0F172A] transition hover:brightness-105 active:scale-95 shadow-xs"
                        >
                          <Phone className="h-4 w-4" /> WhatsApp Quote
                        </a>
                        <Link
                          href={`/products/${prod.slug}`}
                          className="flex w-full items-center justify-center gap-1.5 rounded-sm border border-slate-200 py-2 text-xs sm:text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-[#1877F2]"
                        >
                          Specs &amp; Details <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. SERVICES & RIGGING CAPABILITIES (Linked to /services)
           ========================================================================= */}
        <section className="bg-white py-16 sm:py-24">
          <div className={`${siteContainer}`}>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-14">
              <div>
                <p className={`mb-2.5 ${eyebrowText}`}>Field Engineering &amp; Supply</p>
                <h2 className={h2Text}>Manufacturing &amp; Installation Services</h2>
                <p className={`mt-3 max-w-3xl ${bodyLead}`}>
                  Beyond raw materials, our technical rigging teams manufacture and install custom safety jaal, sports turf nets, hara parda shading, kabootar jali, waterproof tarpal sheds, and rope ladders across Karachi.
                </p>
              </div>
              <Link href="/services" className="mt-4 md:mt-0 text-sm sm:text-base md:text-lg font-bold text-[#1877F2] hover:underline inline-flex items-center gap-1.5 shrink-0">
                View All Services &amp; Specs <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Service 1: Safety Nets */}
              <div className="group rounded-none border border-slate-200 bg-white overflow-hidden shadow-xs hover:border-slate-400 hover:shadow-sm transition duration-200 flex flex-col justify-between">
                <div>
                  <div className="relative h-56 sm:h-64 lg:h-72 w-full overflow-hidden rounded-none bg-slate-100">
                    <Image
                      src="/services/safety-nets/construction-scaffolding-safety-net-karachi-1.jpg"
                      alt="Construction safety netting and scaffolding protection in Karachi - Tahira Syndicate"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 sm:p-7 space-y-3">
                    <h3 className={h3SubTitle}>Safety Net Installation (Safety Jaal)</h3>
                    <p className={bodyText}>
                      High-tenacity polypropylene fall-arrest and debris containment safety jaal rigged with heavy steel cables for high-rise building construction and scaffolding.
                    </p>
                    <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs sm:text-sm font-semibold text-slate-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#059669]" /> Scaffolding &amp; shaft safety jaal coverage
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#059669]" /> Heavy-duty 12mm border tie ropes
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="p-6 sm:p-7 pt-0">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#1877F2] hover:underline"
                  >
                    View Engineering Specs <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Service 2: Sports Nets */}
              <div className="group rounded-none border border-slate-200 bg-white overflow-hidden shadow-xs hover:border-slate-400 hover:shadow-sm transition duration-200 flex flex-col justify-between">
                <div>
                  <div className="relative h-56 sm:h-64 lg:h-72 w-full overflow-hidden rounded-none bg-slate-100">
                    <Image
                      src="/services/sport-nets/sports-net-futsal-turf-court-karachi-1.jpg"
                      alt="Futsal turf sports net and cricket pitch cages in Karachi - Tahira Syndicate"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 sm:p-7 space-y-3">
                    <h3 className={h3SubTitle}>Sports Netting &amp; Cricket Pitch Jaal</h3>
                    <p className={bodyText}>
                      Braided nylon and UV-stabilized HDPE sports nets manufactured in 18 to 48 ply for cricket pitch practice cages, futsal turf grounds, and goalpost netting.
                    </p>
                    <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs sm:text-sm font-semibold text-slate-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#059669]" /> Hard-ball fast bowling impact rated
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#059669]" /> 5-year coastal weather resistance
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="p-6 sm:p-7 pt-0">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#1877F2] hover:underline"
                  >
                    View Engineering Specs <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Service 3: Shade Net Canopies */}
              <div className="group rounded-none border border-slate-200 bg-white overflow-hidden shadow-xs hover:border-slate-400 hover:shadow-sm transition duration-200 flex flex-col justify-between">
                <div>
                  <div className="relative h-56 sm:h-64 lg:h-72 w-full overflow-hidden rounded-none bg-slate-100">
                    <Image
                      src="/services/shade-nets/green-shade-net-garden-canopy-karachi-1.jpg"
                      alt="Green agro shade net terrace canopy and parking sheds Karachi - Tahira Syndicate"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 sm:p-7 space-y-3">
                    <h3 className={h3SubTitle}>Hara Parda &amp; Agro Shade Canopies</h3>
                    <p className={bodyText}>
                      Custom-stitched 50% to 90% hara parda and UV-treated shade mesh with reinforced border webbing and brass eyelets for plant nurseries, car parking sheds, and rooftop lawns.
                    </p>
                    <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs sm:text-sm font-semibold text-slate-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#059669]" /> Blocks harsh Karachi summer heat
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#059669]" /> Roll supply or custom hemmed eyelets
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="p-6 sm:p-7 pt-0">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#1877F2] hover:underline"
                  >
                    View Engineering Specs <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8. RECENT CLIENT PROJECTS & ON-SITE RIGGING (6 Real Projects Showcase)
           ========================================================================= */}
        <section className="bg-white py-16 sm:py-24 border-t border-slate-200">
          <div className={`${siteContainer}`}>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12">
              <div>
                <p className={eyebrowText}>Proven Track Record</p>
                <h2 className={h2Text}>Executed Projects &amp; Sourcing Scopes</h2>
                <p className={`mt-2 text-base sm:text-lg text-slate-600`}>
                  Documented on-site installations and verified material supplies across Karachi, Nooriabad, and Sindh.
                </p>
              </div>
              <Link href="/projects" className="mt-4 md:mt-0 text-sm sm:text-base md:text-lg font-bold text-[#1877F2] hover:underline inline-flex items-center gap-1.5 shrink-0">
                Explore Full Case Studies &amp; Specs <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
              {/* Column 1: Institutional & Educational Canopies */}
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#1877F2]">
                  <h3 className="text-base sm:text-lg lg:text-xl font-black uppercase tracking-wider text-[#0F172A]">
                    Institutional &amp; Sports Facilities
                  </h3>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">3 Projects</span>
                </div>

                {/* Project 1: KGS Basketball Court */}
                <Link
                  href="/projects"
                  className="flex items-start gap-4 p-4 rounded-none border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-[#1877F2] hover:shadow-xs transition group"
                >
                  <div className="relative h-24 w-32 sm:h-28 sm:w-36 shrink-0 overflow-hidden rounded-none bg-slate-100">
                    <Image
                      src="/projects/karachi-grammar-school/karachi-grammar-school-basketball-court-canopy-rigging-poster.jpg"
                      alt="Karachi Grammar School Sports Court Canopy"
                      fill
                      sizes="(max-width: 640px) 128px, 144px"
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] sm:text-xs font-bold text-[#1877F2] uppercase tracking-wider">
                      Karachi Grammar School
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-[#1877F2] transition leading-snug truncate">
                      Covered Basketball Court Canopy (70ft × 105ft)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-1">
                      Engineered steel truss frame &amp; waterproof PVC membrane with coastal wind tensioning in Saddar.
                    </p>
                  </div>
                </Link>

                {/* Project 2: Beaconhouse Johar Assembly Canopy */}
                <Link
                  href="/projects"
                  className="flex items-start gap-4 p-4 rounded-none border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-[#1877F2] hover:shadow-xs transition group"
                >
                  <div className="relative h-24 w-32 sm:h-28 sm:w-36 shrink-0 overflow-hidden rounded-none bg-slate-100">
                    <Image
                      src="/projects/beaconhouse-johar-campus/beaconhouse-johar-campus-assembly-canopy-karachi-1.jpg"
                      alt="Beaconhouse Johar Campus Assembly Canopy"
                      fill
                      sizes="(max-width: 640px) 128px, 144px"
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] sm:text-xs font-bold text-[#1877F2] uppercase tracking-wider">
                      Beaconhouse Johar Campus
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-[#1877F2] transition leading-snug truncate">
                      High Wind Canopy Shed (72ft × 56ft Span)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-1">
                      Clear-span arched roof with zero center columns providing 4,032 sq ft unobstructed assembly area.
                    </p>
                  </div>
                </Link>

                {/* Project 3: Beaconhouse Maymar Play Area */}
                <Link
                  href="/projects"
                  className="flex items-start gap-4 p-4 rounded-none border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-[#1877F2] hover:shadow-xs transition group"
                >
                  <div className="relative h-24 w-32 sm:h-28 sm:w-36 shrink-0 overflow-hidden rounded-none bg-slate-100">
                    <Image
                      src="/projects/beaconhouse-maymar-campus/beaconhouse-maymar-campus-play-area-shade-sail-karachi.jpg"
                      alt="Beaconhouse Maymar Campus Play Area Canopy"
                      fill
                      sizes="(max-width: 640px) 128px, 144px"
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] sm:text-xs font-bold text-[#1877F2] uppercase tracking-wider">
                      Beaconhouse Maymar Campus
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-[#1877F2] transition leading-snug truncate">
                      Outdoor Play Area Canopy (40ft × 30ft)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-1">
                      90% UV-stabilized tensioned shade sail architecture protecting kindergarten play zones from Karachi heat.
                    </p>
                  </div>
                </Link>
              </div>

              {/* Column 2: Industrial, Commercial & Walkway Structures */}
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-slate-900">
                  <h3 className="text-base sm:text-lg lg:text-xl font-black uppercase tracking-wider text-[#0F172A]">
                    Industrial, Commercial &amp; Agro
                  </h3>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">3 Projects</span>
                </div>

                {/* Project 4: SLM Tyres Nooriabad */}
                <Link
                  href="/projects"
                  className="flex items-start gap-4 p-4 rounded-none border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-[#1877F2] hover:shadow-xs transition group"
                >
                  <div className="relative h-24 w-32 sm:h-28 sm:w-36 shrink-0 overflow-hidden rounded-none bg-slate-100">
                    <Image
                      src="/projects/slm-nooriabad-parking-shed/slm-nooriabad-parking-canopy-installation-crew-1.jpg"
                      alt="SLM Tyres Nooriabad Cantilever Parking Shed"
                      fill
                      sizes="(max-width: 640px) 128px, 144px"
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] sm:text-xs font-bold text-[#059669] uppercase tracking-wider">
                      SLM Tyres Nooriabad
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-[#059669] transition leading-snug truncate">
                      10,000 Sq Ft Cantilever Parking (500ft)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-1">
                      Heavy industrial vehicle parking canopy with 20ft projection fabricated for Jamshoro factory.
                    </p>
                  </div>
                </Link>

                {/* Project 5: Beaconhouse Johar Entrance Walkway */}
                <Link
                  href="/projects"
                  className="flex items-start gap-4 p-4 rounded-none border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-[#1877F2] hover:shadow-xs transition group"
                >
                  <div className="relative h-24 w-32 sm:h-28 sm:w-36 shrink-0 overflow-hidden rounded-none bg-slate-100">
                    <Image
                      src="/projects/beaconhouse-johar-entrance-shed/beaconhouse-johar-entrance-walkway-tensile-canopy-karachi-1.jpg"
                      alt="Beaconhouse Johar Entrance Walkway Canopy"
                      fill
                      sizes="(max-width: 640px) 128px, 144px"
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] sm:text-xs font-bold text-[#1877F2] uppercase tracking-wider">
                      Johar Campus Main Entrance
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-[#1877F2] transition leading-snug truncate">
                      Curved Arch Walkway Canopy (20ft × 120ft)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-1">
                      Continuous all-weather arched corridor connecting main gate to academic building.
                    </p>
                  </div>
                </Link>

                {/* Project 6: Commercial & Agro Nurseries */}
                <Link
                  href="/projects"
                  className="flex items-start gap-4 p-4 rounded-none border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-[#1877F2] hover:shadow-xs transition group"
                >
                  <div className="relative h-24 w-32 sm:h-28 sm:w-36 shrink-0 overflow-hidden rounded-none bg-slate-100">
                    <Image
                      src="/services/shade-nets/green-shade-net-garden-canopy-karachi-1.jpg"
                      alt="High-Density Agro & Commercial Shade Netting"
                      fill
                      sizes="(max-width: 640px) 128px, 144px"
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] sm:text-xs font-bold text-[#059669] uppercase tracking-wider">
                      Agro Nurseries &amp; Rooftops
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-[#059669] transition leading-snug truncate">
                      90% UV-Treated Green Shade Structure
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-1">
                      Temperature-reducing nursery covering for wholesale farming and commercial properties.
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            9. ORIGIN STORY & MANUFACTURING FLOOR (Linked to /about)
            ========================================================================= */}
        <section className="bg-slate-50 py-16 sm:py-24 border-t border-slate-200">
          <div className={`${siteContainer} grid gap-8 lg:gap-14 md:grid-cols-2 items-center`}>
            <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden rounded-none bg-slate-100 shadow-md">
              <OptimizedVideo
                src="/about/media/rope-manufacturing-factory-machine-karachi"
                poster="/about/media/rope-manufacturing-factory-machine-karachi-poster.jpg"
                ariaLabel="Tahira Syndicate heavy rope manufacturing and twisting machine operating inside Karachi production facility"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-3 left-3 rounded-none bg-[#0F172A]/90 backdrop-blur-md px-3 py-1 text-xs sm:text-sm font-bold text-white">
                In-House Rope &amp; Net Production
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <p className={eyebrowText}>Our Origin Story</p>
              <h2 className={h2Text}>From wholesale counter to manufacturer</h2>
              <p className={bodyLead}>
                What started over 10 years ago as a wholesale trading counter in Shahra-e-Liaquat Road and Bolton Market trade corridors has evolved into direct manufacturing. Today, we produce our own ropes (Jahazi Rassa, nylon rassi, sootli) and netting in-house, while supplying polymers (plastic daana), steel-wire pressure pipes, waterproof tarpal sheets, and dhalai plastic rolls to traders and contractors across Jodia Bazaar, Saddar, and SITE Area Karachi.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="rounded-none border border-slate-200 bg-white p-5 shadow-2xs">
                  <span className="text-3xl sm:text-4xl font-black text-[#1877F2]">10+</span>
                  <p className="text-sm sm:text-base font-bold text-slate-700 mt-1">Years in Business</p>
                </div>
                <div className="rounded-none border border-slate-200 bg-white p-5 shadow-2xs">
                  <span className="text-3xl sm:text-4xl font-black text-[#059669]">100%</span>
                  <p className="text-sm sm:text-base font-bold text-slate-700 mt-1">NTN Tax Compliant</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm sm:text-base md:text-lg font-bold text-[#1877F2] hover:underline"
                >
                  Read Our Full Company Story <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            10. SOURCING ESTIMATOR COMPONENT
           ========================================================================= */}
        <SourcingEstimator settings={settings} products={products} />

        {/* =========================================================================
            11. CLIENT & PROJECT TRUST MARQUEE
           ========================================================================= */}
        <section className="border-y border-slate-200 bg-white py-14 sm:py-18">
          <div className={`${siteContainer} text-center`}>
            <p className={`mb-2 sm:mb-2.5 ${eyebrowText}`}>Proven Track Record &amp; On-Site Rigging</p>
            <h2 className={h2Text}>Trusted by Leading Institutions &amp; Contractors</h2>
          </div>
          <div className="mt-8 sm:mt-10 overflow-hidden">
            <div className="brand-marquee flex w-max gap-4 sm:gap-5 px-5 hover:[animation-play-state:paused]">
              {clientProjects.concat(clientProjects).map((item, i) => (
                <div
                  key={`${item.name}-${i}`}
                  className="flex flex-col justify-center rounded-none border border-slate-200 bg-slate-50/50 px-6 sm:px-8 py-4 text-left shadow-2xs transition hover:border-[#1877F2]/40 hover:shadow-xs min-w-[240px] sm:min-w-[280px]"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                    {item.name}
                  </span>
                  <span className="mt-1 text-xs sm:text-sm font-semibold text-[#1877F2]">
                    {item.project}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#1877F2] hover:underline"
            >
              Explore Case Studies &amp; On-Site Photos &rarr;
            </Link>
          </div>
        </section>

        {/* =========================================================================
            11b. WHAT OUR CUSTOMERS SAY (General Customer Reviews)
           ========================================================================= */}
        <section id="reviews" className="border-b border-slate-200 bg-white py-16 sm:py-24 scroll-mt-20">
          <div className={`${siteContainer}`}>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className={`mb-2 sm:mb-2.5 ${eyebrowText}`}>Customer Experiences &amp; Feedback</p>
              <h2 className={h2Text}>What Our Customers Say</h2>
              <p className={`mt-3 ${bodyLead}`}>
                Authentic testimonials from commercial contractors, procurement officers, and retail distributors partnered with Tahira Syndicate.
              </p>
            </div>

            <ReviewsList
              reviews={reviews}
              title="Verified Client Testimonials"
              emptyMessage="No general reviews published yet. Have you partnered with Tahira Syndicate? Share your experience via our contact page!"
            />
          </div>
        </section>

        {/* =========================================================================
            12. DIRECT PROCUREMENT DESK (Quote Form & WhatsApp)
           ========================================================================= */}
        <section id="quote" className="bg-slate-50 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8 rounded-none">
            <div className="rounded-none border border-slate-200 bg-white p-6 sm:p-10 md:p-12 shadow-sm">
              <p className={`mb-2 ${eyebrowText}`}>Direct Procurement Desk</p>
              <h2 className={h2Text}>Request a Formal Trade Quote</h2>
              <p className={`mt-3 ${bodyLead}`}>
                Submit your Bill of Quantities (BOQ) or required material quantity for official proforma rates and immediate warehouse reservation.
              </p>
              <form onSubmit={handleQuoteSubmit} className="mt-8 grid gap-4 sm:gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="quote-name" className="sr-only">Full Name or Company Name</label>
                  <input
                    id="quote-name"
                    name="name"
                    type="text"
                    placeholder="Full Name / Company Name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    autoComplete="name"
                    aria-label="Full Name or Company Name"
                    className="w-full rounded-sm border border-slate-300 bg-slate-50/50 px-4 py-3.5 sm:py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#1877F2] focus:bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="quote-phone" className="sr-only">Mobile or WhatsApp Number</label>
                  <input
                    id="quote-phone"
                    name="phone"
                    type="tel"
                    placeholder="Mobile / WhatsApp (e.g. 0300 1234567)"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    required
                    autoComplete="tel"
                    aria-label="Mobile or WhatsApp Number"
                    className="w-full rounded-sm border border-slate-300 bg-slate-50/50 px-4 py-3.5 sm:py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#1877F2] focus:bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="quote-email" className="sr-only">Email Address (Optional)</label>
                  <input
                    id="quote-email"
                    name="email"
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    autoComplete="email"
                    aria-label="Email Address (Optional)"
                    className="w-full rounded-sm border border-slate-300 bg-slate-50/50 px-4 py-3.5 sm:py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#1877F2] focus:bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="quote-message" className="sr-only">Required Material, Specifications & Quantity</label>
                  <textarea
                    id="quote-message"
                    name="message"
                    placeholder="Required Material & Quantity (e.g. 50 rolls green shade net 75%, 200 bags PE granules 50kg, 500m HDPE 110mm PN10 pipe...)"
                    rows={3}
                    value={formMsg}
                    onChange={(e) => setFormMsg(e.target.value)}
                    required
                    aria-label="Required Material, Specifications & Quantity"
                    className="w-full rounded-sm border border-slate-300 bg-slate-50/50 px-4 py-3.5 sm:py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#1877F2] focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  aria-label="Send Quote Request via WhatsApp"
                  className="w-full sm:col-span-2 inline-flex items-center justify-center gap-2.5 rounded-sm bg-[#25D366] px-6 py-4 sm:py-4.5 text-base sm:text-lg font-bold text-[#0F172A] shadow-xs transition hover:brightness-105 active:scale-95 text-center"
                >
                  <Phone className="h-5 w-5 shrink-0" /> Send Quote Request via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter settings={settings} categories={categories} />
    </div>
  )
}

export default WholesaleHome

