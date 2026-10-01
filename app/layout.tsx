import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Outfit } from 'next/font/google'
import './globals.css'
import { getCompanySettings, fallbackSettings } from '@/lib/api/crm'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://tahirasyndicate.com').replace(/\/$/, '')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Tahira Syndicate | Industrial Plastics, Polymers & Netting Shahra-e-Liaquat Road Karachi',
    template: '%s | Tahira Syndicate',
  },
  description:
    'Direct manufacturer and master distributor of PE, PP, PVC polymers (plastic daana), HDPE pipes, shade nets (hara parda), ropes (jahazi rassa) & tarpaulins across Shahra-e-Liaquat Road, Bolton Market, Jodia Bazaar, Saddar, SITE Area Karachi & Pakistan.',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: siteUrl,
    siteName: 'Tahira Syndicate',
    title: 'Tahira Syndicate | Industrial Plastics, Polymers & Netting Shahra-e-Liaquat Road Karachi',
    description:
      'Direct manufacturer and wholesale supplier of polymers, pressure pipes, shade nets, tarpaulins, and industrial ropes serving Shahra-e-Liaquat Road, Bolton Market, Jodia Bazaar, and SITE Area Karachi.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tahira Syndicate | Industrial Plastics, Polymers & Netting Shahra-e-Liaquat Road Karachi',
    description:
      'Bulk plastic daana, pipes, agro shade nets, and packaging materials factory direct from Shahra-e-Liaquat Road, Bolton Market & SITE Area Karachi.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'Kt7NZ_H-hRvJ3lAUKt8c0TyF9VXleTS3Cp3KZlYcT3k',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let settings = fallbackSettings
  try {
    const fetched = await getCompanySettings()
    if (fetched) settings = fetched
  } catch (err) {
    console.error('Failed to load company settings in root layout, using fallbackSettings:', err)
  }
  const cleanWhatsapp = (settings.whatsapp || fallbackSettings.whatsapp).replace(/[^0-9]/g, '')

  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': ['WholesaleStore', 'LocalBusiness', 'Manufacturer'],
    '@id': `${siteUrl}/#business`,
    name: settings.name || 'Tahira Syndicate',
    url: siteUrl,
    telephone: settings.phone,
    priceRange: '$$',
    description: settings.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: 'Karachi',
      postalCode: '74000',
      addressCountry: 'PK',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 24.8508, longitude: 67.0094 },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '19:00',
      },
    ],

    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: settings.phone,
        contactType: 'sales',
        areaServed: 'PK',
        availableLanguage: ['English', 'Urdu'],
      },
    ],
    sameAs: [
      `https://wa.me/${cleanWhatsapp}`,
      settings.facebook,
      settings.instagram,
    ].filter(Boolean),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Wholesale Industrial Supplies & Materials',
      itemListElement: [
        'Polyethylene (PE) Raw Materials',
        'PVC Raw Materials',
        'Polypropylene (PP) Materials',
        'uPVC Pipes',
        'HDPE Pipes',
        'Cotton PVC Flexible Pipes',
        'Deep-Well Boring Pipes',
        'Agricultural Shade Netting',
        'Construction Safety Nets',
        'Marine & Sports Nets',
        'Tarpaulins',
        'Commercial Packing Materials',
        'Hardware Ropes',
        'Industrial Hardware',
      ].map((name, index) => ({
        '@type': 'OfferCatalog',
        name,
        position: index + 1,
      })),
    },
  }

  return (
    <html lang="en" className={outfit.variable} data-scroll-behavior="smooth">
      <body className="antialiased font-sans">
        {children}
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
      </body>
    </html>
  )
}