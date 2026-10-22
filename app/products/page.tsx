import type { Metadata } from 'next'
import { SiteHeader, SiteFooter } from '@/components/site-navigation'
import { CatalogView } from '@/components/catalog-view'
import { getCompanySettings, getProducts, getCategories } from '@/lib/api/crm'

import { buildPageMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildPageMetadata({
  title: 'Wholesale Product Catalog, Karachi',
  description:
    'Explore the complete wholesale catalog of polymer raw materials (plastic daana), HDPE & uPVC pressure pipes, agro shade nets (hara parda), and commercial ropes (jahazi rassa) in Shahra-e-Liaquat Road, Bolton Market, Jodia Bazaar & SITE Area Karachi.',
  path: '/products',
})

export default async function ProductsPage() {
  const [settings, liveProducts, categories] = await Promise.all([
    getCompanySettings(),
    getProducts(),
    getCategories(),
  ])

  const products = liveProducts || []

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <SiteHeader settings={settings} categories={categories} />
      <main className="flex-1">
        <CatalogView initialProducts={products} initialCategories={categories} initialSettings={settings} />
      </main>
      <SiteFooter settings={settings} categories={categories} />
    </div>
  )
}
