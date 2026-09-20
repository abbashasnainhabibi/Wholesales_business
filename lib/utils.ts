import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import path from 'path'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80'

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

