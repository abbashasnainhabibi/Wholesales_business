import type { Metadata } from 'next'
import WholesaleHome from '@/components/wholesale-home'
import { getCompanySettings, getProducts, getCategories, getApprovedReviews } from '@/lib/api/crm'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://tahirasyndicate.com').replace(/\/$/, '')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Industrial Plastics, Pipes & Polymer Manufacturer in Karachi | Tahira Syndicate',
  description: 'Direct manufacturer & wholesale supplier in Karachi for PE, PVC, HDPE & LDPE polymers, industrial pipes, shade nets, tarpaulins, ropes, and packaging materials.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Tahira Syndicate | Industrial Plastics & Polymers Manufacturer Karachi',
    description: 'Direct manufacturer & wholesale supplier for plastic raw materials, piping, netting and packaging supplies in Karachi, Pakistan.',
    type: 'website',
    url: siteUrl, 
  },
}

export default async function Page() {
  const [settings, products, categories, generalReviews] = await Promise.all([
    getCompanySettings(),
    getProducts(),
    getCategories(),
    getApprovedReviews({ type: 'general' }),
  ])

  return (
    <WholesaleHome
      initialSettings={settings}
      initialProducts={products}
      initialCategories={categories}
      initialReviews={generalReviews}
    />
  )
}
