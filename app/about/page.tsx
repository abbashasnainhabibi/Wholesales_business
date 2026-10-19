import type { Metadata } from 'next'
import { AboutPage } from '@/components/site-pages'
import { getCompanySettings, getCategories } from '@/lib/api/crm'

import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'About Us – Rope & Net Maker, Karachi',
  description:
    'Tahira Syndicate started in Shahra-e-Liaquat Road and Bolton Market trade corridors as a wholesale trading counter and grew into a direct manufacturer of rope (jahazi rassa), nets (hara parda), and packaging products with wholesale distribution across Karachi.',
  path: '/about',
})

export default async function Page() {
  const [settings, categories] = await Promise.all([
    getCompanySettings(),
    getCategories(),
  ])
  return <AboutPage initialSettings={settings} initialCategories={categories} />
}

