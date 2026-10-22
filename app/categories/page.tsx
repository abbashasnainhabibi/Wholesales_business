import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Boxes, Phone, Layers, ChevronRight } from 'lucide-react'
import { CategoriesView } from '@/components/categories-view'
import { SiteHeader, SiteFooter } from '@/components/site-navigation'
import { getCompanySettings, getCategories } from '@/lib/api/crm'
import { siteContainer } from '@/lib/typography'

import { buildPageMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildPageMetadata({
  title: 'Wholesale Material Categories',
  description: 'Browse bulk wholesale product categories: Polymer Granules (plastic daana), HDPE & uPVC Pressure Pipes, Agro Shade Nets (hara parda), and Commercial Ropes across Shahra-e-Liaquat Road, Bolton Market, Jodia Bazaar, and SITE Area Karachi.',
  path: '/categories',
})


export default async function CategoriesHubPage() {
  const [settings, categories] = await Promise.all([
    getCompanySettings(),
    getCategories(),
  ])

  const categoriesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Tahira Syndicate Wholesale Product Categories',
    itemListElement: categories.map((cat, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: cat.name,
      url: `https://tahirasyndicate.com/categories/${cat.slug}`,
      description: cat.description,
    })),
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoriesSchema) }}
      />
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
            <li className="font-bold text-[#0F172A]" aria-current="page">Categories</li>
          </ol>
        </nav>

        {/* Search-Enabled Categories View */}
        <CategoriesView categories={categories} settings={settings} />
      </main>
      <SiteFooter settings={settings} categories={categories} />
    </div>
  )
}

