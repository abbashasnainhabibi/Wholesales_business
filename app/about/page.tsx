import type { Metadata } from 'next'
import { AboutPage } from '@/components/site-pages'
import { getCompanySettings, getCategories } from '@/lib/api/crm'

export const metadata: Metadata = {
  title: 'About Tahira Syndicate | Rope & Net Manufacturer Shahra-e-Liaquat Road Karachi',
  description: 'Tahira Syndicate started in Shahra-e-Liaquat Road and Bolton Market trade corridors as a wholesale trading counter and grew into a direct manufacturer of rope (jahazi rassa), nets (hara parda), and packaging products with wholesale distribution across Karachi.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Tahira Syndicate | Rope & Net Manufacturer Shahra-e-Liaquat Road Karachi',
    description: 'Shahra-e-Liaquat Road and Bolton Market trading roots to direct manufacturing facility in Karachi. Supplying rope, nets, polymer granules, pipes, and packaging materials.',
    type: 'website',
  },
}

export default async function Page() {
  const [settings, categories] = await Promise.all([
    getCompanySettings(),
    getCategories(),
  ])
  return <AboutPage initialSettings={settings} initialCategories={categories} />
}

