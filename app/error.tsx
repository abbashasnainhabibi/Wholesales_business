'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RefreshCw, Home, Phone } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page-level error caught:', error)
  }, [error])

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg border border-slate-200 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <AlertCircle className="h-7 w-7" />
        </div>

        <h1 className="text-2xl font-black tracking-tight text-[#0F172A] sm:text-3xl">
          Unable to Load Content
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          The requested wholesale data could not be retrieved. You can retry loading the catalog or reach our sales desk immediately.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#1877F2] px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
            aria-label="Retry loading this section"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
          >
            <Home className="h-4 w-4" />
            Home Page
          </Link>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <a
            href="https://wa.me/923212043552?text=Hi%20Tahira%20Syndicate%2C%20I%20need%20a%20wholesale%20material%20quote"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-xs font-bold text-[#16a34a] hover:underline"
          >
            <Phone className="h-3.5 w-3.5" />
            WhatsApp Desk: +92 321 2043552
          </a>
        </div>
      </div>
    </main>
  )
}
