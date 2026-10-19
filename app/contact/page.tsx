import type { Metadata } from 'next'
import { ContactPage } from '@/components/site-pages'
import { getCompanySettings, getProducts, getCategories } from '@/lib/api/crm'

import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Contact & Get a Wholesale Quote',
  description:
    'Get factory-direct trade rates for PE/PP polymers, HDPE pipes, agro shade nets & packaging. Visit our Shahra-e-Liaquat Road warehouse or request same-day dispatch.',
  path: '/contact',
})

export default async function Page() {
  const [settings, products, categories] = await Promise.all([
    getCompanySettings(),
    getProducts(),
    getCategories(),
  ])
  return <ContactPage initialSettings={settings} initialProducts={products} initialCategories={categories} />
}
