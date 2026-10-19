import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Phone, ShieldCheck, Truck, CheckCircle2, FileText, Download, Building2, Scale, Layers, HelpCircle } from 'lucide-react'
import { SiteHeader, SiteFooter } from '@/components/site-navigation'
import { ProductSpecTabs } from '@/components/product-spec-tabs'
import { ProductGallery } from '@/components/product-gallery'
import { ReviewForm } from '@/components/review-form'
import { ReviewsList } from '@/components/reviews-list'
import { getCompanySettings, getProducts, getCategories, getProductBySlug, getApprovedReviews } from '@/lib/api/crm'

import { resolveMediaUrl } from '@/lib/utils'
import { cleanTitleString, pickImages, trimDescription } from '@/lib/seo'
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
  const product = await getProductBySlug(slug)
  if (!product) {
    return {
      title: 'Product Not Found',
      robots: { index: false, follow: false },
    }
  }

  const rawTitle = (product.metaTitle || product.name).trim()
  const cleanTitle = cleanTitleString(rawTitle)

  const rawDescription =
    product.metaDescription ||
    product.shortDescription ||
    `${product.name} (SKU ${product.sku}) wholesale supply in Karachi. Request a trade quote on WhatsApp.`
  const description = trimDescription(rawDescription, 155)

  const ogTitle = product.ogTitle?.trim() || `${cleanTitle} | Tahira Syndicate`
  const ogDescription = product.ogDescription?.trim() || description
  const imageCandidates = product.ogImage?.trim()
    ? [resolveMediaUrl(product.ogImage.trim())]
    : (product.images || []).map((img) => resolveMediaUrl(img.src))
  const images = pickImages(imageCandidates)
  const productUrl = `https://tahirasyndicate.com/products/${slug}`

  return {
    title: cleanTitle,
    description,
    alternates: { canonical: productUrl },
    openGraph: {
      type: 'website',
      locale: 'en_PK',
      siteName: 'Tahira Syndicate',
      url: productUrl,
      title: ogTitle,
      description: ogDescription,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images,
    },
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) {
    notFound()
  }

  const [settings, categories, liveProducts, reviews] = await Promise.all([
    getCompanySettings(),
    getCategories(),
    getProducts(),
    getApprovedReviews({ productId: product.id }),
  ])

  const category = categories.find(c => c.id === product.categoryId || c.slug === product.category?.slug)
    || product.category
    || categories[0]
    || { id: 0, name: 'Wholesale Materials', slug: '' }
  const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '')
  const wa = `https://wa.me/${cleanWhatsapp}`

  const primaryImage = resolveMediaUrl(product.images?.[0]?.src)
  const primaryAlt = product.images?.[0]?.alt || product.name

  const numericPrice = typeof product.price === 'number'
    ? product.price
    : parseFloat(String(product.price || '').replace(/[^0-9.]/g, '')) || 0

  // Google Product Schema JSON-LD
  const brandName = 'Tahira Syndicate'
  const productSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.map(i => resolveMediaUrl(i.src)) || [primaryImage],
    description: product.metaDescription || product.usage || product.name,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
  }


  // B2B Wholesale Google Product Schema JSON-LD Compliant Offers
  productSchema.offers = {
    '@type': 'Offer',
    url: `https://tahirasyndicate.com/products/${product.slug}`,
    priceCurrency: 'PKR',
    price: numericPrice > 0 ? numericPrice : 0,
    priceValidUntil: '2028-12-31',
    availability: (product.availability === 'In Stock' || product.availability === 'InStock')
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: {
      '@type': 'Organization',
      name: 'Tahira Syndicate',
      url: 'https://tahirasyndicate.com',
    },
  }

  // If approved reviews exist for this product, add aggregateRating & review
  if (reviews && reviews.length > 0) {
    const totalRating = reviews.reduce((acc: number, r) => acc + (r.rating || 5), 0)
    const avgRating = (totalRating / reviews.length).toFixed(1)

    productSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      reviewCount: reviews.length,
      bestRating: '5',
      worstRating: '1',
    }

    productSchema.review = reviews.map((r) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.name || 'Verified Buyer',
      },
      datePublished: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : '2026-01-01',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating || 5,
        bestRating: '5',
        worstRating: '1',
      },
      reviewBody: r.message || 'Excellent wholesale material quality and fast dispatch.',
    }))
  }

  const breadcrumbItems: any[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://tahirasyndicate.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Products',
      item: 'https://tahirasyndicate.com/products',
    },
  ]

  if (category.slug) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: category.name,
      item: `https://tahirasyndicate.com/categories/${category.slug}`,
    })
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 4,
      name: product.name,
      item: `https://tahirasyndicate.com/products/${product.slug}`,
    })
  } else {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: product.name,
      item: `https://tahirasyndicate.com/products/${product.slug}`,
    })
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  }

  const allProducts = liveProducts || []
  const relatedProducts = allProducts
    .filter((p) => p.slug !== product.slug && ((product.categoryId && p.categoryId === product.categoryId) || (category.slug && p.category?.slug === category.slug)))
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SiteHeader settings={settings} categories={categories} />

      <main className="flex-1 pb-24">
        {/* Breadcrumb Hierarchy */}
        <nav aria-label="Breadcrumb" className="bg-slate-50 text-slate-500 text-xs sm:text-sm px-3.5 sm:px-6 md:px-10 py-3 sm:py-3.5 border-b border-slate-200">
          <ol className={`mx-auto ${siteContainer} flex items-center gap-2 flex-wrap`}>
            <li>
              <Link href="/" className="hover:text-slate-900 transition">Home</Link>
            </li>
            <li><ChevronRight className="h-3.5 w-3.5 text-slate-400" /></li>
            <li>
              <Link href="/products" className="hover:text-slate-900 transition">Products</Link>
            </li>
            {category.slug && (
              <>
                <li><ChevronRight className="h-3.5 w-3.5 text-slate-400" /></li>
                <li>
                  <Link href={`/categories/${category.slug}`} className="hover:text-slate-900 transition">{category.name}</Link>
                </li>
              </>
            )}
            <li><ChevronRight className="h-3.5 w-3.5 text-slate-400" /></li>
            <li className="text-[#1877F2] font-bold truncate max-w-xs" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        {/* Product Details Section */}
        <div className={`mx-auto ${siteContainer} pt-8 sm:pt-12`}>
          <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Gallery Column */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-5">
              <ProductGallery images={product.images} productName={product.name} />

              {/* Verified Quality & Weighbridge Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="rounded-none border border-slate-200 bg-slate-50 p-4 flex items-center gap-3.5 shadow-xs">
                  <Scale className="h-6 w-6 text-[#1877F2] shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">100% Certified Scale</p>
                    <p className="text-[11px] sm:text-xs text-slate-500">Gross &amp; tare verified slip</p>
                  </div>
                </div>
                <div className="rounded-none border border-slate-200 bg-slate-50 p-4 flex items-center gap-3.5 shadow-xs">
                  <Truck className="h-6 w-6 text-[#059669] shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">Commercial Fleets</p>
                    <p className="text-[11px] sm:text-xs text-slate-500">Mazda, Shahzore &amp; Flatbed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Information & RFQ Column */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6 sm:space-y-7">
              <div>
                {/* Category & Status Badges */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-3.5">
                  <span className="rounded-sm bg-slate-100 px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-700">
                    Wholesale Direct Supply
                  </span>
                  <span className="rounded-sm bg-slate-100 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700">
                    SKU: {product.sku}
                  </span>
                  {(product.availability === 'In Stock' || product.availability === 'InStock') ? (
                    <span className="rounded-sm bg-emerald-50 px-3 py-1.5 text-xs sm:text-sm font-bold text-emerald-700 flex items-center gap-1.5 border border-emerald-200">
                      <CheckCircle2 className="h-4 w-4" /> Ready in Shahra-e-Liaquat Road Stock
                    </span>
                  ) : (
                    <span className="rounded-sm bg-slate-100 px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-600 flex items-center gap-1.5 border border-slate-200">
                      Out of Stock - ask us for availability
                    </span>
                  )}
                </div>

                <h1 className="font-heading text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight text-[#0F172A] leading-tight">
                  {product.name}
                </h1>

                {/* Regional Trade Aliases / Roman Urdu names */}
                {product.tradeAliases && (
                  <div className="mt-3.5 flex items-center gap-2 flex-wrap text-xs sm:text-sm">
                    <span className="font-black uppercase tracking-wider text-slate-900 shrink-0">
                      Trade Names:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {product.tradeAliases.split('•').map((alias, idx) => (
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

                {/* Primary Wholesale Summary / Short Description */}
                {(product.shortDescription || product.usage || product.metaDescription) && (
                  <p className={`mt-4 sm:mt-5 ${bodyLead}`}>
                    {product.shortDescription || product.usage || product.metaDescription}
                  </p>
                )}

                {/* Detailed Long Description */}
                {product.longDescription && (
                  <div className="mt-5 rounded-none border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                    <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 mb-2">
                      Detailed Overview
                    </h2>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                      {product.longDescription}
                    </p>
                  </div>
                )}

                {/* Dynamic Attributes Grid if available */}
                {product.attributeValues && product.attributeValues.length > 0 && (
                  <div className="mt-6 rounded-none border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 mb-3.5">
                      Technical Specifications &amp; Sizing:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.attributeValues.map((av, idx) => (
                        <div key={idx} className="rounded-none bg-white p-3.5 border border-slate-200 shadow-2xs">
                          <span className="text-[11px] sm:text-xs uppercase font-bold text-slate-500 tracking-wider block mb-1">
                            {av.attribute?.name || 'Specification'}
                          </span>
                          <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug break-words">
                            {av.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Commercial B2B Order Card */}
                <div className="mt-6 sm:mt-8 rounded-none border-2 border-slate-200 bg-white p-5 sm:p-7 space-y-5 shadow-xs">
                  <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <span className={specLabel}>Wholesale Pricing</span>
                      <div className="mt-1">
                        <span className="text-2xl sm:text-3xl font-black text-[#1877F2]">
                          Trade Price on Request
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-slate-500 block mt-0.5">
                          Direct factory rates confirmed on WhatsApp proforma
                        </span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className={specLabel}>Minimum Order</span>
                      <p className="text-base sm:text-lg font-black text-[#1877F2] mt-0.5">{product.moq || 5} Units / Rolls</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed text-slate-500">
                    * Bulk volume discounts apply for truckload orders. Live daily rates confirmed on WhatsApp proforma based on current commodity index.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2">
                    <a
                      href={`${wa}?text=${encodeURIComponent(`Hi Tahira Syndicate, I want to book an order / get live wholesale quotation for: ${product.name} (SKU: ${product.sku}).`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-sm bg-[#25D366] px-4 py-3 sm:py-3.5 text-xs sm:text-sm md:text-base font-bold text-[#0F172A] shadow-xs transition hover:brightness-105 active:scale-95 text-center leading-snug"
                    >
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                      <span>WhatsApp Instant RFQ</span>
                    </a>

                    <Link
                      href="/contact"
                      className="flex items-center justify-center gap-2 rounded-sm bg-[#1877F2] px-4 py-3 sm:py-3.5 text-xs sm:text-sm md:text-base font-bold text-white shadow-xs transition hover:bg-blue-600 active:scale-95 text-center leading-snug"
                    >
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                      <span>Request Official Proforma</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Technical Specifications Tabs */}
          <div className="mt-14 sm:mt-18">
            <ProductSpecTabs product={product} />
          </div>

          {/* Customer Reviews & Feedback Section */}
          <section className="mt-18 sm:mt-24 border-t border-slate-200 pt-12 sm:pt-16">
            <div className="mb-8">
              <p className={eyebrowText}>Verified Feedback</p>
              <h2 className={h2Text}>Customer Reviews for {product.name}</h2>
              <p className={`mt-2 ${bodyText}`}>
                Read authentic ratings from commercial contractors, procurement managers, and wholesale partners across Pakistan.
              </p>
            </div>

            <div className="space-y-12">
              {/* Published reviews */}
              <ReviewsList
                reviews={reviews}
                title={`${product.name} Reviews`}
                emptyMessage={`No customer reviews published yet for ${product.name}. Be the first to share your experience!`}
              />

              {/* Review Submission Form (Auto-linked to productId) */}
              <div className="pt-6">
                <ReviewForm
                  productId={product.id}
                  contextTitle={`Write a review for ${product.name}`}
                />
              </div>
            </div>
          </section>

          {/* Related Category Materials */}
          {relatedProducts.length > 0 && (
            <section className="mt-18 sm:mt-24 border-t border-slate-200 pt-12 sm:pt-16">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <p className={eyebrowText}>Complementary Supply</p>
                  <h2 className={h2Text}>Related Materials {category.name ? `in ${category.name}` : ''}</h2>
                </div>
                <Link href={category.slug ? `/categories/${category.slug}` : '/categories'} className="inline-flex items-center gap-1 text-xs sm:text-base font-bold text-[#1877F2] hover:underline pb-1">
                  View All Category Materials &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((rel) => {
                  const relImg = resolveMediaUrl(rel.images?.[0]?.src)
                  return (
                    <article key={rel.id} className="group rounded-none border border-slate-200 bg-white p-5 sm:p-6 hover:border-slate-400 transition flex flex-col justify-between shadow-xs">
                      <div>
                        <Link
                          href={`/products/${rel.slug}`}
                          className="relative block h-48 sm:h-52 w-full overflow-hidden rounded-none bg-slate-100 mb-4 focus:outline-none"
                          aria-label={`View ${rel.name}`}
                        >
                          <Image
                            src={relImg}
                            alt={rel.images?.[0]?.alt || rel.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        </Link>
                        <div>
                          <h3 className="font-heading text-base sm:text-lg font-black text-[#0F172A] group-hover:text-[#1877F2] transition line-clamp-2 leading-snug">
                            <Link href={`/products/${rel.slug}`}>{rel.name}</Link>
                          </h3>
                          <p className={`mt-2 ${bodyText} line-clamp-2`}>{rel.usage || rel.metaDescription}</p>
                        </div>
                      </div>


                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-[#1877F2]">
                          Trade Price on Request
                        </span>
                        <Link href={`/products/${rel.slug}`} className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#1877F2] hover:underline">
                          View Specs &rarr;
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

