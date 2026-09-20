'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, ArrowRight, Phone, Grid, List, X, ShieldCheck, CheckCircle2, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { fallbackSettings } from '@/lib/api/crm'
import type { CompanySettings, ProductItem, ProductCategory } from '@/lib/types/crm'
import { resolveMediaUrl } from '@/lib/utils'
import {
  siteContainer,
  eyebrowText,
  h1Text,
  bodyLead,
  bodyText,
  ctaButtonWhatsApp,
} from '@/lib/typography'


const tradeSynonyms: Record<string, string[]> = {
  tirpal: ['tarpaulin', 'canvas', 'sheet', 'waterproof', 'tent'],
  tarpaal: ['tarpaulin', 'canvas', 'sheet', 'waterproof', 'tent'],
  moom: ['canvas', 'duck', 'tarpaulin', 'tent'],
  tambu: ['tent', 'canvas', 'shelter', 'tarpaulin'],
  khima: ['tent', 'canvas', 'shelter', 'relief'],
  khaima: ['tent', 'canvas', 'shelter', 'relief'],
  kabootar: ['bird', 'pigeon', 'anti-bird', 'balcony', 'net'],
  chiriya: ['bird', 'pigeon', 'anti-bird', 'net'],
  parda: ['shade', 'net', 'curtain', 'canopy'],
  hara: ['green', 'shade', 'net', 'agro'],
  sabz: ['green', 'shade', 'net'],
  chhat: ['polythene', 'plastic', 'film', 'moisture', 'sheet', 'underlay'],
  dhalai: ['polythene', 'plastic', 'concrete', 'moisture', 'sheet', 'underlay'],
  shopper: ['polythene', 'plastic', 'tubular', 'roll', 'bag', 'packaging'],
  doodhia: ['polythene', 'translucent', 'white', 'ldpe', 'film'],
  rassa: ['rope', 'cord', 'hawser', 'ladder', 'braided', 'polypropylene'],
  rassi: ['rope', 'cord', 'twine', 'braided'],
  sootli: ['twine', 'rope', 'packing', 'strapping'],
  sutli: ['twine', 'rope', 'packing', 'strapping'],
  dori: ['cord', 'nylon', 'twine', 'braided'],
  seerhi: ['ladder', 'rope ladder', 'pilot ladder'],
  kaath: ['ladder', 'hardwood', 'pilot ladder'],
  niwar: ['webbing', 'strap', 'cargo', 'belt', 'slings', 'niwar'],
  patti: ['webbing', 'strap', 'cargo', 'sling', 'patta'],
  lifting: ['patta', 'sling', 'crane', 'webbing', 'belt', 'duplex'],
  sling: ['patta', 'lifting', 'crane', 'webbing', 'duplex', 'round'],
  harness: ['safety', 'belt', 'kamar', 'scaffolding', 'fall-arrest'],
  kamar: ['safety', 'belt', 'harness', 'fall-arrest'],
  lashing: ['ratchet', 'cargo', 'tie-down', 'truck', 'belt', 'patta'],
  ratchet: ['lashing', 'cargo', 'tie-down', 'belt', 'patta'],
  gol: ['round', 'tubular', 'endless', 'sling', 'patta'],
  recovery: ['towing', 'strap', 'snatch', 'truck', 'patta'],
  taar: ['steel wire', 'suction', 'hose', 'pipe', 'pvc'],
  spring: ['steel wire', 'suction', 'hose', 'pipe'],
  dhaga: ['fiber', 'braided', 'garden', 'hose', 'pipe'],
  sooti: ['fiber', 'braided', 'cotton', 'pipe', 'hose'],
  patta: ['layflat', 'delivery', 'discharge', 'hose', 'pipe', 'webbing', 'sling', 'lifting', 'lashing'],
  chapti: ['layflat', 'delivery', 'discharge', 'pipe'],
  boring: ['hdpe', 'pipe', 'pressure', 'pn10', 'submersible', 'well'],
  daana: ['polymer', 'granules', 'resin', 'pe', 'pp', 'pvc', 'raw'],
  bora: ['bag', 'sack', 'packaging', 'woven'],
  bori: ['bag', 'sack', 'packaging', 'woven'],
}

function CatalogViewContent({
  initialProducts,
  initialCategories,
  initialSettings,
  categorySlug,
  showHero = true,
}: {
  initialProducts?: ProductItem[]
  initialCategories?: ProductCategory[]
  initialSettings?: CompanySettings
  categorySlug?: string
  brandSlug?: string
  showHero?: boolean
}) {
  const searchParams = useSearchParams()
  const queryParam = searchParams?.get('q') || searchParams?.get('search') || ''

  const settings = initialSettings || fallbackSettings
  const products = initialProducts || []
  const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '')
  const wa = `https://wa.me/${cleanWhatsapp}`

  const categories = useMemo(() => {
    if (initialCategories && initialCategories.length > 0) return initialCategories
    const seen = new Set<string>()
    const cats: ProductCategory[] = []
    for (const p of products) {
      if (p.category && !seen.has(p.category.slug)) {
        seen.add(p.category.slug)
        cats.push(p.category)
      }
    }
    return cats
  }, [initialCategories, products])

  const [searchQuery, setSearchQuery] = useState(queryParam)
  const [selectedCategory, setSelectedCategory] = useState<string>(categorySlug || 'all')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam)
    }
  }, [queryParam])

  const activeCategoryObj = useMemo(() => {
    if (selectedCategory === 'all') return null
    return categories.find((c) => c.slug === selectedCategory)
  }, [categories, selectedCategory])

  const resetAllFilters = () => {
    setSelectedCategory('all')
    setInStockOnly(false)
    setSearchQuery('')
  }

  const hasActiveFilters = selectedCategory !== 'all' || inStockOnly || searchQuery.trim().length > 0

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const catSlug = p.category?.slug || (categories.find(c => c.id === p.categoryId)?.slug)
        if (catSlug !== selectedCategory) return false
      }

      // In stock filter
      if (inStockOnly && p.availability !== 'InStock' && p.availability !== 'In Stock') {
        return false
      }

      // Search query filter with Roman Urdu trade terms expansion
      if (searchQuery.trim()) {
        const rawQuery = searchQuery.toLowerCase().trim()
        const queryTokens = rawQuery.split(/\s+/)

        const expandedTokens = new Set<string>()
        queryTokens.forEach(token => {
          expandedTokens.add(token)
          for (const [urduTerm, synonyms] of Object.entries(tradeSynonyms)) {
            if (urduTerm.includes(token) || token.includes(urduTerm)) {
              synonyms.forEach(s => expandedTokens.add(s))
            }
          }
        })

        const combinedSearchableText = [
          p.name,
          p.sku,
          p.tradeAliases,
          p.shortDescription,
          p.longDescription,
          p.usage,
          p.category?.name,
          p.metaTitle,
          p.metaDescription,
          p.benefits?.join(' '),
          p.suitedFor?.join(' '),
          p.attributeValues?.map(a => `${a.attribute?.name || ''} ${a.value}`).join(' '),
        ].filter(Boolean).join(' ').toLowerCase()

        const hasMatch = Array.from(expandedTokens).some(token => combinedSearchableText.includes(token))
        if (!hasMatch) return false
      }

      return true
    })
  }, [products, selectedCategory, inStockOnly, searchQuery, categories])

  const ITEMS_PER_PAGE = 12
  const [currentPage, setCurrentPage] = useState(1)

  // Reset page to 1 whenever filters or search query change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, inStockOnly, searchQuery])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const element = document.getElementById('catalog-products-top')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const startItemIndex = filteredProducts.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endItemIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* 1. Cohesive Light Hero Header */}
      {showHero && (
        <section className={`${siteContainer} pt-12 sm:pt-16 pb-8 sm:pb-10`}>
          <p className={`mb-2.5 ${eyebrowText}`}>
            Wholesale Catalog &amp; Manufacturing
          </p>
          <h1 className={h1Text}>
            Materials &amp; Products Directory in Karachi
          </h1>
          <p className={`mt-4 max-w-3xl ${bodyLead}`}>
            Factory-direct polymer granules (plastic daana), certified pressure pipes, heavy-duty shade netting (hara parda), and commercial packaging in bulk stock from our Shahra-e-Liaquat Road, Bolton Market, and SITE Area distribution hubs.
          </p>

          {/* Clean Search Input */}
          <div className="mt-8 relative max-w-2xl">
            <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by material, size (e.g. 110mm, PE granules, shade net)..."
              className="w-full rounded-sm border border-slate-300 bg-slate-50/70 pl-12 pr-12 py-3.5 text-base sm:text-lg text-[#0F172A] placeholder:text-slate-400 focus:bg-white focus:border-[#1877F2] focus:outline-none transition shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </section>
      )}

      {/* Main Catalog Container */}
      <div id="catalog-products-top" className={`${siteContainer} scroll-mt-24`}>
        {/* Top Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4 sm:pb-5 mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="flex items-center gap-2 rounded-sm border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-800 md:hidden shadow-xs"
            >
              <Filter className="h-4 w-4 text-[#1877F2]" /> Filters ({filteredProducts.length})
            </button>
            <span className="text-xs sm:text-sm text-slate-600">
              Showing <strong className="text-[#0F172A] font-black">{filteredProducts.length === 0 ? '0' : `${startItemIndex}–${endItemIndex}`}</strong> of <strong className="text-[#0F172A] font-black">{filteredProducts.length}</strong> wholesale products
            </span>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="hidden sm:flex flex-wrap items-center gap-2 ml-2 pl-3 border-l border-slate-200">
                {selectedCategory !== 'all' && activeCategoryObj && (
                  <span className="inline-flex items-center gap-1.5 rounded-none bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    Category: {activeCategoryObj.name}
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="text-slate-400 hover:text-slate-700"
                      aria-label="Remove category filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1.5 rounded-none bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                    In-Stock Only
                    <button
                      onClick={() => setInStockOnly(false)}
                      className="text-emerald-600 hover:text-emerald-900"
                      aria-label="Remove stock filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1.5 rounded-none bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-semibold text-blue-800">
                    &ldquo;{searchQuery}&rdquo;
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-blue-500 hover:text-blue-800"
                      aria-label="Clear search term"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-[#1877F2] hover:underline ml-1"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="hidden sm:flex items-center gap-1 rounded-none border border-slate-200 p-0.5 bg-slate-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition ${viewMode === 'grid' ? 'bg-white shadow-xs text-[#1877F2] font-bold' : 'text-slate-400 hover:text-slate-700'}`}
                title="Grid View"
                aria-label="Grid View"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 transition ${viewMode === 'list' ? 'bg-white shadow-xs text-[#1877F2] font-bold' : 'text-slate-400 hover:text-slate-700'}`}
                title="List View"
                aria-label="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Catalog Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-start">
          {/* 1. LEFT SIDEBAR FILTERS (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-3 space-y-5">
            <div className="rounded-none border border-slate-200 bg-white p-5 space-y-5 sticky top-28 shadow-xs">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Product Categories
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={resetAllFilters}
                    className="text-xs font-bold text-[#1877F2] hover:underline"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-semibold transition text-left ${
                    selectedCategory === 'all'
                      ? 'bg-[#1877F2] text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>All Categories</span>
                  <span className={`text-xs font-mono px-1.5 py-0.5 ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {products.length}
                  </span>
                </button>
                {categories.map((cat) => {
                  const count = products.filter(
                    (p) => (p.category?.slug || categories.find(c => c.id === p.categoryId)?.slug) === cat.slug
                  ).length
                  const isActive = selectedCategory === cat.slug
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-semibold transition text-left ${
                        isActive
                          ? 'bg-[#1877F2] text-white font-bold shadow-xs'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="truncate pr-2">{cat.name}</span>
                      <span className={`text-xs font-mono px-1.5 py-0.5 ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Availability Filter */}
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2.5">
                  Stock Filter
                </h3>
                <label className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700 cursor-pointer select-none hover:text-slate-900 group">
                  <div className={`h-4 w-4 rounded-xs border flex items-center justify-center transition ${
                    inStockOnly
                      ? 'bg-[#1877F2] border-[#1877F2] text-white'
                      : 'bg-white border-slate-300 group-hover:border-slate-400'
                  }`}>
                    {inStockOnly && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="sr-only"
                  />
                  <span>In-Stock Items Only</span>
                </label>
              </div>

              {/* Verified Trade Assistance Box */}
              <div className="border border-blue-100 bg-blue-50/50 p-4 text-xs space-y-2.5">
                <div className="flex items-center gap-1.5 font-bold text-[#1877F2]">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>Direct Trade Desk</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                  Full container loads, custom BOQ sizing, and contractor wholesale freight across Pakistan.
                </p>
                <a
                  href={`${wa}?text=${encodeURIComponent('Hi Tahira Syndicate, I would like to inquire about bulk wholesale supply and custom orders.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-[#1877F2] hover:underline pt-0.5 text-xs"
                >
                  <Phone className="h-3.5 w-3.5" /> Inquire via WhatsApp &rarr;
                </a>
              </div>
            </div>
          </aside>

          {/* 2. RIGHT PRODUCT GRID / LIST */}
          <main className="lg:col-span-9 xl:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="border border-slate-200 bg-white p-8 sm:p-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-none bg-slate-100 text-slate-400 mb-4">
                  <Search className="h-7 w-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">No matching materials found</h3>
                <p className={`mt-2 text-sm text-slate-600 max-w-md mx-auto`}>
                  Try adjusting your search terms, clearing category filters, or message us directly on WhatsApp for custom factory orders.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={resetAllFilters}
                    className="bg-[#1877F2] hover:bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition"
                  >
                    Clear Filters
                  </button>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={ctaButtonWhatsApp}
                  >
                    <Phone className="h-4 w-4" /> WhatsApp Inquiries
                  </a>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="space-y-8">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
                  {paginatedProducts.map((prod, idx) => {
                    const rawSrc = prod.images?.[0]?.src
                    const imgSrc = resolveMediaUrl(rawSrc)
                    const imgAlt = prod.images?.[0]?.alt || prod.name

                    return (
                      <article
                        key={prod.id}
                        className="group flex flex-col justify-between border border-slate-200 bg-white shadow-xs transition duration-200 hover:border-slate-400 hover:shadow-sm"
                      >

                        <div>
                          {/* Image Container without category overlay badge */}
                          <Link
                            href={`/products/${prod.slug}`}
                            className="relative block aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-slate-100 focus:outline-none"
                            aria-label={`View details for ${prod.name}`}
                          >
                            <Image
                              src={imgSrc}
                              alt={imgAlt}
                              fill
                              priority={idx < 2}
                              sizes="(max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition duration-500 group-hover:scale-105"
                            />
                            {prod.availability === 'InStock' && (
                              <div className="absolute right-2.5 top-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200 shadow-xs flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                <span className="hidden sm:inline">In Stock</span>
                              </div>
                            )}
                          </Link>

                          {/* Card Content */}
                          <div className="p-3.5 sm:p-5">
                            <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                              <span>SKU: {prod.sku}</span>
                              {prod.moq && <span className="hidden sm:inline font-sans font-medium text-slate-500">MOQ: {prod.moq}</span>}
                            </div>

                            <h3 className="font-heading text-sm sm:text-base lg:text-lg font-black text-slate-900 group-hover:text-[#1877F2] transition line-clamp-2 leading-snug tracking-tight">
                              <Link href={`/products/${prod.slug}`}>
                                {prod.name}
                              </Link>
                            </h3>

                            {prod.tradeAliases && (
                              <p className="mt-1 text-[11px] sm:text-xs font-medium text-slate-600 line-clamp-1">
                                <span className="font-bold text-slate-800">Trade:</span> {prod.tradeAliases}
                              </p>
                            )}

                            <p className="mt-1.5 text-xs sm:text-sm line-clamp-2 text-slate-600 leading-relaxed">
                              {prod.shortDescription || prod.usage || prod.metaDescription || 'Direct wholesale and factory supply from Karachi warehouse.'}
                            </p>
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="p-3 sm:p-4 pt-0 space-y-2 border-t border-slate-100 pt-3">
                          <a
                            href={`${wa}?text=${encodeURIComponent(`Hi Tahira Syndicate, I would like to get a wholesale quote for: ${prod.name} (SKU: ${prod.sku})`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-1.5 rounded-sm bg-[#25D366] hover:bg-[#20ba59] px-2 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-[#0F172A] transition active:scale-98 shadow-xs whitespace-nowrap"
                          >
                            <Phone className="h-3.5 w-3.5 shrink-0" />
                            <span>WhatsApp Quote</span>
                          </a>
                          <Link
                            href={`/products/${prod.slug}`}
                            className="flex w-full items-center justify-center gap-1 rounded-sm border border-slate-300 hover:border-slate-500 hover:bg-slate-50 px-2 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-slate-800 hover:text-[#1877F2] transition whitespace-nowrap"
                          >
                            <span>View Specs</span>
                            <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                          </Link>
                        </div>
                      </article>
                    )
                  })}
                </div>

                {/* Pagination Controls for Grid View */}
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
            ) : (
              /* LIST VIEW */
              <div className="space-y-6">
                <div className="space-y-4">
                  {paginatedProducts.map((prod) => {
                    const rawSrc = prod.images?.[0]?.src
                    const imgSrc = resolveMediaUrl(rawSrc)
                    const imgAlt = prod.images?.[0]?.alt || prod.name

                    return (
                      <article

                        key={prod.id}
                        className="group flex flex-col sm:flex-row items-center gap-5 sm:gap-6 border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-400 transition"
                      >
                        <Link
                          href={`/products/${prod.slug}`}
                          className="relative aspect-[16/11] h-40 sm:h-44 w-full sm:w-52 shrink-0 overflow-hidden bg-slate-100 block"
                          aria-label={`View details for ${prod.name}`}
                        >
                          <Image
                            src={imgSrc}
                            alt={imgAlt}
                            fill
                            sizes="(max-width: 640px) 100vw, 220px"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        </Link>
                        <div className="flex-1 min-w-0 w-full sm:w-auto">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                            <span>SKU: {prod.sku}</span>
                          </div>
                          <h3 className="font-heading text-base sm:text-lg font-black text-slate-900 mt-1 leading-snug tracking-tight">
                            <Link href={`/products/${prod.slug}`} className="hover:text-[#1877F2] transition">
                              {prod.name}
                            </Link>
                          </h3>
                          {prod.tradeAliases && (
                            <p className="mt-0.5 text-xs font-medium text-slate-500">
                              <span className="font-semibold text-slate-600">Also known as:</span> {prod.tradeAliases}
                            </p>
                          )}
                          <p className={`mt-1.5 ${bodyText} line-clamp-2 text-slate-600 text-xs sm:text-sm`}>
                            {prod.shortDescription || prod.usage || prod.metaDescription || 'High-grade wholesale material stock.'}
                          </p>
                        </div>
                        <div className="flex sm:flex-col gap-2 w-full sm:w-44 shrink-0">
                          <a
                            href={`${wa}?text=${encodeURIComponent(`Hi Tahira Syndicate, I would like to get a trade quote for: ${prod.name} (SKU: ${prod.sku})`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 rounded-sm bg-[#25D366] hover:bg-[#20ba59] py-2.5 text-xs sm:text-sm font-bold text-[#0F172A] transition shadow-xs whitespace-nowrap"
                          >
                            <Phone className="h-3.5 w-3.5 shrink-0" />
                            <span>WhatsApp Quote</span>
                          </a>
                          <Link
                            href={`/products/${prod.slug}`}
                            className="flex-1 flex items-center justify-center gap-1 rounded-sm border border-slate-300 hover:border-slate-500 hover:bg-slate-50 py-2 text-xs sm:text-sm font-bold text-slate-800 hover:text-[#1877F2] transition whitespace-nowrap"
                          >
                            <span>View Specs</span>
                            <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                          </Link>
                        </div>
                      </article>
                    )
                  })}
                </div>

                {/* Pagination Controls for List View */}
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
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-over Modal */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative z-10 flex h-full w-full max-w-xs flex-col justify-between bg-white shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-[#1877F2]" />
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Filter Materials
                  </h2>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">
                    Product Categories
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setSelectedCategory('all')
                        setMobileFilterOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition text-left ${
                        selectedCategory === 'all'
                          ? 'bg-[#1877F2] text-white font-bold shadow-xs'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>All Categories</span>
                      <span className={`text-xs font-mono px-1.5 py-0.5 ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {products.length}
                      </span>
                    </button>
                    {categories.map((cat) => {
                      const count = products.filter(
                        (p) => (p.category?.slug || categories.find(c => c.id === p.categoryId)?.slug) === cat.slug
                      ).length
                      const isActive = selectedCategory === cat.slug
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.slug)
                            setMobileFilterOpen(false)
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition text-left ${
                            isActive
                              ? 'bg-[#1877F2] text-white font-bold shadow-xs'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="truncate pr-2">{cat.name}</span>
                          <span className={`text-xs font-mono px-1.5 py-0.5 ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                            {count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Stock Availability */}
                <div className="border-t border-slate-100 pt-5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">
                    Stock Filter
                  </h3>
                  <label className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700 cursor-pointer select-none group">
                    <div className={`h-4 w-4 rounded-xs border flex items-center justify-center transition ${
                      inStockOnly
                        ? 'bg-[#1877F2] border-[#1877F2] text-white'
                        : 'bg-white border-slate-300 group-hover:border-slate-400'
                    }`}>
                      {inStockOnly && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="sr-only"
                    />
                    <span>In-Stock Items Only</span>
                  </label>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="border-t border-slate-200 p-4 space-y-2 bg-slate-50">
                <button
                  onClick={resetAllFilters}
                  className="w-full border border-slate-300 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Reset All Filters
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full bg-[#1877F2] hover:bg-blue-600 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition"
                >
                  Show ({filteredProducts.length}) Results
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function CatalogView(props: {
  initialProducts?: ProductItem[]
  initialCategories?: ProductCategory[]
  initialSettings?: CompanySettings
  categorySlug?: string
  brandSlug?: string
  showHero?: boolean
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
      <CatalogViewContent {...props} />
    </Suspense>
  )
}

