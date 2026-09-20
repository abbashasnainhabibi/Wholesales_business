import type { MetadataRoute } from 'next'
import { getCategories, getProducts } from '@/lib/api/crm'
import { getServices } from '@/lib/data/services'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://tahirasyndicate.com').replace(/\/$/, '')
  const now = new Date()

  let categories: Awaited<ReturnType<typeof getCategories>> = []
  let products: Awaited<ReturnType<typeof getProducts>> = []

  try {
    const [fetchedCategories, fetchedProducts] = await Promise.all([
      getCategories(),
      getProducts(),
    ])
    categories = fetchedCategories || []
    products = fetchedProducts || []
  } catch (error) {
    console.warn('[sitemap] Failed to fetch dynamic categories/products from CRM API, falling back to static routes:', error)
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/categories`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/projects`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]

  const servicePages: MetadataRoute.Sitemap = getServices().map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/categories/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.9,
  }))

  return [...staticPages, ...servicePages, ...categoryPages, ...productPages]
}
