import type { Metadata } from 'next'
import { ContactPage } from '@/components/site-pages'
import { getCompanySettings, getProducts, getCategories } from '@/lib/api/crm'

export const metadata: Metadata = {
  title: 'Contact Wholesale Sales Desk | Tahira Syndicate Shahra-e-Liaquat Road Karachi',
  description: 'Get factory-direct trade rates for PE/PP polymers, HDPE pipes, agro shade nets & packaging. Visit our Shahra-e-Liaquat Road warehouse or request same-day dispatch.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Wholesale Sales Desk | Tahira Syndicate Karachi',
    description: 'Direct factory supplier of polymer granules, pressure pipes, and agro nets in Shahra-e-Liaquat Road & SITE Area, Karachi.',
    url: 'https://tahirasyndicate.com/contact',
    type: 'website',
  },
}

export default async function Page() {
  const [settings, products, categories] = await Promise.all([
    getCompanySettings(),
    getProducts(),
    getCategories(),
  ])
  return <ContactPage initialSettings={settings} initialProducts={products} initialCategories={categories} />
}
