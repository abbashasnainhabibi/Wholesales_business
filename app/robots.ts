import type { MetadataRoute } from 'next'
export const dynamic = 'force-static'
const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://tahirasyndicate.com').replace(/\/$/, '')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/ts-portal', '/ts-portal/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}