import Link from 'next/link'
import {
  ArrowRight,
  Boxes,
  Layers,
  Phone,
  Search,
  Home,
  Wrench,
} from 'lucide-react'
import { getCompanySettings, getCategories } from '@/lib/api/crm'
import { SiteHeader, SiteFooter } from '@/components/site-navigation'
import {
  siteContainer,
  eyebrowText,
  h1Text,
  bodyLead,
  ctaButtonWhatsAppLarge,
  ctaButtonPrimary,
} from '@/lib/typography'

export const dynamic = 'force-dynamic'

export default async function NotFound() {
  const [settings, categories] = await Promise.all([
    getCompanySettings().catch(() => null),
    getCategories().catch(() => []),
  ])

  const cleanWhatsapp = (settings?.whatsapp || '+923212043552').replace(/[^0-9]/g, '')
  const wa = `https://wa.me/${cleanWhatsapp}`

  const directoryCards = [
    {
      title: 'Wholesale Products',
      description: 'Browse our complete inventory of industrial ropes, shade netting, HDPE pipes, polymers & packaging supplies.',
      href: '/products',
      icon: Boxes,
      actionText: 'View All Products',
      isGreen: false,
    },
    {
      title: 'Material Categories',
      description: 'Filter materials directly by category: Agro Shade Nets, Heavy Tarpaulins, Pressure Pipes, Ropes & Webbing.',
      href: '/categories',
      icon: Layers,
      actionText: 'Browse Categories',
      isGreen: false,
    },
    {
      title: 'Fabrication Services',
      description: 'Need custom sizing? Explore bespoke tarpaulin stitching, cricket net fabrication & PE film extrusion.',
      href: '/services',
      icon: Wrench,
      actionText: 'View Services',
      isGreen: false,
    },
    {
      title: 'Karachi Trade Counter',
      description: 'Speak directly with our physical sales counter on Shahra-e-Liaquat Road, Karachi for instant wholesale RFQs.',
      href: '/contact',
      icon: Phone,
      actionText: 'Go to Contact Page',
      isGreen: true,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <SiteHeader settings={settings || undefined} categories={categories || undefined} />

      <main className="flex-1 py-16 sm:py-20 lg:py-24">
        <div className={`${siteContainer}`}>
          {/* Main 404 Hero */}
          <div className="mx-auto max-w-3xl text-center">
            <p className={`${eyebrowText} mb-3`}>
              404 — Page Not Found
            </p>

            <h1 className={`${h1Text} text-balance mb-4`}>
              Looking for Wholesale Materials or Trade Stock?
            </h1>

            <p className={`${bodyLead} mx-auto max-w-2xl text-balance mb-8`}>
              The link you followed may be incorrect or the item has been updated in our catalog. Use the direct trade shortcuts below or connect with our sales desk.
            </p>

            {/* Direct Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
              <Link href="/" className={ctaButtonPrimary}>
                <Home className="h-4 w-4" />
                Return to Home
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-none border border-slate-300 bg-white px-6 py-3 text-sm sm:text-base font-bold text-[#0F172A] shadow-xs transition hover:border-slate-400 hover:bg-slate-50"
              >
                <Search className="h-4 w-4 text-[#1877F2]" />
                Search Product Catalog
              </Link>
              <a
                href={`${wa}?text=${encodeURIComponent('Hi Tahira Syndicate, I reached a 404 page and would like assistance with wholesale material inquiries.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={ctaButtonWhatsAppLarge}
              >
                <Phone className="h-4 w-4 fill-current" />
                WhatsApp Sales Desk
              </a>
            </div>
          </div>

          {/* Differentiated Directory Grid */}
          <div className="mx-auto max-w-6xl border-t border-slate-200 pt-12">
            <div className="mb-8 text-center sm:text-left">
              <p className={eyebrowText}>Trade Shortcuts</p>
              <h2 className="mt-1 text-2xl font-black text-[#0F172A]">
                Where would you like to go?
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {directoryCards.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`group flex flex-col justify-between border border-slate-200 bg-white p-6 transition duration-200 ${
                      item.isGreen
                        ? 'hover:border-[#25D366] hover:shadow-md'
                        : 'hover:border-[#1877F2] hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div
                        className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-sm transition ${
                          item.isGreen
                            ? 'bg-[#25D366] text-[#0F172A] shadow-xs group-hover:brightness-105'
                            : 'border border-slate-200 bg-slate-50 text-[#1877F2] group-hover:border-[#1877F2] group-hover:bg-[#1877F2] group-hover:text-white'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3
                        className={`text-base sm:text-lg font-bold text-[#0F172A] transition ${
                          item.isGreen ? 'group-hover:text-[#0F172A]' : 'group-hover:text-[#1877F2]'
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                        {item.description}
                      </p>
                    </div>

                    <div
                      className={`mt-6 flex items-center gap-1.5 pt-4 border-t border-slate-100 text-xs sm:text-sm font-bold transition ${
                        item.isGreen ? 'text-[#16a34a]' : 'text-[#1877F2]'
                      }`}
                    >
                      <span>{item.actionText}</span>
                      <ArrowRight
                        className={`h-3.5 w-3.5 transition transform group-hover:translate-x-1 ${
                          item.isGreen ? 'text-[#16a34a]' : 'text-[#1877F2]'
                        }`}
                      />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Minimalist Warehouse Helpline Footer */}
          <div className="mx-auto mt-12 max-w-3xl border border-slate-200 bg-slate-50/70 p-5 text-center">
            <p className="text-xs sm:text-sm text-slate-600">
              Direct Karachi Sales Desk:{' '}
              <a
                href={`tel:${settings?.phone || '+923212043552'}`}
                className="font-bold text-[#0F172A] hover:text-[#25D366] transition"
              >
                {settings?.phone || '+92 321 2043552'}
              </a>{' '}
              • Shahra-e-Liaquat Road, Karachi • Mon–Sat (10:00 AM – 7:00 PM PST) •{' '}
              <Link href="/contact" className="font-bold text-[#1877F2] hover:underline">
                Contact Page
              </Link>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter settings={settings || undefined} />
    </div>
  )
}
