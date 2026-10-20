import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, HelpCircle, Phone, Boxes, ShieldCheck, ArrowRight } from 'lucide-react'
import { SiteHeader, SiteFooter } from '@/components/site-navigation'
import { CatalogView } from '@/components/catalog-view'
import { getCompanySettings, getProducts, getCategories, getCategoryBySlug } from '@/lib/api/crm'
import { buildPageMetadata, cleanTitleString } from '@/lib/seo'
import { resolveMediaUrl } from '@/lib/utils'
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) {
    return {
      title: 'Category Not Found',
      robots: { index: false, follow: false },
      alternates: { canonical: null },
    }
  }

  const title = category.metaTitle
    ? cleanTitleString(category.metaTitle)
    : `${category.name} Wholesale Karachi`
  const description =
    category.metaDescription ||
    category.description ||
    `Buy wholesale ${category.name} in bulk at factory direct rates from Tahira Syndicate Shahra-e-Liaquat Road, Bolton Market, Jodia Bazaar & SITE Area Karachi.`
  const image = category.image ? resolveMediaUrl(category.image) : undefined

  return buildPageMetadata({
    title,
    description,
    path: `/categories/${slug}`,
    image,
  })
}

export default async function CategorySiloPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [settings, categories, category, liveProducts] = await Promise.all([
    getCompanySettings(),
    getCategories(),
    getCategoryBySlug(slug),
    getProducts({ categorySlug: slug }),
  ])

  if (!category) {
    notFound()
  }

  const categoryProducts = liveProducts || []

  const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '')
  const wa = `https://wa.me/${cleanWhatsapp}`

  const faqList = [
    {
      q: `Can Tahira Syndicate supply ${category.name} in 50kg bags and full truckload orders?`,
      a: `Yes, we maintain regular bulk inventory at our Shahra-e-Liaquat Road warehouse. Whether you need an initial trial batch of 5-10 bags/rolls or multi-ton commercial flatbed truckloads, we arrange direct dispatch with certified weighbridge slips.`,
    },
    {
      q: `Where can we collect ${category.name} orders in Karachi?`,
      a: `Self-pickup is available directly from our main Shahra-e-Liaquat Road distribution shop (near Sindh Madarsa-tul-Islam / KCCI) and SITE industrial yard. We also coordinate Mazda (3-5T) and flatbed trailer deliveries across Karachi, Nooriabad, Hub, and interior Sindh.`,
    },
    {
      q: `How do we get current trade rates or commercial proforma invoices?`,
      a: `Because polymer raw material and extrusion prices follow daily commodity index rates, we share live price lists on WhatsApp. Message us at ${settings.phone || settings.whatsapp} with your required quantity for instant wholesale quotes.`,
    },
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  }

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
        name: 'Categories',
        item: 'https://tahirasyndicate.com/categories',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `https://tahirasyndicate.com/categories/${slug}`,
      },
    ],
  }

  const productListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} Products - Tahira Syndicate Karachi`,
    itemListElement: categoryProducts.map((prod: any, idx: number) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: prod.name,
      url: `https://tahirasyndicate.com/products/${prod.slug}`,
      description: prod.usage || prod.metaDescription,
    })),
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {categoryProducts.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productListSchema) }}
        />
      )}
      <SiteHeader settings={settings} categories={categories} />

      <main className="flex-1 pb-24">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className={`mx-auto ${siteContainer} pt-6`}>
          <ol className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500">
            <li>
              <Link href="/" className="hover:text-[#1877F2] transition">Home</Link>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </li>
            <li>
              <Link href="/categories" className="hover:text-[#1877F2] transition">Categories</Link>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </li>
            <li className="font-bold text-[#0F172A]" aria-current="page">{category.name}</li>
          </ol>
        </nav>

        {/* Silo Hero */}
        <section className={`mx-auto ${siteContainer} pt-8 pb-10`}>
          <div className="flex flex-wrap items-center gap-2 mb-3.5">
            <span className={`rounded-sm bg-blue-50 px-3 py-1 ${eyebrowText}`}>
              Wholesale Silo
            </span>
            <span className="rounded-sm bg-slate-100 px-3 py-1 text-xs sm:text-sm font-bold text-slate-700">
              Shahra-e-Liaquat Road Warehouse Stock
            </span>
          </div>

          <h1 className={h1Text}>
            {category.name} in Karachi
          </h1>
          <p className={`mt-4 max-w-3xl ${bodyLead}`}>
            {category.description}
          </p>
        </section>

        {/* Filterable Product Grid */}
        <section className={`mx-auto ${siteContainer}`}>
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <h2 className={h2Text}>
              Available Products &amp; Specifications ({categoryProducts.length})
            </h2>
            <Link href="/products" className="inline-flex items-center gap-1 text-xs sm:text-base font-bold text-[#1877F2] hover:underline pb-1">
              View All Materials &rarr;
            </Link>
          </div>

          <CatalogView initialProducts={categoryProducts} initialCategories={categories} categorySlug={slug} showHero={false} />
        </section>

        {/* Local Wholesale Sourcing FAQs */}
        <section className={`mx-auto ${siteContainer} pt-16 sm:pt-20`}>
          <div className={`flex items-center gap-2 mb-2 ${eyebrowText}`}>
            <HelpCircle className="h-4 w-4" /> Sourcing Guidelines &amp; FAQs
          </div>
          <h2 className={h2Text}>
            Procurement Questions for {category.name}
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {faqList.map((faq, i) => (
              <div key={i} className="rounded-none border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
                <h3 className={`leading-snug ${h3SubTitle}`}>{faq.q}</h3>
                <p className={`mt-3 ${bodyText}`}>{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-none border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div>
              <p className="font-bold text-base sm:text-lg text-[#0F172A]">Need custom sizes, heavy tonnage, or formal GST proforma?</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Direct trade hotline active Mon–Sat (10:00 AM – 7:00 PM).</p>
            </div>
            <a
              href={`${wa}?text=${encodeURIComponent(`Hi Tahira Syndicate, I have a bulk procurement inquiry regarding: ${category.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`shrink-0 ${ctaButtonWhatsAppLarge}`}
            >
              <Phone className="h-4.5 w-4.5" /> Inquire on WhatsApp
            </a>
          </div>
        </section>
      </main>

      <SiteFooter settings={settings} categories={categories} />
    </div>
  )
}

