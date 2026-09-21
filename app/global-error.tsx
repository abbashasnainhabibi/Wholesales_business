'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home, Phone } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled Global Error:', error)
  }, [error])

  return (
    <html lang="en">
      <head>
        <title>Tahira Syndicate | Industrial Plastics &amp; Polymers Wholesale Karachi</title>
        <meta
          name="description"
          content="Direct manufacturer and wholesale distributor of industrial polymers, HDPE pipes, shade nets, and tarpaulins on Shahra-e-Liaquat Road, Karachi."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        <main className="flex min-h-screen items-center justify-center px-4 py-16">
          <div className="w-full max-w-lg border border-slate-200 bg-white p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <h1 className="text-2xl font-black tracking-tight text-[#0F172A] sm:text-3xl">
              Temporary Connection Delay
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              We are reconnecting to the wholesale inventory catalog. Please refresh the page or connect directly with our Karachi sales desk on WhatsApp.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#1877F2] px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
                aria-label="Retry loading page"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Catalog
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Link>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <a
                href="https://wa.me/923212043552?text=Hi%20Tahira%20Syndicate%2C%20I%20need%20assistance%20with%20a%20material%20quote"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-xs font-bold text-[#16a34a] hover:underline"
              >
                <Phone className="h-3.5 w-3.5" />
                Direct WhatsApp Sales Desk: +92 321 2043552
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
