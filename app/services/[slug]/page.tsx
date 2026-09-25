import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ChevronRight,
  Phone,
  ShieldCheck,
  Truck,
  CheckCircle2,
  FileText,
  Building2,
  Scale,
  Layers,
  Wrench,
  Clock,
  MapPin,
  HelpCircle,
  ArrowRight,
} from 'lucide-react'
import { SiteHeader, SiteFooter } from '@/components/site-navigation'
import { ServiceGallery } from '@/components/service-gallery'
import { ServiceFaqAccordion } from '@/components/service-faq-accordion'
import { ReviewForm } from '@/components/review-form'
import { ReviewsList } from '@/components/reviews-list'
import { getCompanySettings, getCategories, getApprovedReviews, getProducts } from '@/lib/api/crm'
import { resolveMediaUrl } from '@/lib/utils'
import type { ProductItem } from '@/lib/types/crm'
import {
  getServices,
  getServiceBySlug,
  getRelatedServices,
  type InstallationService,
} from '@/lib/data/services'
import {
  siteContainer,
  siteContainerWide,
  eyebrowText,
  h1Text,
  h2Text,
  h3CardTitle,
  h3SubTitle,
  bodyLead,
  bodyText,
  bulletHighlight,
  specLabel,
  specValue,
  ctaButtonWhatsApp,
  ctaButtonWhatsAppLarge,
  ctaButtonPrimary,
  ctaButtonSecondary,
} from '@/lib/typography'

export async function generateStaticParams() {
  const services = getServices()
  return services.map((service) => ({
    slug: service.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    return { title: 'Service Not Found | Tahira Syndicate Karachi' }
  }

  const primaryImage = service.images?.[0]?.poster || service.images?.[0]?.src || ''

  return {
    title: `${service.title} Shahra-e-Liaquat Road Karachi | Tahira Syndicate`,
    description: `${service.description} Direct factory manufacturing and professional site installation in Shahra-e-Liaquat Road, Bolton Market, SITE Area & Karachi.`,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title: `${service.title} | Tahira Syndicate Karachi`,
      description: service.description,
      url: `https://tahirasyndicate.com/services/${slug}`,
      images: primaryImage ? [primaryImage] : undefined,
      type: 'website',
      siteName: 'Tahira Syndicate',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.title} | Tahira Syndicate Karachi`,
      description: service.description,
      images: primaryImage ? [primaryImage] : undefined,
    },
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) {
    notFound()
  }

  const [settings, categories, reviews, allProducts] = await Promise.all([
    getCompanySettings(),
    getCategories(),
    getApprovedReviews({ serviceId: service.id }),
    getProducts(),
  ])

  // Map service slug to related category slugs/keywords to show direct product internal links
  const serviceCategoryMap: Record<string, string[]> = {
    'shade-nets': ['nets-tarpaulins', 'shade', 'net'],
    'bird-nets': ['nets-tarpaulins', 'bird', 'balcony', 'pigeon', 'net'],
    'safety-nets': ['nets-tarpaulins', 'safety', 'construction', 'fall', 'net'],
    'sport-nets': ['nets-tarpaulins', 'sport', 'cricket', 'futsal', 'net'],
    'polythene-manufacturing': ['polythene-sheeting', 'polythene', 'dhalai', 'chhat', 'plastic', 'sheet'],
    'tarpaulin-canopy': ['nets-tarpaulins', 'tarpaulin', 'canvas', 'sheet', 'tarpal'],
  }

  const keywords = serviceCategoryMap[service.slug] || [service.slug]
  const relatedProducts: ProductItem[] = allProducts.filter((p: ProductItem) => {
    const catSlug = p.category?.slug || ''
    const pName = p.name.toLowerCase()
    return keywords.some((kw) => catSlug.includes(kw) || pName.includes(kw))
  }).slice(0, 4)

  const relatedServices = getRelatedServices(service.slug, 3)
  const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '')
  const wa = `https://wa.me/${cleanWhatsapp}`

  const primaryImage = service.images?.[0]?.poster || service.images?.[0]?.src || ''

  // Schema.org Service JSON-LD
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    serviceType: service.eyebrow,
    alternateName: service.tradeAlias.split('•').map((s) => s.trim()),
    description: service.longDescription || service.description,
    provider: {
      '@type': ['WholesaleStore', 'LocalBusiness', 'Manufacturer'],
      name: settings.name || 'Tahira Syndicate',
      telephone: settings.phone,
      url: 'https://tahirasyndicate.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.address,
        addressLocality: 'Karachi',
        postalCode: '74000',
        addressCountry: 'PK',
      },
    },
    areaServed: [
      { '@type': 'Place', name: 'Shahra-e-Liaquat Road' },
      { '@type': 'Place', name: 'Bolton Market' },
      { '@type': 'Place', name: 'Jodia Bazaar' },
      { '@type': 'Place', name: 'SITE Industrial Area' },
      { '@type': 'City', name: 'Karachi' },
      { '@type': 'AdministrativeArea', name: 'Sindh' },
      { '@type': 'Country', name: 'Pakistan' },
    ],
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PKR',
      availability: 'https://schema.org/InStock',
      url: `https://tahirasyndicate.com/services/${service.slug}`,
    },
  }

  // Schema.org BreadcrumbList JSON-LD
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://tahirasyndicate.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services & Installation',
        item: 'https://tahirasyndicate.com/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.title,
        item: `https://tahirasyndicate.com/services/${service.slug}`,
      },
    ],
  }

  // Schema.org FAQPage JSON-LD
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {service.faqs && service.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <SiteHeader settings={settings} categories={categories} />

      <main className="flex-1 pb-24">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="bg-slate-50 text-slate-500 text-xs sm:text-sm px-3.5 sm:px-6 md:px-10 py-3 sm:py-3.5 border-b border-slate-200"
        >
          <ol className={`mx-auto ${siteContainer} flex items-center gap-2 flex-wrap`}>
            <li>
              <Link href="/" className="hover:text-slate-900 transition">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </li>
            <li>
              <Link href="/services" className="hover:text-slate-900 transition">
                Services &amp; Installation
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </li>
            <li className="text-[#1877F2] font-bold truncate max-w-xs" aria-current="page">
              {service.title}
            </li>
          </ol>
        </nav>

        {/* Main Service Presentation Grid */}
        <div className={`mx-auto ${siteContainer} pt-8 sm:pt-12`}>
          <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Visual Media Gallery */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-5">
              <ServiceGallery media={service.images} serviceTitle={service.title} />

              {/* Verified Quality & Dispatch Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="rounded-none border border-slate-200 bg-slate-50 p-4 flex items-center gap-3.5 shadow-xs">
                  <Wrench className="h-6 w-6 text-[#1877F2] shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">Experienced Riggers</p>
                    <p className="text-[11px] sm:text-xs text-slate-500">Hands-on site crew across Karachi</p>
                  </div>
                </div>
                <div className="rounded-none border border-slate-200 bg-slate-50 p-4 flex items-center gap-3.5 shadow-xs">
                  <Truck className="h-6 w-6 text-[#059669] shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">Direct Warehouse Dispatch</p>
                    <p className="text-[11px] sm:text-xs text-slate-500">Shahra-e-Liaquat counter &amp; SITE warehouse</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Information & RFQ */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6 sm:space-y-7">
              <div>
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-3.5">
                  <span className="rounded-sm bg-slate-100 px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-700">
                    {service.eyebrow}
                  </span>
                  <span className="rounded-sm bg-emerald-50 px-3 py-1.5 text-xs sm:text-sm font-bold text-emerald-700 flex items-center gap-1.5 border border-emerald-200">
                    <CheckCircle2 className="h-4 w-4" /> Ready for Supply &amp; Rigging
                  </span>
                </div>

                <h1 className="font-heading text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight text-[#0F172A] leading-tight">
                  {service.title}
                </h1>

                {/* Trade Names Pill */}
                {service.tradeAlias && (
                  <div className="mt-3.5 flex items-center gap-2 flex-wrap text-xs sm:text-sm">
                    <span className="font-black uppercase tracking-wider text-slate-900 shrink-0">
                      Trade Names:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {service.tradeAlias.split('•').map((alias, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-sm bg-slate-100 px-2.5 py-1 text-xs sm:text-sm font-bold text-slate-900 border border-slate-300 shadow-2xs"
                        >
                          {alias.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lead Overview */}
                <p className={`mt-4 sm:mt-5 ${bodyLead}`}>
                  {service.longDescription || service.description}
                </p>

                {/* Bullet Highlights */}
                <div className="mt-5 rounded-none border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
                  <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 mb-3">
                    Key Highlights &amp; Specs:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className={`flex items-start gap-2 ${bulletHighlight}`}>
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#1877F2] mt-0.5" />
                        <span className="leading-snug">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Commercial B2B Order Card */}
                <div className="mt-6 sm:mt-8 rounded-none border-2 border-slate-200 bg-white p-5 sm:p-7 space-y-5 shadow-xs">
                  <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <span className={specLabel}>Trade Quote &amp; Survey</span>
                      <div className="mt-1">
                        <a
                          href={`${wa}?text=${encodeURIComponent(service.inquiryText)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xl sm:text-2xl font-black text-[#1877F2] hover:underline"
                        >
                          Request Custom Quotation &rarr;
                        </a>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className={specLabel}>Turnaround Time</span>
                      <p className="text-sm sm:text-base font-black text-[#0F172A] mt-0.5">
                        24 – 48 Hours Dispatch
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed text-slate-500">
                    * Bulk roll contractor discounts and turnkey installation rigging rates available. Fast measurement and quote confirmation on WhatsApp.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <a
                      href={`${wa}?text=${encodeURIComponent(service.inquiryText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full justify-center ${ctaButtonWhatsAppLarge}`}
                    >
                      <Phone className="h-5 w-5" /> WhatsApp Instant RFQ
                    </a>

                    <Link
                      href="/contact"
                      className={`w-full justify-center ${ctaButtonPrimary}`}
                    >
                      <FileText className="h-5 w-5" /> Request Site Inspection
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Section: Technical Engineering Specifications Table */}
          <section className="mt-14 sm:mt-20 border-t border-slate-200 pt-12 sm:pt-16">
            <div className="max-w-3xl mb-8">
              <p className={eyebrowText}>Material Standards</p>
              <h2 className={h2Text}>Technical Specifications &amp; Material Data</h2>
              <p className={`mt-2 ${bodyText}`}>
                Polymer grade, mesh sizes, weight, and hardware details for {service.title}.
              </p>
            </div>

            <div className="rounded-none border border-slate-200 bg-white overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="py-3.5 px-4 sm:px-6 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 w-1/3">
                        Technical Parameter
                      </th>
                      <th className="py-3.5 px-4 sm:px-6 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700">
                        Specification &amp; Grade Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {service.specs.map((spec, idx) => (
                      <tr key={spec.label} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-700 align-top">
                          {spec.label}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-slate-900 font-medium">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section: Key Real-World Industrial & Commercial Applications */}
          {service.applications && service.applications.length > 0 && (
            <section className="mt-16 sm:mt-20 border-t border-slate-200 pt-12 sm:pt-16">
              <div className="max-w-3xl mb-8">
                <p className={eyebrowText}>Where It Is Used</p>
                <h2 className={h2Text}>Common Uses on Job Sites</h2>
                <p className={`mt-2 ${bodyText}`}>
                  Everyday uses for our {service.title.toLowerCase()} across construction sites, factories, and farms.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {service.applications.map((app, idx) => (
                  <div
                    key={idx}
                    className="rounded-none border border-slate-200 bg-white p-5 sm:p-6 shadow-xs hover:border-slate-400 transition"
                  >
                    <div className="h-8 w-8 rounded-sm bg-blue-50 text-[#1877F2] font-black text-sm flex items-center justify-center mb-3">
                      0{idx + 1}
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-[#0F172A] leading-snug">
                      {app.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {app.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Standard Installation & Rigging Process */}
          {service.processSteps && service.processSteps.length > 0 && (
            <section className="mt-16 sm:mt-20 border-t border-slate-200 pt-12 sm:pt-16">
              <div className="max-w-3xl mb-8">
                <p className={eyebrowText}>How We Work</p>
                <h2 className={h2Text}>Manufacturing &amp; Installation Steps</h2>
                <p className={`mt-2 ${bodyText}`}>
                  Our 4-step workflow from initial site survey to final tension check and handover.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {service.processSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="rounded-none border border-slate-200 bg-slate-50 p-5 sm:p-6 shadow-xs"
                  >
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#1877F2] block mb-1">
                      Step 0{idx + 1}
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-[#0F172A] leading-snug">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Frequently Asked Questions (FAQ) */}
          {service.faqs && service.faqs.length > 0 && (
            <section className="mt-16 sm:mt-20 border-t border-slate-200 pt-12 sm:pt-16">
              <div className="max-w-3xl mb-8">
                <p className={eyebrowText}>Direct Answers</p>
                <h2 className={h2Text}>Frequently Asked Questions</h2>
                <p className={`mt-2 ${bodyText}`}>
                  Clear answers about mesh sizes, gauges, delivery timelines, and installation details.
                </p>
              </div>

              <ServiceFaqAccordion faqs={service.faqs} serviceTitle={service.title} />
            </section>
          )}

          {/* Section: Customer Reviews & Ratings */}
          <section className="mt-16 sm:mt-20 border-t border-slate-200 pt-12 sm:pt-16">
            <div className="max-w-3xl mb-8">
              <p className={eyebrowText}>Verified Feedback</p>
              <h2 className={h2Text}>Customer Reviews for {service.title}</h2>
              <p className={`mt-2 ${bodyText}`}>
                Feedback from contractors, builders, and school administrators who use our supply and installation services.
              </p>
            </div>

            <div className="space-y-12">
              <ReviewsList
                reviews={reviews}
                title={`${service.title} Reviews`}
                emptyMessage={`No client reviews published yet for ${service.title}. Have you worked with our team on this service? Leave a review below!`}
              />

              <div className="pt-6">
                <ReviewForm
                  serviceId={service.id}
                  contextTitle={`Review our ${service.title} service`}
                />
              </div>
            </div>
          </section>

          {/* Section: Related Wholesale Products Catalog (SEO Internal Linking to Products) */}
          {relatedProducts.length > 0 && (
            <section className="mt-16 sm:mt-20 border-t border-slate-200 pt-12 sm:pt-16">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <p className={eyebrowText}>Direct Factory Inventory</p>
                  <h2 className={h2Text}>Related Wholesale Materials &amp; Products</h2>
                  <p className={`mt-2 ${bodyText}`}>
                    Browse wholesale materials in stock at our Shahra-e-Liaquat Road counter for immediate pickup or delivery.
                  </p>
                </div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1 text-xs sm:text-base font-bold text-[#1877F2] hover:underline pb-1 shrink-0"
                >
                  Browse Full Catalog &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedProducts.map((prod: ProductItem) => {
                  const prodImg = prod.images?.[0]?.src
                    ? resolveMediaUrl(prod.images[0].src)
                    : resolveMediaUrl(null)
                  return (
                    <article
                      key={prod.id}
                      className="group rounded-none border border-slate-200 bg-white p-4 hover:border-slate-400 transition flex flex-col justify-between shadow-xs"
                    >
                      <div>
                        <div className="relative h-40 w-full overflow-hidden bg-slate-100 mb-3">
                          <Image
                            src={prodImg}
                            alt={prod.images?.[0]?.alt || prod.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-2 left-2 rounded-xs bg-[#0F172A]/90 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                            {prod.category?.name || 'Wholesale'}
                          </div>
                        </div>
                        <h3 className="text-sm font-black text-[#0F172A] group-hover:text-[#1877F2] transition line-clamp-2 leading-snug">
                          <Link href={`/products/${prod.slug}`}>{prod.name}</Link>
                        </h3>
                        {prod.usage && (
                          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {prod.usage}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#059669]">
                          Trade Rate Available
                        </span>
                        <Link
                          href={`/products/${prod.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#1877F2] hover:underline"
                        >
                          View Specs &rarr;
                        </Link>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          )}

          {/* Section: Related Services */}
          {relatedServices.length > 0 && (
            <section className="mt-18 sm:mt-24 border-t border-slate-200 pt-12 sm:pt-16">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <p className={eyebrowText}>Complementary Capabilities</p>
                  <h2 className={h2Text}>Explore Other Services &amp; Installations</h2>
                </div>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1 text-xs sm:text-base font-bold text-[#1877F2] hover:underline pb-1"
                >
                  View All Services &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedServices.map((rel) => {
                  const relMedia = rel.images?.[0]
                  const relThumb = relMedia?.poster || relMedia?.src || ''
                  return (
                    <article
                      key={rel.id}
                      className="group rounded-none border border-slate-200 bg-white p-5 sm:p-6 hover:border-slate-400 transition flex flex-col justify-between shadow-xs"
                    >
                      <div>
                        <div className="relative h-48 sm:h-52 w-full overflow-hidden rounded-none bg-slate-100 mb-4">
                          {relThumb && (
                            <Image
                              src={relThumb}
                              alt={relMedia?.alt || rel.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition duration-500 group-hover:scale-105"
                            />
                          )}
                          <div className="absolute bottom-2.5 left-2.5 rounded-sm bg-[#0F172A]/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                            {rel.eyebrow}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-black text-[#0F172A] group-hover:text-[#1877F2] transition line-clamp-2 leading-snug">
                            <Link href={`/services/${rel.slug}`}>{rel.title}</Link>
                          </h3>
                          <p className={`mt-2 ${bodyText} line-clamp-2`}>
                            {rel.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">
                          Karachi Supply &amp; Rigging
                        </span>
                        <Link
                          href={`/services/${rel.slug}`}
                          className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#1877F2] hover:underline"
                        >
                          View Details &rarr;
                        </Link>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      </main>

      <SiteFooter settings={settings} categories={categories} />
    </div>
  )
}
