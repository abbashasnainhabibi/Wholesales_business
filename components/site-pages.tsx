'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { OptimizedVideo } from '@/components/optimized-video'
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  FileText,
  MapPin,
  Phone,
  Ruler,
  Truck,
  Users,
  Warehouse,
  ExternalLink,
  Navigation,
  Clock3,
  Mail,
  ShieldCheck,
  Scale,
  MessageSquare,
  Building2,
  Coins,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from 'lucide-react'
import { useState, useMemo, type FormEvent } from 'react'
import type { CompanySettings, ProductItem, ProductCategory } from '@/lib/types/crm'
import { fallbackSettings, submitInquiry } from '@/lib/api/crm'
import { installationServices } from '@/lib/data/services'
import { SiteHeader, SiteFooter } from '@/components/site-navigation'
import { ReviewForm } from '@/components/review-form'
import { resolveMediaUrl, scrollToElement, scrollToTop } from '@/lib/utils'
import {
  siteContainer,
  siteContainerWide,
  siteContainerFocused,
  eyebrowText,
  h1Text,
  h2Text,
  h3CardTitle,
  h3SubTitle,
  bodyLead,
  bodyText,
  bulletHighlight,
  scopePillText,
  specLabel,
  specValue,
  ctaButtonWhatsApp,
  ctaButtonWhatsAppLarge,
  ctaButtonPrimary,
  ctaButtonSecondary,
  heroVideoHeight,
  mediaGridCardHeight,
  mediaSingleDoubleHeight,
  mediaGalleryCardHeight,
  mediaB2BSidebarHeight,
  cardPadding,
  sectionFullWidthLight,
} from '@/lib/typography'

export function Chrome({ children, settings: customSettings, categories: customCategories }: { children: React.ReactNode; settings?: CompanySettings; categories?: ProductCategory[] }) {
  const settings = customSettings || fallbackSettings
  const categories = customCategories || []

  return (
    <div className="min-h-screen bg-white text-[#0F172A] flex flex-col justify-between">
      <SiteHeader settings={settings} categories={categories} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} categories={categories} />
    </div>
  )
}

const reveal = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }
const Fade = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div initial="hidden" whileInView="visible" variants={reveal} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6, delay, ease: 'easeOut' }}>
    {children}
  </motion.div>
)

function Intro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <section className={`${siteContainer} pb-8 sm:pb-10 pt-12 sm:pt-16 md:pb-14 md:pt-20`}>
      <p className={`mb-2.5 sm:mb-3.5 ${eyebrowText}`}>{eyebrow}</p>
      <h1 className={`max-w-5xl ${h1Text}`}>{title}</h1>
      <p className={`mt-4 sm:mt-6 max-w-4xl ${bodyLead}`}>{copy}</p>
    </section>
  )
}

export function AboutPage({
  initialSettings,
  initialCategories,
}: {
  initialSettings?: CompanySettings
  initialCategories?: ProductCategory[]
}) {
  const settings = initialSettings || fallbackSettings
  const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '')
  const wa = `https://wa.me/${cleanWhatsapp}`

  return (
    <Chrome settings={settings} categories={initialCategories}>
      {/* Internal Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className={`${siteContainer} pt-6`}>
        <ol className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500">
          <li>
            <Link href="/" className="hover:text-[#1877F2] transition">Home</Link>
          </li>
          <li>
            <span className="text-slate-400">/</span>
          </li>
          <li className="font-bold text-[#0F172A]" aria-current="page">About Us</li>
        </ol>
      </nav>

      <Intro
        eyebrow="About Tahira Syndicate"
        title="A Karachi trading business that became a manufacturer."
        copy="Tahira Syndicate started on Shahra-e-Liaquat Road, Karachi, as a wholesale trading counter. Today, after more than 10 years in the business, we manufacture our own ropes (Jahazi Rassa, nylon cordage, sootli), safety and sports netting, and custom polythene rolls (dhalai / chhat ka plastic) — alongside supplying polymer granules (plastic daana), steel-wire pressure pipes, waterproof tarpal sheets, and hara parda at direct trade rates across Pakistan."
      />

      <main>
        {/* Physical Shopfront & Direct Counter First */}
        <section className={`${siteContainer} pb-16 sm:pb-24`}>
          <div>
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16 items-center">
              {/* Left Column: Authentic Storefront Image */}
              <div className="lg:col-span-6">
                <Fade>
                  <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] w-full overflow-hidden rounded-none border border-slate-200 bg-slate-100 shadow-sm group">
                    <Image
                      src="/about/tahira-syndicate-shahra-e-liaquat-wholesale-shopfront-karachi.jpg"
                      alt="Tahira Syndicate wholesale shopfront counter on Shahra-e-Liaquat Road Karachi with ropes, lifting belts, suction pipes, and tarpaulins"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 45vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/85 via-transparent to-transparent flex items-end p-4 sm:p-6 text-white pointer-events-none">
                      <div>
                        <span className="inline-flex items-center gap-1.5 rounded-none bg-[#1877F2] px-2.5 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">
                          <MapPin className="h-3 w-3" /> Shahra-e-Liaquat Road Wholesale Counter
                        </span>
                        <p className="mt-2 text-sm sm:text-base font-bold leading-tight">
                          Tahira Syndicate Walk-In Shopfront
                        </p>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Hardware &amp; Commercial Market, Shahra-e-Liaquat Road, Karachi
                        </p>
                      </div>
                    </div>
                  </div>
                </Fade>
              </div>

              {/* Right Column: Physical Trade Counter Story & Highlights */}
              <div className="lg:col-span-6 space-y-5">
                <Fade delay={0.1}>
                  <div>
                    <p className={eyebrowText}>Direct Wholesale &amp; Manufacturing</p>
                    <h2 className={`mt-2 ${h2Text}`}>
                      Visit our shop on Shahra-e-Liaquat Road
                    </h2>
                    <p className={`mt-3 sm:mt-4 text-sm sm:text-base text-slate-700 leading-relaxed`}>
                      We manufacture ropes and industrial netting directly, and wholesale commercial tarpaulins, taar suction pipes, and plastic granules. 
                    </p>
                    <p className={`mt-3 text-sm sm:text-base text-slate-700 leading-relaxed`}>
                      Our customers are construction contractors, transport &amp; logistics operators, hardware retailers, agricultural buyers, and factory managers across Pakistan who need reliable bulk supply, genuine weights, and wholesale prices.
                    </p>
                    <p className={`mt-3 text-sm sm:text-base text-slate-600 leading-relaxed`}>
                      You are always welcome to visit our shop to check material quality in person, discuss custom orders, or pick up stock directly.
                    </p>
                  </div>

                  {/* Direct Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    <a
                      href={`${wa}?text=${encodeURIComponent('Hi Tahira Syndicate, I want to visit your Shahra-e-Liaquat Road wholesale counter for product inspection.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`justify-center ${ctaButtonWhatsApp}`}
                    >
                      <Phone className="h-4 w-4" /> Message Counter on WhatsApp
                    </a>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 rounded-sm border border-slate-300 bg-white px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 transition hover:bg-slate-100 hover:border-slate-400"
                    >
                      <Navigation className="h-4 w-4 text-[#1877F2]" /> View Address &amp; Map
                    </Link>
                  </div>
                </Fade>
              </div>
            </div>
          </div>
        </section>

        {/* Origin Story & Real Manufacturing Visual */}
        <section className={`${siteContainer} grid gap-8 lg:gap-14 xl:gap-16 pb-16 sm:pb-24 md:grid-cols-2 items-center`}>
          <Fade>
            <div className={`relative ${heroVideoHeight} overflow-hidden rounded-none bg-slate-100 shadow-sm`}>
              <OptimizedVideo
                src="/about/media/rope-manufacturing-factory-machine-karachi"
                poster="/about/media/rope-manufacturing-factory-machine-karachi-poster.jpg"
                ariaLabel="Tahira Syndicate heavy rope manufacturing and twisting machine operating inside Karachi production facility"
                className="h-full w-full object-cover"
              />
            </div>
          </Fade>

          <Fade delay={0.1}>
            <p className={eyebrowText}>Our Origin Story</p>
            <h2 className={`mt-3 ${h2Text}`}>From wholesale counter to manufacturer</h2>
            <p className={`mt-4 sm:mt-5 ${bodyLead}`}>
              It began simply — a passion for the trade, and a small wholesale counter on Shahra-e-Liaquat Road. Over more than 10 years, that grew step by step. What started as pure wholesale trading is now also direct manufacturing: we produce our own ropes and netting products in-house, while continuing to stock and supply polymer granules (plastic daana), taar wala suction pipes, waterproof tarpal (moom jama), and construction plastic in bulk.
            </p>
            
            {/* Stats, Trust Badge & WhatsApp Action */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-5">
              <div className="border-t-2 border-[#1877F2] pt-2 sm:pt-3 pr-4">
                <b className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1877F2]">10+</b>
                <p className="text-xs sm:text-sm md:text-base font-bold text-slate-700 mt-0.5">Years in Business</p>
              </div>

              <div className="flex items-center gap-3 sm:gap-3.5 rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 sm:px-5 sm:py-3.5 w-full sm:w-auto">
                <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7 text-[#1877F2] shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm md:text-base font-bold text-[#0F172A]">NTN Registered</p>
                  <p className="text-[11px] sm:text-xs md:text-sm text-slate-500 font-medium">Official Tax Invoicing Available</p>
                </div>
              </div>

              <a
                href={`${wa}?text=${encodeURIComponent('Hi Tahira Syndicate, I would like to inquire about your in-house manufactured rope and netting products.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full sm:w-auto justify-center ${ctaButtonWhatsAppLarge}`}
              >
                <Phone className="h-4.5 w-4.5" /> Inquire on WhatsApp
              </a>
            </div>
          </Fade>
        </section>

        {/* Real Stock, Real Work Media Gallery */}
        <section className={sectionFullWidthLight}>
          <div className={`${siteContainer}`}>
            <div className="mb-12 text-center md:text-left">
              <p className={`mb-2 ${eyebrowText}`}>Facility &amp; Stock Activity</p>
              <h2 className={h2Text}>Real stock, real work</h2>
              <p className={`mt-3 max-w-3xl ${bodyLead}`}>
                Direct snapshots and video from our manufacturing floors, wholesale warehouses, and product inventory across Karachi.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Media Card 1: Video - Polythene Sheeting */}
              <Fade delay={0.05}>
                <div className={`relative ${mediaGalleryCardHeight} overflow-hidden rounded-none bg-slate-100 shadow-xs group`}>
                  <OptimizedVideo
                    src="/about/media/polythene-sheeting-production-line-karachi"
                    poster="/about/media/polythene-sheeting-production-line-karachi-poster.jpg"
                    ariaLabel="Tahira Syndicate polythene film and plastic sheeting production line Karachi"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent p-4 sm:p-5 pt-10 text-white">
                    <p className="text-sm sm:text-base font-bold leading-snug">Plastic Sheeting Production</p>
                    <p className="text-xs sm:text-sm text-slate-300 mt-0.5">Continuous film extrusion line</p>
                  </div>
                </div>
              </Fade>

              {/* Media Card 2: Video - Blown Film Extrusion Machine */}
              <Fade delay={0.1}>
                <div className={`relative ${mediaGalleryCardHeight} overflow-hidden rounded-none bg-slate-100 shadow-xs group`}>
                  <OptimizedVideo
                    src="/about/media/blown-film-plastic-extrusion-line-karachi"
                    poster="/about/media/blown-film-plastic-extrusion-line-karachi-poster.jpg"
                    ariaLabel="High-tower blown-film plastic extrusion machine producing rolls in Karachi factory"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent p-4 sm:p-5 pt-10 text-white">
                    <p className="text-sm sm:text-base font-bold leading-snug">Blown Film Extrusion Plant</p>
                    <p className="text-xs sm:text-sm text-slate-300 mt-0.5">High-tower vertical bubble film production</p>
                  </div>
                </div>
              </Fade>

              {/* Media Card 3: Video - Braided Rope Spooling */}
              <Fade delay={0.15}>
                <div className={`relative ${mediaGalleryCardHeight} overflow-hidden rounded-none bg-slate-100 shadow-xs group`}>
                  <OptimizedVideo
                    src="/about/media/braided-rope-spooling-manufacturing-karachi"
                    poster="/about/media/braided-rope-spooling-manufacturing-karachi-poster.jpg"
                    ariaLabel="Nylon rope coil spooling and preparation inside Tahira Syndicate facility Karachi"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent p-4 sm:p-5 pt-10 text-white">
                    <p className="text-sm sm:text-base font-bold leading-snug">Rope Coiling &amp; Bundling</p>
                    <p className="text-xs sm:text-sm text-slate-300 mt-0.5">In-house braided production</p>
                  </div>
                </div>
              </Fade>

              {/* Media Card 4: Video - Wholesale Tarpaulin & Shade Net Bundles */}
              <Fade delay={0.2}>
                <div className={`relative ${mediaGalleryCardHeight} overflow-hidden rounded-none bg-slate-100 shadow-xs group`}>
                  <OptimizedVideo
                    src="/about/media/wholesale-tarpaulin-shade-net-stock-karachi"
                    poster="/about/media/wholesale-tarpaulin-shade-net-stock-karachi-poster.jpg"
                    ariaLabel="Wholesale waterproof tarpaulin bundles and shade net stock stored in Shahra-e-Liaquat Road warehouse Karachi"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent p-4 sm:p-5 pt-10 text-white">
                    <p className="text-sm sm:text-base font-bold leading-snug">Tarpaulin &amp; Netting Bundles</p>
                    <p className="text-xs sm:text-sm text-slate-300 mt-0.5">Shahra-e-Liaquat Road wholesale inventory</p>
                  </div>
                </div>
              </Fade>

              {/* Media Card 5: Video - Marine Pilot Rope Ladders */}
              <Fade delay={0.25}>
                <div className={`relative ${mediaGalleryCardHeight} overflow-hidden rounded-none bg-slate-100 shadow-xs group`}>
                  <OptimizedVideo
                    src="/about/media/marine-pilot-rope-ladder-warehouse-karachi"
                    poster="/about/media/marine-pilot-rope-ladder-warehouse-karachi-poster.jpg"
                    ariaLabel="Wooden rung marine pilot rope ladders fabricated and stacked for ship supply in Karachi"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent p-4 sm:p-5 pt-10 text-white">
                    <p className="text-sm sm:text-base font-bold leading-snug">Marine Pilot Rope Ladders</p>
                    <p className="text-xs sm:text-sm text-slate-300 mt-0.5">Fabricated marine access ladders</p>
                  </div>
                </div>
              </Fade>

              {/* Media Card 6: Video - Polymer Recycling & Extrusion */}
              <Fade delay={0.3}>
                <div className={`relative ${mediaGalleryCardHeight} overflow-hidden rounded-none bg-slate-100 shadow-xs group`}>
                  <OptimizedVideo
                    src="/about/media/polymer-recycling-extrusion-karachi"
                    poster="/about/media/polymer-recycling-extrusion-karachi-poster.jpg"
                    ariaLabel="Polymer raw materials processing and extrusion facility in Karachi"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent p-4 sm:p-5 pt-10 text-white">
                    <p className="text-sm sm:text-base font-bold leading-snug">Polymer Material Processing</p>
                    <p className="text-xs sm:text-sm text-slate-300 mt-0.5">Raw material preparation &amp; compounding</p>
                  </div>
                </div>
              </Fade>
            </div>
          </div>
        </section>

        {/* What We Stand For (Equal Height Cards with Specific Semantic Icons) */}
        <section className={`${siteContainer} py-20 sm:py-24`}>
          <div className="mb-12 text-center md:text-left">
            <p className={`mb-2 ${eyebrowText}`}>Principles &amp; Trust</p>
            <h2 className={h2Text}>What we stand for.</h2>
            <p className={`mt-3 max-w-3xl ${bodyLead}`}>
              Honest specifications, dependable stock depth, and reliable delivery for all trade clients.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 items-stretch">
            {[
              {
                title: 'Integrity',
                description: 'Clear communication and honest specifications.',
                Icon: Scale,
              },
              {
                title: 'Bulk Assurance',
                description: 'The stock depth to support serious buying.',
                Icon: Warehouse,
              },
              {
                title: 'Delivery',
                description: 'A practical, responsive route to your site.',
                Icon: Truck,
              },
            ].map(({ title, description, Icon }, i) => (
              <Fade delay={i * 0.08} key={title}>
                <div className="h-full rounded-none border border-slate-200 bg-white p-8 sm:p-9 shadow-xs flex flex-col justify-start">
                  <div className="flex h-14 w-14 items-center justify-center rounded-none bg-blue-50 text-[#1877F2]">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className={`mt-6 ${h3SubTitle}`}>{title}</h3>
                  <p className={`mt-3 ${bodyLead} flex-1`}>{description}</p>
                </div>
              </Fade>
            ))}
          </div>
        </section>

        {/* Closing Contained B2B Procurement Card */}
        <section className={`${siteContainer} pb-16 sm:pb-24 pt-4`}>
          <div className="rounded-none border border-slate-200 bg-white p-6 sm:p-10 lg:p-12 shadow-sm">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16 items-center">
              {/* Left Column: Offerings & Action */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <p className={eyebrowText}>Direct B2B Procurement</p>
                  <h2 className={`mt-3 ${h2Text}`}>
                    Work directly with a Karachi manufacturer &amp; wholesaler
                  </h2>
                  <p className={`mt-4 ${bodyLead}`}>
                    Connect with our sales desk on WhatsApp for instant proforma quotes, product specifications, and verified delivery schedules across Karachi and Pakistan.
                  </p>
                </div>

                {/* 4 Offering Capability Badges with Icons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
                  <div className="flex items-start gap-3.5 rounded-none border border-slate-100 bg-slate-50/80 p-3.5 sm:p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-blue-50 text-[#1877F2]">
                      <Boxes className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-bold text-[#0F172A]">Bulk Stock &amp; In-House Production</p>
                      <p className="text-xs sm:text-sm text-slate-500 leading-normal mt-0.5">Ropes, shade &amp; safety nets, tarpaulin &amp; polymers</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 rounded-none border border-slate-100 bg-slate-50/80 p-3.5 sm:p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-blue-50 text-[#1877F2]">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-bold text-[#0F172A]">Karachi &amp; Up-Country Cargo</p>
                      <p className="text-xs sm:text-sm text-slate-500 leading-normal mt-0.5">Same-day Shahra-e-Liaquat Road dispatch + nationwide transport</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 rounded-none border border-slate-100 bg-slate-50/80 p-3.5 sm:p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-blue-50 text-[#1877F2]">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-bold text-[#0F172A]">Official Tax Invoicing</p>
                      <p className="text-xs sm:text-sm text-slate-500 leading-normal mt-0.5">NTN registered proforma &amp; corporate billing</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 rounded-none border border-slate-100 bg-slate-50/80 p-3.5 sm:p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-blue-50 text-[#1877F2]">
                      <Clock3 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-bold text-[#0F172A]">Rapid Quotations</p>
                      <p className="text-xs sm:text-sm text-slate-500 leading-normal mt-0.5">Instant WhatsApp rates for contractor &amp; tender BOQs</p>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
                  <a
                    href={`${wa}?text=${encodeURIComponent('Hi Tahira Syndicate, I would like to inquire about wholesale materials and manufacturing supply.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`justify-center ${ctaButtonWhatsAppLarge}`}
                  >
                    <Phone className="h-5 w-5" /> Inquire on WhatsApp
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-sm border border-slate-300 bg-white px-5 sm:px-6 py-3.5 text-xs sm:text-base font-bold text-slate-800 transition hover:bg-slate-50 hover:border-slate-400"
                  >
                    View Warehouse Location <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Video Preview Card */}
              <div className="lg:col-span-5">
                <div className={`relative overflow-hidden rounded-none bg-slate-100 shadow-md ${mediaB2BSidebarHeight}`}>
                  <OptimizedVideo
                    src="/about/media/heavy-duty-marine-rope-coils-karachi"
                    poster="/about/media/heavy-duty-marine-rope-coils-karachi-poster.jpg"
                    ariaLabel="Tahira Syndicate bulk inventory and materials ready for dispatch in Karachi"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/30 to-transparent flex flex-col justify-between p-6 text-white">
                    <div className="self-start rounded-none bg-emerald-600/90 px-3 py-1 text-xs font-bold tracking-wider uppercase backdrop-blur flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-white animate-pulse" /> Active Shahra-e-Liaquat Road Dispatch
                    </div>
                    <div>
                      <p className="text-base font-black">Tahira Syndicate Warehouse &amp; Production</p>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1">Shahra-e-Liaquat Road &amp; SITE Area, Karachi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Chrome>
  )
}

const additionalCapabilities = [
  {
    title: 'Freight Logistics',
    description: 'Loading and dispatch from the Shahra-e-Liaquat Road warehouse to sites in Karachi and up-country.',
    Icon: Truck,
  },
  {
    title: 'Technical Specs Consultancy',
    description: 'Straight answers on pipe class, net gauge and polymer grade before you commit to volume.',
    Icon: FileText,
  },
  {
    title: 'Account Managers',
    description: 'Deal with the same person every time — they already know what you order and how you like it delivered.',
    Icon: Users,
  },
  {
    title: 'Warehousing',
    description: 'Covered stock in factory rolls, 50kg bags and bora sacks, released against confirmed orders.',
    Icon: Warehouse,
  },
]

export function ServicesPage({
  initialSettings,
  initialProducts,
  initialCategories,
}: {
  initialSettings?: CompanySettings
  initialProducts?: ProductItem[]
  initialCategories?: ProductCategory[]
}) {
  const settings = initialSettings || fallbackSettings
  const products = initialProducts || []
  const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '')
  const wa = `https://wa.me/${cleanWhatsapp}`

  // 5 items per page pagination & search filter
  const ITEMS_PER_PAGE = 5
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return installationServices
    const q = searchQuery.toLowerCase().trim()
    return installationServices.filter((s) => {
      const title = (s.title || '').toLowerCase()
      const desc = (s.description || s.longDescription || '').toLowerCase()
      const eyebrow = (s.eyebrow || '').toLowerCase()
      const tradeAlias = (s.tradeAlias || '').toLowerCase()
      const bullets = (s.bullets || []).join(' ').toLowerCase()
      return title.includes(q) || desc.includes(q) || eyebrow.includes(q) || tradeAlias.includes(q) || bullets.includes(q)
    })
  }, [searchQuery])

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE) || 1

  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    scrollToTop()
  }

  return (
    <Chrome settings={settings} categories={initialCategories}>
      {/* Internal SEO Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className={`${siteContainer} pt-6`}>
        <ol className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500">
          <li>
            <Link href="/" className="hover:text-[#1877F2] transition">Home</Link>
          </li>
          <li>
            <span className="text-slate-400">/</span>
          </li>
          <li className="font-bold text-[#0F172A]" aria-current="page">Services &amp; Net Installation</li>
        </ol>
      </nav>

      <Intro
        eyebrow="B2B Manufacturing & On-Site Installation"
        title="Net Manufacturing, Custom Supply & Installation in Karachi"
        copy="We manufacture industrial and sports netting in-house and provide on-site installation across Karachi and Sindh. From cricket pitch cages and construction safety jaal to hara parda shading and heavy tarpaulin sheds, get direct factory rates with fast dispatch from our Shahra-e-Liaquat Road and SITE warehouses."
      />
      <main>
        {/* Section 1: What We Install & Supply */}
        <section id="services-list" className={`${siteContainer} pb-16 sm:pb-20 scroll-mt-24`}>
          <div className="mb-8 sm:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 border-b border-slate-200 pb-5 sm:pb-7">
            <div className="max-w-3xl">
              <p className={`mb-2 sm:mb-2.5 ${eyebrowText}`}>Direct Manufacturing &amp; Rigging</p>
              <h2 className={h2Text}>What We Install &amp; Supply</h2>
              <p className={`mt-3 ${bodyLead}`}>
                Custom mesh sizes, heavy border ropes, and full on-site installation across Karachi and Sindh industrial zones.
              </p>
            </div>
            <div className="flex items-center justify-between sm:justify-start gap-4 shrink-0 whitespace-nowrap pt-2 md:pt-0">
              <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-sm border border-slate-200">
                Showing {filteredServices.length} Services
              </span>
              <Link
                href="/categories"
                className="shrink-0 inline-flex items-center gap-1.5 text-xs sm:text-sm md:text-base font-bold text-[#1877F2] hover:underline"
              >
                <span>View Categories</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Search Input Bar for Services */}
          <div className="mb-10 max-w-2xl relative">
            <div className="relative">
              <label htmlFor="services-search" className="sr-only">
                Search fabrication and installation services
              </label>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="services-search"
                name="service_query"
                type="text"
                placeholder="Search services (e.g. Cricket Net, Bird Net, Tensile Canopy, Scaffolding, Sports)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                aria-label="Search fabrication and installation services"
                className="w-full rounded-sm border border-slate-300 bg-slate-50/70 pl-12 pr-10 py-3.5 text-sm sm:text-base text-slate-900 outline-none transition focus:border-[#1877F2] focus:bg-white focus:ring-1 focus:ring-[#1877F2] shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full p-1"
                  aria-label="Clear service search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="mt-2 text-xs font-semibold text-slate-500">
                Found {filteredServices.length} installation &amp; supply services matching &ldquo;{searchQuery}&rdquo;
              </p>
            )}
          </div>

          {/* Service Cards (Standardized Option 1: 50/50 Visual-First Layout) */}
          <div className="space-y-10 sm:space-y-14">
            {paginatedServices.map((service, index) => {
              const isEven = index % 2 === 0
              const mainMedia = service.images[0]
              const thumbnails = service.images.slice(1, 4)
              const isMainVideo = mainMedia?.isVideo || mainMedia?.src.endsWith('.mp4') || mainMedia?.src.endsWith('.mov')

              return (
                <Fade delay={0.05} key={service.id}>
                  <article id={service.id} className="grid lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 rounded-none bg-white p-5 sm:p-7 lg:p-8 shadow-xs border border-slate-100 transition duration-200">
                    {/* Left/Right Alternating: Dominant 6-Column Visual Canvas with 1 Clean Main Media */}
                    <div className={`lg:col-span-6 flex flex-col justify-center ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      <Link
                        href={`/services/${service.id}`}
                        className="relative aspect-[16/11] sm:aspect-[16/10] w-full overflow-hidden rounded-none shadow-xs group block"
                      >
                        {isMainVideo ? (
                          <OptimizedVideo
                            src={mainMedia.src}
                            poster={mainMedia.poster}
                            ariaLabel={mainMedia.alt}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <Image
                            src={mainMedia.src}
                            alt={mainMedia.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition duration-700 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute bottom-3 left-3 rounded-none bg-[#0F172A]/90 backdrop-blur-md px-2.5 py-1 text-[11px] sm:text-xs font-black uppercase tracking-wider text-white">
                          {isMainVideo ? 'Production Video' : 'On-Site Installation'}
                        </div>
                      </Link>
                    </div>

                    {/* Content Column */}
                    <div className={`lg:col-span-6 flex flex-col justify-between space-y-4 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div>
                        <span className={eyebrowText}>{service.eyebrow}</span>
                        <h3 className={`mt-1 ${h3CardTitle}`}>
                          <Link href={`/services/${service.id}`} className="hover:text-[#1877F2] transition">
                            {service.title}
                          </Link>
                        </h3>
                        {service.tradeAlias && (
                          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap text-xs sm:text-sm">
                            <span className="font-bold uppercase tracking-wider text-slate-700 shrink-0">
                              Trade Names:
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {service.tradeAlias.split('•').map((alias, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center rounded-sm bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-800 border border-slate-200"
                                >
                                  {alias.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <p className={`mt-3 ${bodyText}`}>{service.description}</p>

                        {/* 4 Feature Highlights */}
                        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {service.bullets.map((bullet) => (
                            <li key={bullet} className={`flex items-start gap-2 ${bulletHighlight}`}>
                              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-[#1877F2] mt-0.5" />
                              <span className="leading-snug">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action CTAs */}
                      <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 border-t border-slate-100">
                        <Link
                          href={`/services/${service.id}`}
                          className={`w-full justify-center text-center ${ctaButtonPrimary}`}
                        >
                          View Details &amp; Specs <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 ml-1" />
                        </Link>
                        <a
                          href={`${wa}?text=${encodeURIComponent(service.inquiryText)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full justify-center text-center ${ctaButtonWhatsApp}`}
                        >
                          <Phone className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" /> Inquire on WhatsApp
                        </a>
                      </div>
                    </div>
                  </article>
                </Fade>
              )
            })}
          </div>

          {/* Pagination Controls (5 per page) */}
          {totalPages > 1 && (
            <div className="mt-12 sm:mt-16 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-sm border text-xs sm:text-sm font-bold transition ${
                  currentPage === 1
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                    : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400'
                }`}
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-9 w-9 sm:h-10 sm:w-10 rounded-sm text-xs sm:text-sm font-bold transition ${
                      currentPage === pageNum
                        ? 'bg-[#1877F2] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-sm border text-xs sm:text-sm font-bold transition ${
                  currentPage === totalPages
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                    : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400'
                }`}
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>

        {/* Section 2: What Else We Offer (Compact 4-Column Row) */}
        <section className="border-t border-slate-200 bg-[#F8FAFC] py-20">
          <div className={`${siteContainer}`}>
            <div className="mb-12 text-center md:text-left">
              <p className="mb-2 text-xs sm:text-sm font-black uppercase tracking-[.2em] text-[#1877F2]">Supply Capabilities</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A]">What Else We Offer</h2>
              <p className="mt-3 max-w-3xl text-base sm:text-lg lg:text-xl text-slate-600">
                Full logistics, technical advisory, and warehouse fulfillment supporting every trade order.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {additionalCapabilities.map(({ title, description, Icon }, i) => (
                <Fade delay={i * 0.05} key={title}>
                  <div className="h-full rounded-none border border-slate-200 bg-white p-7 lg:p-8 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-none bg-[#1877F2]/10 text-[#1877F2]">
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                      <h3 className="mt-5 text-lg sm:text-xl lg:text-2xl font-black text-[#0F172A]">{title}</h3>
                      <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-slate-600">{description}</p>
                    </div>
                  </div>
                </Fade>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Products Catalog Grid */}
        <section className={`${siteContainer} py-20`}>
          <p className="mb-2 text-xs sm:text-sm font-black uppercase tracking-[.2em] text-[#1877F2]">Wholesale Product Catalog</p>
          <h2 className="mb-3 text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A]">Stocked &amp; Ready for Delivery</h2>
          <p className="mb-10 max-w-3xl text-base sm:text-lg lg:text-xl text-slate-600">
            Direct warehouse stock ready for same-day dispatch across Karachi and up-country.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((prod: ProductItem, i: number) => {
              const imgSrc = resolveMediaUrl(prod.images?.[0]?.src)
              const imgAlt = prod.images?.[0]?.alt || prod.name
              return (

                <Fade delay={i * 0.05} key={prod.id}>
                  <motion.article whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="group overflow-hidden rounded-none border border-slate-200 bg-white shadow-xs flex flex-col h-full">
                    <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
                      <Image src={imgSrc} alt={imgAlt} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" />
                    </div>
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                          <span className="text-[#1877F2] font-semibold">{prod.category?.name || 'Wholesale Material'}</span>
                          <span className="text-[#25D366]">In Stock</span>
                        </div>
                        <h3 className="mt-1 text-base sm:text-lg font-black text-[#0F172A] leading-snug">{prod.name}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-2">{prod.usage || prod.category?.description || 'Factory sealed wholesale trade stock.'}</p>
                      </div>
                      <a
                        href={`${wa}?text=${encodeURIComponent(`Hi Tahira Syndicate, I would like to get a trade quote for: ${prod.name} (SKU: ${prod.sku})`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1877F2] hover:underline"
                      >
                        Inquire on WhatsApp <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </motion.article>
                </Fade>
              )
            })}
          </div>
        </section>
      </main>
    </Chrome>
  )
}

interface ProjectMediaItem {
  src: string
  alt: string
  isVideo?: boolean
  poster?: string
}

interface ProjectCaseStudy {
  id: string
  title: string
  client: string
  location: string
  serviceType: string
  serviceSlug: string
  dimensions: string
  summary: string
  specHighlights: string[]
  inquiryText: string
  media: ProjectMediaItem[]
}

const realCaseStudies: ProjectCaseStudy[] = [
  {
    id: 'beaconhouse-johar-campus',
    title: 'High Wind-Pressure Canopy Shed (No Center Column)',
    client: 'Beaconhouse School — Johar Campus',
    location: 'Johar Campus, Karachi',
    serviceType: 'Tarpaulin / Canopy Installation',
    serviceSlug: 'tarpaulin-canopy',
    dimensions: '72 ft × 56 ft',
    summary:
      'Beaconhouse needed a covered assembly space that would not block sports or student line-ups with middle pillars. We fabricated and erected an open 72ft × 56ft curved steel truss canopy with zero center columns. It shelters the entire 4,032 sq ft ground for morning assemblies and cricket games while easily handling strong coastal winds.',
    specHighlights: [
      'Wide 72ft × 56ft span without a single center pillar',
      'Curved steel truss frame built for coastal Karachi winds',
      'Heavy-duty waterproof PVC canopy membrane',
      'Full coverage over student assembly & sports area',
    ],
    inquiryText:
      'Hi Tahira Syndicate, I would like to inquire about wide-span canopy sheds similar to the Beaconhouse Johar Campus project.',
    media: [
      {
        src: '/projects/beaconhouse-johar-campus/beaconhouse-johar-campus-assembly-canopy-karachi-1.jpg',
        alt: 'Wide-span canopy shed structure installed over school assembly ground at Beaconhouse Johar Campus Karachi',
      },
      {
        src: '/projects/beaconhouse-johar-campus/beaconhouse-johar-campus-arched-shed-structure-karachi-2.jpg',
        alt: 'Arched steel framework and tensile canopy shed at Beaconhouse School Johar Campus Karachi',
      },
      {
        src: '/projects/beaconhouse-johar-campus/beaconhouse-johar-campus-corridor-canopy-karachi-3.jpg',
        alt: 'Side corridor canopy installation and perimeter steel anchoring at Beaconhouse Johar Campus',
      },
      {
        src: '/projects/beaconhouse-johar-campus/beaconhouse-johar-campus-night-walkway-canopy-karachi-4.jpg',
        alt: 'Illuminated night view of assembly area canopy shed installed at Beaconhouse Johar Campus Karachi',
      },
    ],
  },
  {
    id: 'beaconhouse-johar-entrance-shed',
    title: 'School Entrance Walkway Canopy Shed',
    client: 'Beaconhouse School — Johar Campus Entrance',
    location: 'Johar Campus, Karachi',
    serviceType: 'Tarpaulin / Canopy Installation',
    serviceSlug: 'tarpaulin-canopy',
    dimensions: '20 ft × 120 ft',
    summary:
      'During summer heat and sudden monsoon showers, morning drop-offs at the school gate were tough on parents and young kids. We installed a 20ft wide by 120ft long covered walkway running straight from the main gate to reception. The curved steel arch rafters and heavy PVC canopy keep the walkway shaded and dry all year.',
    specHighlights: [
      'Continuous 120ft long sheltered walkway corridor',
      'Curved arch steel rafter frame anchored to side boundary',
      'Heavy-duty waterproof and UV-blocking PVC fabric',
      'Shaded gate-to-reception path for student drop-offs',
    ],
    inquiryText:
      'Hi Tahira Syndicate, I would like to inquire about entrance walkway canopies similar to the Beaconhouse Johar Entrance project.',
    media: [
      {
        src: '/projects/beaconhouse-johar-entrance-shed/beaconhouse-johar-entrance-walkway-tensile-canopy-karachi-1.jpg',
        alt: '20ft by 120ft school entrance walkway tensile canopy shed installed at Beaconhouse Johar Campus Karachi',
      },
      {
        src: '/projects/beaconhouse-johar-entrance-shed/beaconhouse-johar-entrance-tensile-roof-structure-karachi-2.jpg',
        alt: 'Curved steel frame and waterproof canopy roofing for entrance corridor at Beaconhouse Johar Campus',
      },
    ],
  },
  {
    id: 'karachi-grammar-school',
    title: 'Covered Basketball Court & College Campus Canopy',
    client: 'Karachi Grammar School (KGS)',
    location: 'Saddar & Boat Basin Campuses, Karachi',
    serviceType: 'Sports Net & Tensile Canopy',
    serviceSlug: 'sport-nets',
    dimensions: '70 ft × 105 ft (Saddar) & 72 ft × 120 ft (Boat Basin)',
    summary:
      'We took on two separate campus installations for Karachi Grammar School. Over at the Saddar campus (near 7Days Hospital), we put up a 70ft × 105ft covered canopy over the basketball court so students can play in any weather. At the Boat Basin College campus in Clifton, we rigged a 72ft × 120ft shade canopy with high-impact sports netting and floodlight wiring.',
    specHighlights: [
      'Two campus installations: Saddar & Boat Basin',
      '70ft × 105ft covered basketball court canopy in Saddar',
      '72ft × 120ft multipurpose sports canopy at Boat Basin',
      'Integrated high-impact sports netting & floodlight rigging',
    ],
    inquiryText:
      'Hi Tahira Syndicate, I would like to inquire about sports canopy and netting installations similar to Karachi Grammar School.',
    media: [
      {
        src: '/projects/karachi-grammar-school/karachi-grammar-school-basketball-court-canopy-rigging.mp4',
        poster: '/projects/karachi-grammar-school/karachi-grammar-school-basketball-court-canopy-rigging-poster.jpg',
        alt: 'On-site rigging and installation of basketball court canopy structure at Karachi Grammar School',
        isVideo: true,
      },
      {
        src: '/projects/karachi-grammar-school/karachi-grammar-school-floodlit-sports-canopy-karachi-1.jpg',
        alt: 'Floodlit covered basketball court canopy structure at Karachi Grammar School Saddar campus',
      },
      {
        src: '/projects/karachi-grammar-school/karachi-grammar-school-covered-court-night-view-karachi-2.jpg',
        alt: 'Night perspective of covered sports ground canopy structure at Karachi Grammar School',
      },
    ],
  },
  {
    id: 'slm-nooriabad-parking-shed',
    title: '10,000 Sq Ft Cantilever Commercial Parking Shed',
    client: 'Service Long March Tyres Pvt Ltd (SLM)',
    location: 'Nooriabad, Jamshoro Industrial Area',
    serviceType: 'Tarpaulin / Canopy Installation',
    serviceSlug: 'tarpaulin-canopy',
    dimensions: '500 ft × 20 ft (10,000 sq ft)',
    summary:
      'Nooriabad desert heat beats down hard on factory vehicles. For Service Long March Tyres, we built a 10,000 sq ft parking canopy that stretches a continuous 500 feet with a 20-foot cantilever overhang. The heavy cantilever frame has zero front pillars, so transport trucks and staff cars can pull in and out without navigating around support posts.',
    specHighlights: [
      '10,000 sq ft total shaded vehicle parking capacity',
      '500ft long single-run cantilever frame with 20ft depth',
      'Zero front columns for easy truck and car maneuvering',
      'Heavy-duty industrial PVC cover built for extreme heat',
    ],
    inquiryText:
      'Hi Tahira Syndicate, I would like to inquire about large-scale commercial parking sheds similar to the SLM Tyres Nooriabad project.',
    media: [
      {
        src: '/projects/slm-nooriabad-parking-shed/slm-tyres-nooriabad-cantilever-parking-shed-installation.mp4',
        poster: '/projects/slm-nooriabad-parking-shed/slm-tyres-nooriabad-cantilever-parking-shed-installation-poster.jpg',
        alt: 'Continuous 500ft cantilever parking shed installation at Service Long March Tyres plant in Nooriabad',
        isVideo: true,
      },
      {
        src: '/projects/slm-nooriabad-parking-shed/slm-nooriabad-parking-canopy-installation-crew-1.jpg',
        alt: 'Installation crew erecting 10,000 sq ft cantilever parking shed at SLM Tyres Nooriabad Jamshoro',
      },
      {
        src: '/projects/slm-nooriabad-parking-shed/slm-nooriabad-parking-shed-steel-frame-2.jpg',
        alt: 'Heavy cantilever steel framework for industrial vehicle parking shed at SLM Tyres Nooriabad',
      },
    ],
  },
  {
    id: 'beaconhouse-maymar-campus',
    title: 'Outdoor Play Area Canopy & Shade Structure',
    client: 'Beaconhouse School — Maymar Campus',
    location: 'Maymar Campus, Karachi',
    serviceType: 'Tarpaulin / Canopy Installation',
    serviceSlug: 'tarpaulin-canopy',
    dimensions: '40 ft × 30 ft + 16 ft × 16 ft',
    summary:
      'The kindergarten playground at Maymar campus was too hot for kids during midday breaks. We designed and pitched an L-shaped shade canopy: a 40ft × 30ft main play section connected to a 16ft × 16ft side wing. The heavy shade fabric cuts direct solar heat while keeping the play area bright, breezy, and safe.',
    specHighlights: [
      'L-shaped layout: 40ft × 30ft main plus 16ft × 16ft wing',
      'High UV-blocking membrane that cuts playground heat',
      'Rigid steel post anchoring with safety perimeter',
      'Full playground shade for kindergarten and primary kids',
    ],
    inquiryText:
      'Hi Tahira Syndicate, I would like to inquire about play area canopy structures similar to the Beaconhouse Maymar Campus project.',
    media: [
      {
        src: '/projects/beaconhouse-maymar-campus/beaconhouse-maymar-campus-play-area-shade-sail-karachi.jpg',
        alt: 'Outdoor play area canopy and shade structure installed at Beaconhouse Maymar Campus Karachi',
      },
    ],
  },
  {
    id: 'rooftop-shade-net-installation',
    title: 'High-Density Agro & Commercial Rooftop Shade Netting',
    client: 'Commercial & Residential Clients',
    location: 'Karachi, Sindh',
    serviceType: 'Green & Blue Shade Net Supply & Installation',
    serviceSlug: 'shade-nets',
    dimensions: 'Custom Arched Frame & Rooftop Coverage',
    summary:
      'Open Karachi rooftops turn scorching hot by 11 AM. For our residential and restaurant clients, our rigging crew builds curved steel pipe frames and stretches 90% green shade net (Hara Parda) tightly across them. The mesh drops sitting area temperatures by 5°C to 10°C, cuts harsh glare, and lets the sea breeze blow right through.',
    specHighlights: [
      '90% UV-stabilized virgin HDPE green shade net (Hara Parda)',
      'Curved steel pipe frame with turnbuckle cable rigging',
      'Cools open terraces and rooftop lawns by 5°C to 10°C',
      'Custom stitched edge webbing with heavy-duty brass eyelets',
    ],
    inquiryText:
      'Hi Tahira Syndicate, I would like to inquire about commercial rooftop and agro shade net installations in Karachi.',
    media: [
      {
        src: '/projects/rooftop-shade-net-installation/commercial-rooftop-shade-net-installation-crew-karachi.mp4',
        poster: '/projects/rooftop-shade-net-installation/commercial-rooftop-shade-net-installation-crew-karachi-poster.jpg',
        alt: 'Tahira Syndicate rigging crew installing commercial rooftop green shade netting in Karachi',
        isVideo: true,
      },
    ],
  },
]

export function ProjectsPage({
  initialSettings,
  initialCategories,
}: {
  initialSettings?: CompanySettings
  initialCategories?: ProductCategory[]
}) {
  const settings = initialSettings || fallbackSettings
  const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '')
  const wa = `https://wa.me/${cleanWhatsapp}`

  const ITEMS_PER_PAGE = 4
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return realCaseStudies
    const q = searchQuery.toLowerCase().trim()
    return realCaseStudies.filter((project) => {
      const title = (project.title || '').toLowerCase()
      const client = (project.client || '').toLowerCase()
      const loc = (project.location || '').toLowerCase()
      const serviceType = (project.serviceType || '').toLowerCase()
      const dimensions = (project.dimensions || '').toLowerCase()
      const summary = (project.summary || '').toLowerCase()
      const highlights = (project.specHighlights || []).join(' ').toLowerCase()
      return (
        title.includes(q) ||
        client.includes(q) ||
        loc.includes(q) ||
        serviceType.includes(q) ||
        dimensions.includes(q) ||
        summary.includes(q) ||
        highlights.includes(q)
      )
    })
  }, [searchQuery])

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE) || 1

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProjects, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    scrollToTop()
  }

  const startProjectIndex = filteredProjects.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endProjectIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)

  return (
    <Chrome settings={settings} categories={initialCategories}>
      {/* Internal SEO Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className={`mx-auto ${siteContainer} pt-6`}>
        <ol className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <li>
            <Link href="/" className="hover:text-[#1877F2] transition">Home</Link>
          </li>
          <li>
            <span className="text-slate-400">/</span>
          </li>
          <li className="font-bold text-[#0F172A]" aria-current="page">Projects &amp; Case Studies</li>
        </ol>
      </nav>

      <Intro
        eyebrow="On-Site Canopy & Netting Installations"
        title="Completed Canopy, Netting & Industrial Supply Projects"
        copy="Take a look at the canopy sheds, sports netting cages, and commercial parking structures we have built for schools, factories, and commercial clients across Karachi and Nooriabad. Every project here has real dimensions, photos, and on-site video clips."
      />

      <main>
        {/* Case Studies Section */}
        <section id="case-studies-list" className={`mx-auto ${siteContainer} pb-16 sm:pb-20 scroll-mt-24`}>
          <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-5 border-b border-slate-200 pb-5 sm:pb-7">
            <div>
              <p className={`mb-2 sm:mb-2.5 ${eyebrowText}`}>
                Documented On-Site Work
              </p>
              <h2 className={h2Text}>
                Featured Client Case Studies
              </h2>
              <p className={`mt-3 max-w-3xl ${bodyLead}`}>
                Take a closer look at our finished tensile canopies, basketball court sheds, and industrial shade installations with actual site measurements and job photos.
              </p>
            </div>
            <a
              href={`${wa}?text=${encodeURIComponent('Hi Tahira Syndicate, I would like to discuss a custom canopy or netting installation project.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto shrink-0 whitespace-nowrap text-center ${ctaButtonWhatsApp}`}
            >
              <Phone className="h-4 w-4 shrink-0" /> Request Site Survey
            </a>
          </div>

          {/* Search Input Bar for Case Studies */}
          <div className="mb-10 max-w-2xl relative">
            <div className="relative">
              <label htmlFor="projects-search" className="sr-only">
                Search completed projects and case studies
              </label>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="projects-search"
                name="project_query"
                type="text"
                placeholder="Search case studies (e.g. Karachi Grammar School, Beaconhouse, SLM Tyres, Tensile Canopy, Rooftop)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                aria-label="Search completed projects and case studies"
                className="w-full rounded-sm border border-slate-300 bg-slate-50/70 pl-12 pr-10 py-3.5 text-sm sm:text-base text-slate-900 outline-none transition focus:border-[#1877F2] focus:bg-white focus:ring-1 focus:ring-[#1877F2] shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full p-1"
                  aria-label="Clear project search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>
                Showing {filteredProjects.length === 0 ? '0' : `${startProjectIndex}–${endProjectIndex}`} of {filteredProjects.length} projects
              </span>
              {searchQuery && (
                <span className="text-blue-600">Filtered by &ldquo;{searchQuery}&rdquo;</span>
              )}
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="rounded-none border border-slate-200 bg-slate-50 p-12 text-center">
              <Boxes className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0F172A]">No case studies match &ldquo;{searchQuery}&rdquo;</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                Try searching with terms like &quot;canopy&quot;, &quot;cricket&quot;, &quot;school&quot;, or &quot;shade net&quot;.
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setSearchQuery('')}
                  className="rounded-sm bg-[#1877F2] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-blue-600 transition"
                >
                  Clear Search Filter
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="space-y-8 sm:space-y-10 lg:space-y-14">
                {paginatedProjects.map((project, index) => {
                const isEven = index % 2 === 0
                return (
                  <Fade delay={0.05} key={project.id}>
                    <article className={`grid items-center gap-6 sm:gap-7 lg:grid-cols-12 lg:gap-9 rounded-none border border-slate-200 bg-white p-4 sm:p-7 lg:p-8 shadow-xs`}>
                      {/* Visual Gallery matching ServicesPage sizing and grid */}
                      <div className={`flex flex-col justify-center w-full min-w-0 ${project.media.length >= 3 ? 'lg:col-span-5' : 'lg:col-span-5'} ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                        <div
                          className={`grid gap-2 sm:gap-3.5 w-full ${
                            project.media.length === 1
                              ? 'grid-cols-1 aspect-[16/10] sm:aspect-[16/11] max-h-[380px]'
                              : project.media.length === 2
                              ? 'grid-cols-1 sm:grid-cols-2 aspect-[16/14] sm:aspect-[16/10] max-h-[380px]'
                              : 'grid-cols-2 grid-rows-2 h-72 sm:h-88 lg:h-[390px]'
                          }`}
                        >
                          {project.media.map((item, idx) => (
                            <div
                              key={item.src}
                              className={`relative h-full w-full overflow-hidden rounded-none bg-slate-100 shadow-2xs min-h-[120px] ${
                                project.media.length === 3 && idx === 2 ? 'col-span-2' : ''
                              }`}
                            >
                              {item.isVideo ? (
                                <OptimizedVideo
                                  src={item.src}
                                  poster={item.poster}
                                  ariaLabel={item.alt}
                                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                                />
                              ) : (
                                <Image
                                  src={item.src}
                                  alt={item.alt}
                                  fill
                                  sizes={
                                    project.media.length === 1
                                      ? '(max-width: 768px) 100vw, 45vw'
                                      : project.media.length === 3 && idx === 2
                                      ? '(max-width: 768px) 100vw, 45vw'
                                      : '(max-width: 768px) 50vw, (max-width: 1200px) 45vw, 22vw'
                                  }
                                  className="object-cover transition duration-700 hover:scale-105"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Content & Specs matching ServicesPage font sizing, badges, and layout */}
                      <div className={`flex flex-col w-full min-w-0 ${project.media.length >= 3 ? 'lg:col-span-7' : 'lg:col-span-7'} ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                            <span className={eyebrowText}>
                              {project.serviceType}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className={`${scopePillText} break-words`}>
                              {project.location}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 break-words">{project.client}</p>
                          <h3 className={`mt-1.5 ${h3CardTitle} break-words`}>
                            {project.title}
                          </h3>

                          {/* Scope Dimension Pill */}
                          <div className={`mt-2.5 sm:mt-3 inline-flex flex-wrap items-center gap-2 rounded-sm bg-slate-100 px-3 sm:px-3.5 py-1.5 sm:py-2 max-w-full ${scopePillText}`}>
                            <Ruler className="h-4 w-4 text-[#1877F2] shrink-0" />
                            <span className="break-words">Scope: {project.dimensions}</span>
                          </div>

                          <p className={`mt-2.5 sm:mt-3 ${bodyText}`}>
                            {project.summary}
                          </p>

                          {/* Bullet Highlights */}
                          <ul className="mt-3.5 sm:mt-4 grid grid-cols-1 gap-2 sm:gap-2.5 sm:grid-cols-2">
                            {project.specHighlights.map((spec) => (
                              <li key={spec} className={`flex items-start gap-2 sm:gap-2.5 ${bulletHighlight}`}>
                                <CheckCircle2 className="h-4 w-4 sm:h-4.5 sm:w-4.5 shrink-0 text-[#1877F2] mt-0.5" />
                                <span className="leading-snug">{spec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Action CTAs */}
                        <div className="mt-4 sm:mt-5 border-t border-slate-100 pt-3.5 sm:pt-4 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-3.5">
                          <a
                            href={`${wa}?text=${encodeURIComponent(project.inquiryText)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`justify-center text-center ${ctaButtonWhatsApp}`}
                          >
                            <Phone className="h-4 w-4 shrink-0" /> Inquire on WhatsApp
                          </a>
                          <Link
                            href={`/services#${project.serviceSlug}`}
                            className={`justify-center text-center ${ctaButtonSecondary} px-3 py-2`}
                          >
                            View Service Specs &rarr;
                          </Link>
                        </div>
                      </div>
                    </article>
                  </Fade>
                )
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-2 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-sm border text-xs sm:text-sm font-bold transition ${
                    currentPage === 1
                      ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                      : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>

                <div className="flex flex-wrap items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-9 w-9 sm:h-10 sm:w-10 rounded-sm text-xs sm:text-sm font-bold transition ${
                        currentPage === pageNum
                          ? 'bg-[#1877F2] text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-sm border text-xs sm:text-sm font-bold transition ${
                    currentPage === totalPages
                      ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                      : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          )}
        </section>

        {/* Video Spotlight Section with autoPlay, muted, loop - Full-Width Section */}
        <section className={sectionFullWidthLight}>
          <div className="mx-auto max-w-5xl text-center">
            <p className={eyebrowText}>On-Site Video Spotlight</p>
            <h2 className={`mt-3 ${h2Text}`}>
              On-Site Installation &amp; Rigging in Action
            </h2>
            <p className={`mt-4 ${bodyLead} max-w-2xl mx-auto`}>
              Watch our team assemble heavy steel frameworks, tension high-grade tarpaulin membranes, and rig precision sports nets on site.
            </p>
            <div className="mt-10 aspect-video overflow-hidden rounded-none bg-slate-900 border border-slate-200 shadow-sm w-full">
              <OptimizedVideo
                src="/projects/karachi-grammar-school/karachi-grammar-school-basketball-court-canopy-rigging"
                poster="/projects/karachi-grammar-school/karachi-grammar-school-basketball-court-canopy-rigging-poster.jpg"
                ariaLabel="Tahira Syndicate on-site installation and rigging of covered sports court canopy in Karachi"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-8 flex justify-center">
              <a
                href={`${wa}?text=${encodeURIComponent('Hi Tahira Syndicate, I watched your project videos and would like to request an installation quote.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={ctaButtonWhatsAppLarge}
              >
                <Phone className="h-5 w-5" /> Discuss Your Project on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
    </Chrome>
  )
}

export function ContactPage({
  initialSettings,
  initialProducts,
  initialCategories,
}: {
  initialSettings?: CompanySettings
  initialProducts?: ProductItem[]
  initialCategories?: ProductCategory[]
}) {
  const settings = initialSettings || fallbackSettings
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [material, setMaterial] = useState('')
  const [details, setDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitFeedback, setSubmitFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '')
  const wa = `https://wa.me/${cleanWhatsapp}`

  // Dynamically sync up to 10 popular products from the database
  const quickMaterials = (initialProducts && initialProducts.length > 0)
    ? initialProducts.slice(0, 10).map((p) => p.name)
    : [
        'Polyethylene (PE) Granules 50kg',
        'HDPE Pressure Pipe 110mm PN10',
        'Agricultural Green Shade Net 75%',
        'Heavy-Duty Polypropylene (PP) Rope',
        'uPVC Underground Drainage Pipe',
        'Waterproof Heavy-Duty Tarpaulin',
        'Steel-Wire Suction Hose Pipe',
        'Construction Polythene Dhalai Sheet',
        'Anti-Bird Pigeon Balcony Net',
        'Commercial Polypropylene Strapping',
      ]

  const handleQuickAdd = (item: string) => {
    if (!material) {
      setMaterial(item)
    } else if (!material.includes(item)) {
      setMaterial(`${material}, ${item}`)
    }
  }

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitFeedback(null)

    const res = await submitInquiry({
      name,
      company,
      phone,
      materialNeeded: material,
      details,
    })

    setIsSubmitting(false)

    if (!res.success) {
      setSubmitFeedback({
        type: 'error',
        message: 'Could not record inquiry in CRM database. Opening WhatsApp so you can still send your request directly.',
      })
    } else {
      setSubmitFeedback({
        type: 'success',
        message: 'Inquiry saved successfully! Opening WhatsApp with your pre-filled inquiry.',
      })
    }

    const text = `*New Wholesale Procurement Request - Tahira Syndicate*\n\n` +
      `*Name:* ${name || 'N/A'}\n` +
      `*Company:* ${company || 'N/A'}\n` +
      `*Phone:* ${phone || 'N/A'}\n` +
      `*Material:* ${material || 'N/A'}\n` +
      `*Requirement:* ${details || 'N/A'}`
    window.open(`${wa}?text=${encodeURIComponent(text)}`, '_blank')
  }

  // Google Maps and OpenStreetMap links centered on Tahira Syndicate Shahra-e-Liaquat Road Karachi
  const businessQuery = encodeURIComponent(`${settings.name || 'Tahira Syndicate'}, Shahra-e-Liaquat Road, Karachi`)
  const mapEmbedUrl = `https://maps.google.com/maps?q=${businessQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`
  const googleMapsPinUrl = `https://www.google.com/maps/search/?api=1&query=${businessQuery}`
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${businessQuery}`

  const localFaqs = [
    {
      q: 'What is the minimum order quantity (MOQ) for warehouse pickup?',
      a: 'For polymer raw materials (PE/PP/PVC), single 50kg bags are available for trade clients. For agricultural shade netting and tarpaulins, minimum order is 1 factory roll. For HDPE and uPVC pipes, standard commercial bundles (6-meter lengths) or 50m coils are available with verified weighbridge slips.',
    },
    {
      q: 'Do you arrange truck deliveries across Karachi industrial zones?',
      a: 'Yes. We coordinate dedicated Shahzore, Mazda (3–5T), and heavy flatbeds (20–30T) for same-day delivery to SITE Area, Korangi, North Karachi, Nooriabad, Hub, and Port Qasim.',
    },
    {
      q: 'Can we visit the Shahra-e-Liaquat Road warehouse directly?',
      a: 'Yes. Our main trade counter and warehouse on Shahra-e-Liaquat Road (near Sindh Madressatul Islam and Karachi Chamber of Commerce) is open Monday through Saturday, 10:00 AM to 7:00 PM.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept crossed company cheques, direct online bank transfers (IBFT), pay orders, and cash against warehouse release with official computerized invoices.',
    },
  ]

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WholesaleStore',
        '@id': 'https://tahirasyndicate.com/#store',
        name: settings.name || 'Tahira Syndicate',
        url: 'https://tahirasyndicate.com',
        telephone: settings.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: settings.address,
          addressLocality: 'Karachi',
          addressRegion: 'Sindh',
          postalCode: '74000',
          addressCountry: 'PK',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 24.8584,
          longitude: 67.0099,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '10:00',
            closes: '19:00',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://tahirasyndicate.com/contact/#faq',
        mainEntity: localFaqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
      },
    ],
  }

  return (
    <Chrome settings={settings} categories={initialCategories}>
      {/* 1. Clean, Focused Hero Header */}
      <section className={`mx-auto ${siteContainer} pt-10 sm:pt-16 pb-8 sm:pb-10`}>
        <p className={`mb-2 ${eyebrowText}`}>
          Wholesale Trade Counter &amp; Sourcing
        </p>
        <h1 className={h1Text}>
          Contact Sales &amp; Procurement Desk
        </h1>
        <p className={`mt-3.5 max-w-2xl ${bodyLead}`}>
          Get immediate factory-direct wholesale pricing, verify Shahra-e-Liaquat Road warehouse stock, or request same-day dispatches across Karachi and Pakistan.
        </p>
      </section>

      <main>
        {/* 2. Form (Left) + Contact Details Card (Right) */}
        <section className={`mx-auto ${siteContainer} pb-16 sm:pb-20`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Clean RFQ Form (7 cols) */}
            <div className="lg:col-span-7 rounded-none border border-slate-200 bg-white p-6 sm:p-8 md:p-10 shadow-xs">
              <div className="border-b border-slate-100 pb-5 mb-6">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A]">
                  Request a Wholesale Quotation
                </h2>
                <p className="text-sm sm:text-base text-slate-500 mt-1.5 leading-relaxed">
                  Fill in your requirements below for an immediate itemized proforma response on WhatsApp.
                </p>
              </div>

              {submitFeedback && (
                <div
                  className={`mb-6 p-4 rounded-sm text-xs sm:text-sm font-semibold border ${
                    submitFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {submitFeedback.message}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-5 sm:space-y-6">
                {/* Quick Add Pills */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                    Popular Items (Click to add):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickMaterials.map((item, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleQuickAdd(item)}
                        className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:border-[#1877F2] hover:bg-blue-50 hover:text-[#1877F2] transition"
                      >
                        + {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      aria-label="Your Full Name"
                      className="w-full rounded-sm border border-slate-300 bg-slate-50/70 px-4 py-3 text-sm sm:text-base text-[#0F172A] outline-none focus:bg-white focus:border-[#1877F2] transition shadow-2xs"
                      placeholder="e.g. Tariq Mehmood"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      WhatsApp / Mobile *
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                      aria-label="WhatsApp or Mobile Phone Number"
                      className="w-full rounded-sm border border-slate-300 bg-slate-50/70 px-4 py-3 text-sm sm:text-base text-[#0F172A] outline-none focus:bg-white focus:border-[#1877F2] transition shadow-2xs"
                      placeholder="0321 2043552"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-company" className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Company / Organization
                    </label>
                    <input
                      id="contact-company"
                      name="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      autoComplete="organization"
                      aria-label="Company or Organization Name"
                      className="w-full rounded-sm border border-slate-300 bg-slate-50/70 px-4 py-3 text-sm sm:text-base text-[#0F172A] outline-none focus:bg-white focus:border-[#1877F2] transition shadow-2xs"
                      placeholder="e.g. Industrial Traders"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-material" className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Material / Category *
                    </label>
                    <input
                      id="contact-material"
                      name="material"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      aria-label="Material or Category Needed"
                      className="w-full rounded-sm border border-slate-300 bg-slate-50/70 px-4 py-3 text-sm sm:text-base text-[#0F172A] outline-none focus:bg-white focus:border-[#1877F2] transition shadow-2xs"
                      placeholder="e.g. PE Granules, Shade Net"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-details" className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Quantities, Sizes or Specs
                  </label>
                  <textarea
                    id="contact-details"
                    name="details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={4}
                    aria-label="Quantities, Sizes or Specifications"
                    className="w-full rounded-sm border border-slate-300 bg-slate-50/70 px-4 py-3 text-sm sm:text-base text-[#0F172A] outline-none focus:bg-white focus:border-[#1877F2] transition shadow-2xs"
                    placeholder="Enter estimated quantities (e.g. 100 bags 50kg, 20 rolls shade net 75%)..."
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-label="Send Request on WhatsApp"
                    className={`inline-flex items-center justify-center gap-2.5 rounded-sm bg-[#25D366] px-7 py-3.5 text-sm sm:text-base font-bold text-[#0F172A] shadow-xs transition hover:brightness-105 active:scale-95 w-full sm:w-auto ${
                      isSubmitting ? 'opacity-70 cursor-wait' : ''
                    }`}
                  >
                    <Phone className="h-5 w-5" /> {isSubmitting ? 'Submitting...' : 'Send Request on WhatsApp'}
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Direct Contact & Location Summary Card (5 cols) */}
            <div className="lg:col-span-5 rounded-none border border-slate-200 bg-white p-6 sm:p-8 md:p-9 shadow-xs space-y-7">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1877F2]">Direct Communication</span>
                <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] mt-1">Get in Touch Directly</h3>
              </div>

              {/* Direct Phone */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-blue-50 text-[#1877F2]">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">Direct Trade Hotline</p>
                  <a
                    href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-base sm:text-xl font-black text-[#0F172A] hover:text-[#1877F2] transition mt-0.5 block"
                  >
                    {settings.phone}
                  </a>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-emerald-50 text-emerald-600">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">WhatsApp Desk</p>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base sm:text-xl font-black text-[#0F172A] hover:text-[#25D366] transition mt-0.5 block"
                  >
                    {settings.phone || settings.whatsapp}
                  </a>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-5 py-2.5 text-xs sm:text-sm font-bold text-[#0F172A] shadow-xs hover:brightness-105 transition"
                  >
                    <Phone className="h-4 w-4" /> Chat on WhatsApp
                  </a>
                </div>
              </div>

              {/* Email */}
              {settings.email && (
                <div className="flex items-start gap-4 pt-2 border-t border-slate-100">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-slate-100 text-slate-700">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">Email Inquiries</p>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-sm sm:text-base font-bold text-[#0F172A] hover:text-[#1877F2] transition mt-0.5 block truncate"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Physical Address */}
              <div className="flex items-start gap-4 pt-2 border-t border-slate-100">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-slate-100 text-slate-700">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">Warehouse &amp; Counter</p>
                  <p className="text-sm sm:text-base font-semibold text-[#0F172A] mt-0.5 leading-relaxed">
                    {settings.address}
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4 pt-2 border-t border-slate-100">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-slate-100 text-slate-700">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">Operating Hours</p>
                  <p className="text-sm sm:text-base font-semibold text-[#0F172A] mt-0.5">
                    {settings.hours}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Sunday closed for restocking &amp; container arrivals</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 100% Full-Width Edge-to-Edge Map (Zero Side Gaps) */}
        <section className="w-full pb-16 sm:pb-20">
          <div className="w-full border-y border-slate-200 bg-white">
            {/* Header bar aligned with site container */}
            <div className="bg-slate-50 border-b border-slate-200">
              <div className={`mx-auto ${siteContainer} py-4 sm:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1877F2]">Distribution Hub</span>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] mt-0.5">Warehouse Location &amp; Driving Directions</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-3xl leading-relaxed">{settings.address}</p>
                </div>
                <div className="flex flex-row items-center flex-nowrap gap-3 shrink-0">
                  <a
                    href={googleMapsPinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-sm border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:border-slate-400 shrink-0 shadow-2xs whitespace-nowrap"
                  >
                    <MapPin className="h-4 w-4 text-[#1877F2]" /> Open in Google Maps
                  </a>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#1877F2] px-4 py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-blue-600 shrink-0 shadow-xs whitespace-nowrap"
                  >
                    <Navigation className="h-4 w-4" /> Get Directions <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                  </a>
                </div>
              </div>
            </div>

            {/* Edge-to-Edge Map with zero side margins/padding */}
            <div className="relative h-[500px] sm:h-[600px] md:h-[680px] w-full bg-slate-100">
              <iframe
                title="Tahira Syndicate Shahra-e-Liaquat Road Karachi Warehouse Location Map"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                className="w-full h-full border-0 block"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* 4. Concise Sourcing FAQ Section */}
        <section className={`mx-auto ${siteContainer} pb-20`}>
          <div className="border-t border-slate-200 pt-12">
            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 mb-8 max-w-2xl">
              Common questions on wholesale order sizes, warehouse pickups, and deliveries across Pakistan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {localFaqs.map((faq, i) => (
                <div key={i} className="rounded-none border border-slate-200 bg-slate-50/50 p-5 space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">{faq.q}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. General Customer Review Form (Entry Point 3) */}
        <section className={`mx-auto ${siteContainer} pb-24`}>
          <div className="border-t border-slate-200 pt-12">
            <div className="max-w-2xl mx-auto">
              <ReviewForm
                contextTitle="Leave a General Review / Feedback"
              />
            </div>
          </div>
        </section>

        {/* Structured Data Script */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </main>
    </Chrome>
  )
}
