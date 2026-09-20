import type { Metadata } from 'next'
import { SiteHeader, SiteFooter } from '@/components/site-navigation'
import { CatalogView } from '@/components/catalog-view'
import { getCompanySettings, getProducts, getCategories } from '@/lib/api/crm'

export const metadata: Metadata = {
  title: 'All Products & Materials Wholesale Catalog Shahra-e-Liaquat Road Karachi | Tahira Syndicate',
  description: 'Explore the complete wholesale catalog of polymer raw materials (plastic daana), HDPE & uPVC pressure pipes, agro shade nets (hara parda), and commercial ropes (jahazi rassa) in Shahra-e-Liaquat Road, Bolton Market, Jodia Bazaar & SITE Area Karachi.',
  alternates: { canonical: '/products' },
  openGraph: {
    title: 'All Products & Materials Wholesale Catalog | Tahira Syndicate Shahra-e-Liaquat Road Karachi',
    description: 'Wholesale and factory-direct industrial catalog with instant WhatsApp quotes and warehouse dispatch from Shahra-e-Liaquat Road & Bolton Market trade corridors.',
    url: 'https://tahirasyndicate.com/products',
    type: 'website',
    siteName: 'Tahira Syndicate',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wholesale Products Catalog Shahra-e-Liaquat Road Karachi | Tahira Syndicate',
    description: 'Bulk plastic polymers, pipes, agro shade nets, and packaging materials factory direct from Shahra-e-Liaquat Road & SITE Area Karachi.',
  },
}

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
