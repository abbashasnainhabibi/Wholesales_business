import type { Metadata } from 'next'

export const SITE_URL = 'https://tahirasyndicate.com'
export const DEFAULT_OG_IMAGE = '/opengraph-image'

/**
 * Filter out null/undefined/empty image URLs and return fallback if empty.
 * Fixes JavaScript truthiness issue where `[]` evaluates to true and drops fallback.
 */
export function pickImages(list?: (string | null | undefined)[] | null): string[] {
  if (!list || !Array.isArray(list)) return [DEFAULT_OG_IMAGE]
  const valid = list
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
  return valid.length > 0 ? valid : [DEFAULT_OG_IMAGE]
}

/**
 * Strip any trailing brand suffix variant ("| Tahira Syndicate", "| Tahira", etc.)
 */
export function cleanTitleString(title: string): string {
  return (title || '').replace(/\s*\|\s*Tahira.*$/i, '').trim()
}

/**
 * Trims a description string to maxLen characters at a word boundary.
 */
export function trimDescription(desc: string, maxLen = 155): string {
  if (!desc) return ''
  const cleaned = desc.replace(/\s+/g, ' ').trim()
  if (cleaned.length <= maxLen) return cleaned
  const trimmed = cleaned.slice(0, maxLen)
  const lastSpace = trimmed.lastIndexOf(' ')
  const result = lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed
  return result.replace(/[,\s.-]+$/, '').trim()
}

export interface PageMetadataOptions {
  title: string
  description: string
  path: string
  image?: string | string[] | null
  absoluteTitle?: boolean
}

/**
 * Central metadata builder ensuring consistent title templating, canonical paths,
 * Open Graph and Twitter cards across all application routes.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  image,
  absoluteTitle = false,
}: PageMetadataOptions): Metadata {
  const cleanTitle = cleanTitleString(title)
  const canonicalPath = path.startsWith('/') ? path : `/${path}`
  const fullUrl = `${SITE_URL}${canonicalPath === '/' ? '' : canonicalPath}`

  const resolvedTitle = absoluteTitle ? { absolute: title } : cleanTitle
  const fullTitle = absoluteTitle ? title : `${cleanTitle} | Tahira Syndicate`
  const images = image
    ? Array.isArray(image)
      ? pickImages(image)
      : pickImages([image])
    : [DEFAULT_OG_IMAGE]

  return {
    title: resolvedTitle,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: 'website',
      locale: 'en_PK',
      siteName: 'Tahira Syndicate',
      url: fullUrl,
      title: fullTitle,
      description,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images,
    },
  }
}
