import type { Metadata } from 'next'
import WholesaleHome from '@/components/wholesale-home'
import { getCompanySettings, getProducts, getCategories, getApprovedReviews } from '@/lib/api/crm'

import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Ropes, Nets & Tarpaulins in Karachi | Tahira Syndicate',
  description:
    'Direct manufacturer & wholesale supplier in Karachi for PE, PVC, HDPE & LDPE polymers, industrial pipes, shade nets, tarpaulins, ropes, and packaging materials.',
  path: '/',
  absoluteTitle: true,
})

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
