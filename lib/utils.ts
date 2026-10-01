import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import path from 'path'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DEFAULT_FALLBACK_IMAGE = '/logo.png'

/**
 * Central Media URL Resolver for Unified Application.
 * Resolves dynamic media paths (/uploads/...) directly from local public folder.
 */
export function resolveMediaUrl(src?: string | null, fallback: string = DEFAULT_FALLBACK_IMAGE): string {
  if (!src || typeof src !== 'string') {
    return fallback
  }

  const cleanSrc = src.trim()
  if (!cleanSrc) {
    return fallback
  }

  // Reject Base64 data URLs
  if (cleanSrc.startsWith('data:')) {
    return fallback
  }

  // Absolute http/https URLs
  if (cleanSrc.startsWith('http://') || cleanSrc.startsWith('https://')) {
    return cleanSrc
  }

  // Dynamic uploads in unified app live right in /uploads/...
  if (cleanSrc.startsWith('/uploads/') || cleanSrc.startsWith('uploads/')) {
    return cleanSrc.startsWith('/') ? cleanSrc : `/${cleanSrc}`
  }

  // Static frontend local assets
  return cleanSrc
}

export function getCrmUploadsDir(): string {
  return path.join(process.cwd(), 'public', 'uploads')
}

export function getFrontendUploadsDir(): string {
  return path.join(process.cwd(), 'public', 'uploads')
}

export function getFrontendPublicDir(): string {
  return path.join(process.cwd(), 'public')
}

/**
 * Smoothly scrolls to the very top of the page after DOM update / pagination.
 * Safe against page height collapse / React re-renders.
 */
export function scrollToTop(behavior: ScrollBehavior = 'smooth') {
  if (typeof window === 'undefined') return
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior })
  })
}

/**
 * Smoothly scrolls to a specified element ID after DOM update, offset for sticky headers.
 * Safe against page height collapse / React re-renders.
 */
export function scrollToElement(elementId?: string, offset = 90) {
  if (typeof window === 'undefined') return
  if (!elementId) {
    scrollToTop()
    return
  }
  requestAnimationFrame(() => {
    const el = document.getElementById(elementId)
    if (!el) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const targetY = el.getBoundingClientRect().top + window.pageYOffset - offset
    window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' })
  })
}

