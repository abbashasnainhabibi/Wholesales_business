'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Search, Phone, Boxes, X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { ProductCategory, CompanySettings } from '@/lib/types/crm'
import { fallbackSettings } from '@/lib/api/crm'
import { resolveMediaUrl, scrollToElement, scrollToTop } from '@/lib/utils'
import {
  siteContainer,
  eyebrowText,
  h1Text,
  h2Text,
  bodyLead,
  bodyText,
} from '@/lib/typography'

const categoryImages: Record<string, string> = {
  'polythene-sheets-films': '/uploads/categories/polythene-sheets-films.jpeg',
  'building-flexible-pipes': '/uploads/categories/building-flexible-pipes.jpeg',
  'tarpaulins-canvas-tents': '/uploads/categories/tarpaulins-canvas-tents.jpeg',
  'safety-belts-webbing-slings': '/uploads/categories/safety-belts-webbing-slings.jpeg',
  'packaging-strapping': '/uploads/categories/packaging-strapping.jpeg',
  'nets': '/uploads/categories/nets.jpeg',
  'ropes': '/uploads/categories/ropes.jpeg',
}


export function CategoriesView({
  categories = [],
  settings: customSettings,
}: {
  categories?: ProductCategory[]
  settings?: CompanySettings
}) {
  const settings = customSettings || fallbackSettings
  const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '')
  const wa = `https://wa.me/${cleanWhatsapp}`

  const ITEMS_PER_PAGE = 9
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const q = searchQuery.toLowerCase().trim()
    return categories.filter((cat) => {
      const name = (cat.name || '').toLowerCase()
      const desc = (cat.description || '').toLowerCase()
      const slug = (cat.slug || '').toLowerCase()
      return name.includes(q) || desc.includes(q) || slug.includes(q)
    })
  }, [categories, searchQuery])

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE) || 1

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredCategories.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredCategories, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    scrollToTop()
  }

  const startCategoryIndex = filteredCategories.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endCategoryIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredCategories.length)

  return (
    <div id="categories-top" className="scroll-mt-24">
      {/* Hero Header with Search Bar */}
      <section className={`mx-auto ${siteContainer} pt-8 pb-8`}>
        <p className={`mb-2 sm:mb-2.5 ${eyebrowText}`}>
          Category Silos &amp; Material Hubs
        </p>
        <h1 className={h1Text}>
          Wholesale Material Categories in Karachi
        </h1>
        <p className={`mt-4 max-w-2xl ${bodyLead}`}>
          Dedicated wholesale departments supplied directly from our Shahra-e-Liaquat Road warehouse and SITE industrial loading bays. Daily dispatches across Karachi and interior Sindh.
        </p>

        {/* Live Search Input Bar */}
        <div className="mt-8 max-w-2xl relative">
          <div className="relative">
            <label htmlFor="categories-search" className="sr-only">
              Search material categories and silos
            </label>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              id="categories-search"
              name="category_query"
              type="text"
              placeholder="Search categories (e.g. Polymers, Pipes, Shade Nets, Tarpaulins, Ropes)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search material categories and silos"
              className="w-full rounded-sm border border-slate-300 bg-slate-50/70 pl-12 pr-10 py-3.5 text-sm sm:text-base text-slate-900 outline-none transition focus:border-[#1877F2] focus:bg-white focus:ring-1 focus:ring-[#1877F2] shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full p-1"
                aria-label="Clear category search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>
              Showing {filteredCategories.length === 0 ? '0' : `${startCategoryIndex}–${endCategoryIndex}`} of {filteredCategories.length} categories
            </span>
            {searchQuery && (
              <span className="text-blue-600">Filtered by &ldquo;{searchQuery}&rdquo;</span>
            )}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className={`mx-auto ${siteContainer} pt-2 pb-16`}>
        {filteredCategories.length === 0 ? (
          <div className="rounded-none border border-slate-200 bg-slate-50 p-12 text-center">
            <Boxes className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#0F172A]">No categories match &ldquo;{searchQuery}&rdquo;</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Try searching with general terms like &quot;pipes&quot;, &quot;nets&quot;, or &quot;polymers&quot;, or browse our full catalog.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setSearchQuery('')}
                className="rounded-sm bg-[#1877F2] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-blue-600 transition"
              >
                Clear Search Filter
              </button>
              <Link
                href="/products"
                className="rounded-sm border border-slate-300 bg-white px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                Search All Products &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-7">
              {paginatedCategories.map((cat, idx) => {
                const defaultFallback = categoryImages[cat.slug] || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80'
                const img = resolveMediaUrl(cat.image, resolveMediaUrl(defaultFallback))
                return (

                  <article
                    key={cat.id}
                    className="group overflow-hidden rounded-none border border-slate-200 bg-white shadow-xs hover:border-slate-400 hover:shadow-md transition duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Clickable Image Banner */}
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="relative block h-48 sm:h-52 lg:h-56 w-full overflow-hidden rounded-none bg-slate-100 focus:outline-none"
                        aria-label={`View category ${cat.name}`}
                      >
                        <Image
                          src={img}
                          alt={`${cat.name} wholesale supply Shahra-e-Liaquat Road Karachi - Tahira Syndicate`}
                          fill
                          priority={idx < 3}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-xs">
                            {cat.name}
                          </h2>
                        </div>
                      </Link>

                      {/* Description */}
                      <div className="p-5 sm:p-7">
                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed line-clamp-3">
                          {cat.description}
                        </p>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="p-5 sm:p-7 pt-0 border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3">
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-sm bg-[#1877F2] py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-[#166fe5] active:scale-95"
                      >
                        Explore Products <ArrowRight className="h-4 w-4" />
                      </Link>
                      <a
                        href={`${wa}?text=${encodeURIComponent(`Hi Tahira Syndicate, I would like to inquire about bulk wholesale supply for: ${cat.name}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-[#25D366] px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[#0F172A] shadow-xs transition hover:brightness-105 active:scale-95"
                      >
                        <Phone className="h-4 w-4" /> WhatsApp Quote
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-sm border text-xs sm:text-sm font-bold transition ${
                    currentPage === 1
                      ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                      : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>

                <div className="flex flex-wrap items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-9 w-9 sm:h-10 sm:w-10 rounded-sm text-xs sm:text-sm font-bold transition ${
                        currentPage === pageNum
                          ? 'bg-[#1877F2] text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-sm border text-xs sm:text-sm font-bold transition ${
                    currentPage === totalPages
                      ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                      : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
