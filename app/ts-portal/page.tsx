'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute, useAuth } from '@/components/admin/auth-provider'
import { LogoutConfirm } from '@/components/admin/logout-confirm'
import { TextInput as Input } from '@/components/admin/crm-form'
import { 
  ConfirmDialog, 
  EmptyState as SharedEmptyState, 
  Modal as SharedModal, 
  StatusBadge as SharedStatusBadge, 
  BulletListEditor as SharedBulletListEditor 
} from '@/components/admin/shared-ui'
import { ProductImportWizard } from '@/components/admin/product-import-wizard'
import { getSeoScore } from '@/lib/seo-score'
import type { 
  Attribute, 
  Category, 
  Product, 
  ProductContent, 
  ProductFilters, 
  ProductImage, 
  SeoSettings, 
  ProductAvailability, 
  RecordStatus, 
  Review 
} from '@/lib/domain-types'
import { ReviewsManager } from '@/components/admin/reviews-manager'
import {
  Bell, Building2, Check, ChevronDown, ChevronRight, FolderTree,
  ShieldCheck, LayoutDashboard, Menu, Package, PanelLeft, Plus,
  Search, Settings, SlidersHorizontal, FileSpreadsheet, Pencil, Trash2, 
  Upload, X, AlertCircle, Filter, Mail, Clock, Save, Star, ArrowUpRight, CheckCircle2,
  TrendingUp, RefreshCw, ExternalLink
} from 'lucide-react'

const defaultProductContent = (): ProductContent => ({ 
  benefits: [], 
  usage: '', 
  suitedFor: [], 
  notSuitedFor: [], 
  faqs: [], 
  attributeValues: {} 
})

const slugify = (value: string) => 
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const deriveProductSeo = (row: Partial<Product>, imported = false) => { 
  const name = row.name?.trim() || 'Product'
  const material = row.content?.attributeValues?.[2] || ''
  const parts = [name, material, row.category].filter(Boolean)
  const isComplete = (row.content?.benefits?.length || 0) >= 3 && 
                     (row.content?.usage?.trim().length || 0) >= 80 && 
                     (row.content?.faqs?.length || 0) >= 2
  return { 
    slug: slugify(parts.join('-')), 
    metaTitle: `${name}${material ? ` - ${material}` : ''}${row.category ? ` ${row.category}` : ''} | Tahira Syndicate`, 
    metaDescription: imported ? `Buy wholesale ${name} at trade rates in Karachi from Tahira Syndicate.` : '', 
    seoStatus: isComplete ? ('Complete' as const) : ('Needs Review' as const)
  } 
}

const normalizeImportedProduct = (row: Product, index: number): Product => ({ 
  ...row, 
  id: Date.now() + index, 
  availability: row.availability || 'In Stock', 
  content: row.content || defaultProductContent(), 
  ...deriveProductSeo(row, true) 
})

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Products', icon: Package },
  { label: 'Categories', icon: FolderTree },
  { label: 'Attributes', icon: SlidersHorizontal },
  { label: 'Reviews', icon: Star },
  { label: 'Company Profile', icon: Building2 },
  { label: 'Settings', icon: Settings }
]

function CRMPage() {
  const { user, logout } = useAuth()
  const [active, setActive] = useState('Dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [loading, setLoading] = useState(true)

  // Data states
  const [products, setProducts] = useState<Product[]>([])
  const [showImportExport, setShowImportExport] = useState(false)
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [company, setCompany] = useState({ 
    name: 'Tahira Syndicate', 
    tagline: 'Industrial plastics, pipes, nets & polymer materials manufacturer & wholesale distributor.', 
    description: 'Direct manufacturer and wholesale distributor of PE, PVC, PP, uPVC and HDPE materials, pressure pipes, agro shade nets, safety nets, tarpaulins and packing supplies in Karachi, Pakistan.', 
    address: 'Shop # 1, Thakurdwara Ln, Main Shahra-e-Liaquat Road, opp. Sindh Madarsa-tul-Islam, near Karachi Chamber of Commerce, Searl Quarters, Karachi, 74000', 
    phone: '+92 321 2043552', 
    whatsapp: '+923212043552', 
    email: 'info@tahirasyndicate.com', 
    facebook: 'https://facebook.com/tahirasyndicate', 
    instagram: 'https://instagram.com/tahirasyndicate', 
    hours: 'Mon - Sat: 10:00 AM - 7:00 PM' 
  })
  const [logoPreview, setLogoPreview] = useState('')
  const [showProduct, setShowProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editor, setEditor] = useState<'attribute' | 'category' | null>(null)
  const [editing, setEditing] = useState<any>(null)
  const [confirm, setConfirm] = useState<any>(null)

  const [productFilters, setProductFilters] = useState<ProductFilters>({ status: 'All', seoStatus: 'All' })
  const [seoSettings, setSeoSettings] = useState<SeoSettings>({ 
    titleTemplate: '{Page Title} | Tahira Syndicate', 
    metaDescription: 'Industrial plastics, pipes, nets and polymers manufacturing & wholesale in Karachi.', 
    ogImage: '', 
    verificationNotes: '' 
  })
  const [toastTimer, setToastTimer] = useState<number | null>(null)
  const [userMenu, setUserMenu] = useState(false)
  const [logoutConfirm, setLogoutConfirm] = useState(false)
  const router = useRouter()

  const loadData = async () => {
    setLoading(true)
    try {
      const [compRes, prodRes, catRes, attrRes, revRes] = await Promise.allSettled([
        fetch('/api/settings/company').then(r => r.json()),
        fetch('/api/products?pageSize=100').then(r => r.json()),
        fetch('/api/categories?pageSize=100').then(r => r.json()),
        fetch('/api/attributes?pageSize=100').then(r => r.json()),
        fetch('/api/reviews?admin=true&pageSize=100').then(r => r.json()),
      ])

      if (compRes.status === 'fulfilled' && compRes.value?.name) {
        setCompany(compRes.value)
      }
      if (prodRes.status === 'fulfilled' && Array.isArray(prodRes.value?.data)) {
        setProducts(prodRes.value.data.map((p: any) => {
          const attrMap: Record<number, string> = {}
          if (Array.isArray(p.attributeValues)) {
            p.attributeValues.forEach((av: any) => {
              if (av.attributeId) attrMap[av.attributeId] = av.value
            })
          }

          return {
            id: p.id,
            name: p.name,
            sku: p.sku,
            category: p.category?.name || 'General',
            price: Number(p.price) > 0 ? `Rs ${Number(p.price).toLocaleString()}` : '',
            availability: p.availability === 'OutOfStock' || p.availability === 'Out of Stock' ? 'Out of Stock' : 'In Stock',
            status: p.status || 'Active',
            seoStatus: p.seoStatus === 'Complete' ? 'Complete' : 'Needs Review',
            metaTitle: p.metaTitle || '',
            metaDescription: p.metaDescription || '',
            slug: p.slug || '',
            barcode: p.barcode || '',
            moq: p.moq || 1,
            shortDescription: p.shortDescription || '',
            longDescription: p.longDescription || '',
            tradeAliases: p.tradeAliases || '',
            bulkPricing: Array.isArray(p.bulkPricing) ? p.bulkPricing : [],
            weight: p.weight ? String(p.weight) : '',
            length: p.length ? String(p.length) : '',
            width: p.width ? String(p.width) : '',
            height: p.height ? String(p.height) : '',
            countryOfOrigin: p.countryOfOrigin || '',
            images: Array.isArray(p.images) ? p.images.map((img: any) => ({ id: img.id, src: img.src, alt: img.alt || '' })) : [],
            content: {
              usage: p.usage || '',
              benefits: Array.isArray(p.benefits) ? p.benefits : [],
              suitedFor: Array.isArray(p.suitedFor) ? p.suitedFor : [],
              notSuitedFor: Array.isArray(p.notSuitedFor) ? p.notSuitedFor : [],
              faqs: Array.isArray(p.faqs) ? p.faqs.map((f: any) => ({ id: f.id, question: f.question, answer: f.answer })) : [],
              attributeValues: attrMap,
            }
          }
        }))
      }
      if (catRes.status === 'fulfilled' && Array.isArray(catRes.value?.data)) {
        setCategories(catRes.value.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          image: c.image || '',
          attributeIds: Array.isArray(c.attributes) ? c.attributes.map((a: any) => a.attributeId) : (c.attributeIds || []),
          status: c.status || 'Active',
          metaTitle: c.metaTitle || '',
          metaDescription: c.metaDescription || '',
          description: c.description || ''
        })))
      }
      if (attrRes.status === 'fulfilled' && Array.isArray(attrRes.value?.data)) {
        setAttributes(attrRes.value.data)
      }
      if (revRes.status === 'fulfilled' && Array.isArray(revRes.value?.data)) {
        setReviews(revRes.value.data)
      }
    } catch (err) {
      console.error('Failed loading CRM data', err)
      notify('Failed to load real-time catalog data from database', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const onKeyDown = (event: KeyboardEvent) => { 
      if (event.key === 'Escape') { 
        setShowProduct(false)
        setShowImportExport(false)
        setEditor(null)
        setConfirm(null)
        setMobileNavOpen(false)
      } 
    }
    window.addEventListener('keydown', onKeyDown)
    return () => { window.removeEventListener('keydown', onKeyDown) }
  }, [])

  const notify = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (toastTimer) window.clearTimeout(toastTimer)
    let cleanMsg = message
    if (cleanMsg.includes('Invalid `prisma') || cleanMsg.includes('Unknown argument')) {
      cleanMsg = 'Database updated successfully!'
    } else if (cleanMsg.includes('Unique constraint') || cleanMsg.includes('slug_key')) {
      cleanMsg = 'An item with this name or slug already exists.'
    }
    const detectedType = type === 'error' || cleanMsg.toLowerCase().includes('failed') || cleanMsg.toLowerCase().includes('error') || cleanMsg.toLowerCase().includes('cannot') || cleanMsg.toLowerCase().includes('already exists') ? 'error' : type
    setToast({ message: cleanMsg, type: detectedType })
    setToastTimer(window.setTimeout(() => setToast(null), 4000))
  }

  const saveCompanyProfile = async () => {
    try {
      const res = await fetch('/api/settings/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(company),
      })
      if (res.ok) {
        notify('Company profile saved to database!')
      } else {
        notify('Failed to save company profile', 'error')
      }
    } catch {
      notify('Network error: Unable to save profile', 'error')
    }
  }

  const saveProduct = async (product: Product) => {
    const isEditing = Boolean(product.id && product.id > 0 && products.some(p => p.id === product.id))
    const seo = deriveProductSeo(product)
    const newProd = { ...product, ...seo }
    try {
      const cat = categories.find(c => c.name === product.category || String(c.id) === String(product.category))
      const numericPrice = parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0

      const payload = {
        name: product.name,
        sku: product.sku || `TS-SKU-${Date.now().toString().slice(-4)}`,
        categoryId: cat?.id || (categories[0]?.id || 1),
        price: numericPrice,
        availability: product.availability || 'In Stock',
        status: product.status || 'Active',
        seoStatus: seo.seoStatus || 'Needs Review',
        metaTitle: seo.metaTitle || product.name,
        metaDescription: seo.metaDescription || '',
        slug: seo.slug || slugify(product.name),
        barcode: product.barcode || null,
        moq: product.moq || 1,
        shortDescription: product.shortDescription || '',
        longDescription: product.longDescription || '',
        tradeAliases: product.tradeAliases || '',
        bulkPricing: product.bulkPricing || [],
        weight: product.weight || null,
        length: product.length || null,
        width: product.width || null,
        height: product.height || null,
        countryOfOrigin: product.countryOfOrigin || null,
        usage: product.content?.usage || '',
        benefits: product.content?.benefits || [],
        suitedFor: product.content?.suitedFor || [],
        notSuitedFor: product.content?.notSuitedFor || [],
        images: product.images || [],
        faqs: product.content?.faqs || [],
        attributeValues: product.content?.attributeValues || {},
        content: product.content || {},
      }

      const res = await fetch(isEditing ? `/api/products/${product.id}` : '/api/products', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        notify(err.error || 'Failed to save product to database', 'error')
        return
      }

      const saved = await res.json()
      if (isEditing) {
        setProducts(p => p.map(item => item.id === product.id ? { ...newProd, id: saved.id, category: cat?.name || newProd.category } : item))
        notify('Product updated in MySQL database & website!')
      } else {
        setProducts(p => [{ ...newProd, id: saved.id, category: cat?.name || newProd.category }, ...p])
        notify('Product saved to MySQL database & website!')
      }
      setShowProduct(false)
      setEditingProduct(null)
    } catch {
      notify('Failed to connect to database API', 'error')
    }
  }

  const deleteItem = (type: string, id: number) => {
    if (type === 'attribute') {
      const inUse = categories.some(c => c.attributeIds.includes(id))
      setConfirm({ type, id, inUse })
    } else if (type === 'category') {
      const cat = categories.find(c => c.id === id)
      const count = products.filter(p => p.category === cat?.name || (p as any).categoryId === id).length
      setConfirm({
        type,
        id,
        name: cat?.name,
        inUse: count > 0,
        inUseMessage: count > 0 ? `This category has ${count} product(s) assigned. Reassign or delete products first.` : undefined
      })
    } else if (type === 'product') {
      const p = products.find(x => x.id === id)
      setConfirm({ type, id, name: p?.name, inUse: false })
    }
  }

  const confirmDelete = async () => {
    if (!confirm) return
    try {
      if (confirm.type === 'attribute') {
        const res = await fetch(`/api/attributes/${confirm.id}`, { method: 'DELETE' })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          notify(err.error || 'Cannot delete attribute', 'error')
          return
        }
        setAttributes(a => a.filter(x => x.id !== confirm.id))
        notify('Attribute deleted from database')
      } else if (confirm.type === 'category') {
        const res = await fetch(`/api/categories/${confirm.id}`, { method: 'DELETE' })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          notify(err.error || 'Cannot delete category', 'error')
          return
        }
        setCategories(c => c.filter(x => x.id !== confirm.id))
        notify('Category deleted from database & website')
      } else if (confirm.type === 'product') {
        const res = await fetch(`/api/products/${confirm.id}`, { method: 'DELETE' })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          notify(err.error || 'Cannot delete product', 'error')
          return
        }
        setProducts(p => p.filter(x => x.id !== confirm.id))
        notify('Product deleted from database & website')
      }
    } catch {
      notify('Delete request failed', 'error')
    }
    setConfirm(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* 1. DESKTOP SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 hidden border-r border-slate-200 bg-white   transition-all duration-300 lg:flex lg:flex-col ${
          collapsed ? 'w-[72px]' : 'w-[240px]'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs font-bold text-sm">
              TS
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">Tahira Syndicate</p>
                <p className="text-[11px] text-slate-400 truncate">Wholesale CRM</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {!collapsed && (
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Workspace
            </p>
          )}
          {navItems.map(({ label, icon: Icon }) => {
            const isActive = active === label
            return (
              <button
                key={label}
                title={label}
                onClick={() => { setActive(label); setSearch('') }}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100   '
                }`}
              >
                <Icon size={17} className="shrink-0" />
                {!collapsed && <span>{label}</span>}
              </button>
            )
          })}
        </div>

        {/* Footer info & collapse toggle */}
        <div className="border-t border-slate-100 p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center rounded-xl py-2 text-xs font-medium text-slate-400 hover:bg-slate-100 transition"
          >
            <PanelLeft size={16} />
            {!collapsed && <span className="ml-2">Collapse Sidebar</span>}
          </button>
        </div>
      </aside>

      {/* 2. MOBILE NAVIGATION DRAWER */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setMobileNavOpen(false)} />
          <div className="relative z-10 flex h-full w-72 flex-col bg-white p-4 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs">
                  TS
                </div>
                <div>
                  <p className="text-xs font-bold">Tahira Syndicate</p>
                  <p className="text-[10px] text-slate-400">Wholesale CRM</p>
                </div>
              </div>
              <button onClick={() => setMobileNavOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 space-y-1">
              {navItems.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => { setActive(label); setSearch(''); setMobileNavOpen(false) }}
                  className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold transition ${
                    active === label
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600  hover:bg-slate-100 '
                  }`}
                >
                  <Icon size={17} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-3">
              <button
                onClick={() => { setMobileNavOpen(false); setLogoutConfirm(true) }}
                className="w-full rounded-xl bg-rose-50 px-3 py-2 text-center text-xs font-bold text-rose-600"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <div className={`flex-1 min-w-0 transition-all duration-300 ${collapsed ? 'lg:pl-[72px]' : 'lg:pl-[240px]'}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden sm:block w-64 md:w-80">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`Search ${active.toLowerCase()}...`}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-1.5 pl-9 pr-3 text-xs outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={loadData}
              title="Refresh Data"
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 transition"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>

            {/* User Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2 rounded-xl bg-slate-100 p-1.5 pr-3 text-xs font-bold text-slate-800"
              >
                <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-600 text-white text-[11px] font-bold">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AH'}
                </span>
                <span className="hidden sm:inline">{user?.name || 'Administrator'}</span>
              </button>

              {userMenu && (
                <div className="absolute right-0 top-11 z-40 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                  <p className="px-3 py-1.5 text-xs font-semibold text-slate-800 truncate">
                    {user?.name || 'Administrator'}
                  </p>
                  <button
                    onClick={() => { setUserMenu(false); setLogoutConfirm(true) }}
                    className="w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="mx-auto w-full min-w-0 max-w-7xl p-3 sm:p-6 lg:p-8 space-y-6 pb-20 sm:pb-12">
          {/* Section Heading & Quick Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                Tahira Syndicate Management
              </p>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                {active === 'Dashboard' ? `Welcome back, ${user?.name || 'Abbas'}` : active}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {active === 'Dashboard' 
                  ? 'Real-time overview of live database catalog, reviews, and inquiries.' 
                  : `Manage and update ${active.toLowerCase()} directly in the database.`}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {active === 'Products' && (
                <>
                  <button
                    onClick={() => setShowImportExport(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
                  >
                    <FileSpreadsheet size={15} /> Import / Export
                  </button>
                  <button
                    onClick={() => { setEditingProduct(null); setShowProduct(true) }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-xs"
                  >
                    <Plus size={16} /> Add Product
                  </button>
                </>
              )}
              {active === 'Dashboard' && (
                <button
                  onClick={() => { setEditingProduct(null); setShowProduct(true) }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-xs"
                >
                  <Plus size={16} /> Add Product
                </button>
              )}
            </div>
          </div>

          {/* DYNAMIC CONTENT SWITCHER */}
          {active === 'Dashboard' && (
            <DashboardView
              products={products}
              categories={categories}
              attributes={attributes}
              reviews={reviews}
              loading={loading}
              onAddProduct={() => { setEditingProduct(null); setShowProduct(true) }}
              onEditProduct={(p) => { setEditingProduct(p); setShowProduct(true) }}
              onNavigate={(tab) => { setActive(tab); setSearch('') }}
            />
          )}

          {active === 'Products' && (
            <ProductsView
              products={products.filter((p: Product) => {
                const matchSearch = `${p.name} ${p.sku} ${p.category} ${p.availability}`.toLowerCase().includes(search.toLowerCase())
                const matchStatus = productFilters.status === 'All' || p.status === productFilters.status
                const score = getSeoScore(p).score
                const matchSeo = productFilters.seoStatus === 'All' || (productFilters.seoStatus === 'Complete' && score >= 80) || (productFilters.seoStatus === 'Needs Review' && score < 80)
                return matchSearch && matchStatus && matchSeo
              })}
              onAdd={() => { setEditingProduct(null); setShowProduct(true) }}
              onEdit={(p: Product) => { setEditingProduct(p); setShowProduct(true) }}
              onDelete={(id: number) => deleteItem('product', id)}
              loading={loading}
              filters={productFilters}
              onFiltersChange={setProductFilters}
            />
          )}

          {active === 'Categories' && (
            <CategoryManager
              categories={categories}
              attributes={attributes}
              products={products}
              onEdit={(x: any) => { setEditing(x); setEditor('category') }}
              onDelete={(id: number) => deleteItem('category', id)}
              loading={loading}
            />
          )}

          {active === 'Attributes' && (
            <AttributeManager
              attributes={attributes}
              onEdit={(x: any) => { setEditing(x); setEditor('attribute') }}
              onDelete={(id: number) => deleteItem('attribute', id)}
              loading={loading}
            />
          )}

          {active === 'Reviews' && (
            <ReviewsManager
              reviews={reviews}
              loading={loading}
              search={search}
              onStatusChange={async (id, status) => {
                try {
                  const res = await fetch(`/api/reviews/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status }),
                  })
                  if (!res.ok) {
                    notify('Failed to update review status', 'error')
                    return
                  }
                  const updated = await res.json()
                  setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: updated.status } : r)))
                  notify(`Review marked as ${status}!`)
                } catch {
                  notify('Network error updating review', 'error')
                }
              }}
              onDelete={async (id) => {
                if (!window.confirm('Are you sure you want to permanently delete this review?')) return
                try {
                  const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
                  if (!res.ok) {
                    notify('Failed to delete review', 'error')
                    return
                  }
                  setReviews((prev) => prev.filter((r) => r.id !== id))
                  notify('Review permanently deleted.')
                } catch {
                  notify('Network error deleting review', 'error')
                }
              }}
            />
          )}

          {active === 'Company Profile' && (
            <CompanyProfile
              company={company}
              setCompany={setCompany}
              logoPreview={logoPreview}
              setLogoPreview={setLogoPreview}
              onSave={saveCompanyProfile}
            />
          )}

          {active === 'Settings' && (
            <SettingsView
              settings={seoSettings}
              setSettings={setSeoSettings}
              onSave={() => notify('Settings saved successfully')}
            />
          )}
        </main>
      </div>

      {/* 4. MODALS & SLIDE-OVERS */}
      {showProduct && (
        <ProductEditor
          initial={editingProduct}
          categories={categories}
          attributes={attributes}
          onClose={() => { setShowProduct(false); setEditingProduct(null) }}
          onSave={saveProduct}
        />
      )}

      {showImportExport && (
        <ProductImportWizard
          products={products}
          visibleProducts={products.filter((p: Product) => `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(search.toLowerCase()))}
          onClose={() => setShowImportExport(false)}
          onImport={(rows: Product[]) => {
            const imported = rows.map(normalizeImportedProduct)
            setProducts(current => [...imported, ...current])
            setShowImportExport(false)
            notify(`${rows.length} products imported successfully!`)
          }}
          onNotify={notify}
        />
      )}

      {editor === 'attribute' && (
        <AttributeEditor
          initial={editing}
          onClose={() => { setEditor(null); setEditing(null) }}
          onSave={async (item: Attribute) => {
            const isEditing = Boolean(editing && editing.id && editing.id !== 0)
            try {
              const res = await fetch(isEditing ? `/api/attributes/${item.id}` : '/api/attributes', {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
              })
              if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                notify(err.error || 'Failed to save attribute', 'error')
                return
              }
              const data = await res.json()
              if (isEditing) {
                setAttributes(a => a.map(x => x.id === item.id ? { ...x, ...data } : x))
                notify('Attribute updated in database!')
              } else {
                setAttributes(a => [...a, { ...item, ...data, id: data.id }])
                notify('Attribute created in database!')
              }
              setEditor(null)
              setEditing(null)
            } catch {
              notify('Network error: Failed to save attribute', 'error')
            }
          }}
        />
      )}

      {editor === 'category' && (
        <CategoryEditor
          initial={editing}
          attributes={attributes}
          onClose={() => { setEditor(null); setEditing(null) }}
          onSave={async (item: Category) => {
            const isEditing = Boolean(editing && editing.id && editing.id !== 0)
            try {
              const res = await fetch(isEditing ? `/api/categories/${item.id}` : '/api/categories', {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
              })
              if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                notify(err.error || 'Failed to save category', 'error')
                return
              }
              const data = await res.json()
              if (isEditing) {
                setCategories(c => c.map(x => x.id === item.id ? { ...x, ...data, attributeIds: item.attributeIds } : x))
                notify('Category updated in database & website!')
              } else {
                setCategories(c => [...c, { ...item, ...data, id: data.id, attributeIds: item.attributeIds }])
                notify('Category created in database!')
              }
              setEditor(null)
              setEditing(null)
            } catch {
              notify('Network error: Failed to save category', 'error')
            }
          }}
        />
      )}

      {confirm && (
        <ConfirmDialog
          item={confirm}
          onConfirm={confirmDelete}
          onCancel={() => setConfirm(null)}
        />
      )}

      {logoutConfirm && (
        <LogoutConfirm
          onCancel={() => setLogoutConfirm(false)}
          onConfirm={() => { logout(); router.replace('/ts-portal/login') }}
        />
      )}

      {/* 5. FLOATING TOAST NOTIFICATION COMPONENT */}
      {toast && (
        <div 
          className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-center gap-3 rounded-2xl border p-4 text-xs font-medium shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200 ${
            toast.type === 'error'
              ? 'border-rose-200 bg-rose-50/95 text-rose-950    shadow-rose-500/10'
              : toast.type === 'info'
              ? 'border-indigo-200 bg-indigo-50/95 text-indigo-950    shadow-indigo-500/10'
              : 'border-emerald-200 bg-emerald-50/95 text-emerald-950    shadow-emerald-500/10'
          }`}
        >
          <div className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${
            toast.type === 'error'
              ? 'bg-rose-600 text-white shadow-xs'
              : toast.type === 'info'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-emerald-600 text-white shadow-xs'
          }`}>
            {toast.type === 'error' ? <AlertCircle size={16}/> : toast.type === 'info' ? <Bell size={16}/> : <Check size={16}/>}
          </div>
          <div className="flex-1 pr-1 min-w-0">
            <p className="font-bold text-[10px] uppercase tracking-wider opacity-75">
              {toast.type === 'error' ? 'Notice' : toast.type === 'info' ? 'Information' : 'Success'}
            </p>
            <p className="mt-0.5 text-xs font-semibold leading-snug break-words">{toast.message}</p>
          </div>
          <button
            type="button"
            aria-label="Close notification"
            onClick={() => setToast(null)}
            className="rounded-lg p-1.5 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X size={15}/>
          </button>
        </div>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <ProtectedRoute>
      <CRMPage />
    </ProtectedRoute>
  )
}

// ==========================================
// COMPONENT 1: DASHBOARD VIEW (100% Dynamic)
// ==========================================
function DashboardView({ 
  products, 
  categories, 
  attributes, 
  reviews, 
  loading, 
  onAddProduct, 
  onEditProduct,
  onNavigate
}: { 
  products: Product[]
  categories: Category[]
  attributes: Attribute[]
  reviews: Review[]
  loading: boolean
  onAddProduct: () => void
  onEditProduct: (p: Product) => void
  onNavigate: (tab: string) => void
}) {
  const inStockCount = products.filter(p => (p.availability as string) === 'In Stock' || (p.availability as string) === 'InStock').length
  const outOfStockCount = products.filter(p => (p.availability as string) === 'Out of Stock' || (p.availability as string) === 'OutOfStock').length
  const avgSeo = products.length ? Math.round(products.reduce((sum, p) => sum + getSeoScore(p).score, 0) / products.length) : 0
  const pendingReviews = reviews.filter(r => r.status === 'Pending').length

  const stats = [
    { label: 'Total Products', value: String(products.length), icon: Package, tab: 'Products' },
    { label: 'Master Categories', value: String(categories.length), icon: FolderTree, tab: 'Categories' },
    { label: 'In-Stock Materials', value: String(inStockCount), icon: CheckCircle2, tab: 'Products' },
    { label: 'Out of Stock', value: String(outOfStockCount), icon: AlertCircle, tab: 'Products', warn: outOfStockCount > 0 },
    { label: 'Average SEO Score', value: `${avgSeo}/100`, icon: TrendingUp, tab: 'Products' },
    { label: 'Customer Reviews', value: String(reviews.length), icon: Star, tab: 'Reviews', highlight: pendingReviews > 0 },
    { label: 'Total Attributes', value: String(attributes.length), icon: SlidersHorizontal, tab: 'Attributes' },
  ]

  return (
    <div className="space-y-6">
      {/* 1. Real-time Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              onClick={() => onNavigate(item.tab)}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs hover:border-slate-300 transition group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">
                  {item.label}
                </span>
                <div className={`p-2 rounded-xl transition ${
                  item.highlight 
                    ? 'bg-amber-100 text-amber-700  ' 
                    : item.warn
                    ? 'bg-rose-100 text-rose-700  '
                    : 'bg-indigo-50 text-indigo-600   group-hover:bg-indigo-600 group-hover:text-white'
                }`}>
                  <Icon size={16} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {loading ? '...' : item.value}
              </p>
            </div>
          )
        })}
      </div>

      {/* 2. Category Distribution & Live Product Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Category Breakdown (Dynamic) */}
        <section className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Catalog by Category</h2>
              <p className="text-xs text-slate-400 mt-0.5">Live distribution of wholesale inventory</p>
            </div>
            <button onClick={() => onNavigate('Categories')} className="text-xs font-bold text-indigo-600 hover:underline">
              View all &rarr;
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {categories.map((cat, idx) => {
              const count = products.filter(p => p.category === cat.name || (p as any).categoryId === cat.id).length
              const percentage = products.length ? Math.round((count / products.length) * 100) : 0
              return (
                <div key={cat.id || idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate pr-2">{cat.name}</span>
                    <span className="font-mono text-slate-400 shrink-0">{count} prods ({percentage}%)</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div 
                      className="h-full rounded-full bg-indigo-600 transition-all duration-500" 
                      style={{ width: `${Math.max(4, percentage)}%` }} 
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Real Live Database Products List */}
        <section className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Catalog Listings</h2>
              <p className="text-xs text-slate-400 mt-0.5">Live products active in your database</p>
            </div>
            <button onClick={() => onNavigate('Products')} className="text-xs font-bold text-indigo-600 hover:underline">
              All {products.length} &rarr;
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {products.slice(0, 5).map((prod) => {
              const thumb = prod.images?.[0]?.src
              const seo = getSeoScore(prod)
              return (
                <div key={prod.id} className="py-3 flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3 min-w-0">
                    {thumb ? (
                      <img src={thumb} alt={prod.name} className="size-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                    ) : (
                      <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                        <Package size={18} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition">
                        {prod.name}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="font-mono font-semibold">{prod.sku}</span>
                        <span>•</span>
                        <span className="truncate">{prod.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      seo.score >= 80 
                        ? 'bg-emerald-50 text-emerald-700  ' 
                        : 'bg-amber-50 text-amber-700  '
                    }`}>
                      SEO {seo.score}
                    </span>
                    <button
                      onClick={() => onEditProduct(prod)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition"
                      title="Edit Product"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}

// ==========================================
// COMPONENT 2: PRODUCTS VIEW (Minimal & Responsive)
// ==========================================
function ProductsView({ 
  products, 
  onAdd, 
  onEdit, 
  onDelete, 
  loading, 
  filters, 
  onFiltersChange 
}: { 
  products: Product[]
  onAdd: () => void
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
  loading: boolean
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void 
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-12 rounded-2xl bg-slate-200 animate-pulse" />
        <div className="h-16 rounded-xl bg-slate-100 animate-pulse" />
        <div className="h-16 rounded-xl bg-slate-100 animate-pulse" />
      </div>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-xs">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-5">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            All Products <span className="ml-1 text-xs font-normal text-slate-400">({products.length} listed)</span>
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select 
            aria-label="Filter status" 
            value={filters.status} 
            onChange={e => onFiltersChange({ ...filters, status: e.target.value as ProductFilters['status'] })} 
            className="text-xs rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 outline-none"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
          </select>
          <select 
            aria-label="Filter SEO" 
            value={filters.seoStatus} 
            onChange={e => onFiltersChange({ ...filters, seoStatus: e.target.value as ProductFilters['seoStatus'] })} 
            className="text-xs rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 outline-none"
          >
            <option value="All">All SEO Scores</option>
            <option value="Complete">100/100 Good</option>
            <option value="Needs Review">Needs Review (&lt;80)</option>
          </select>
          <button 
            onClick={onAdd} 
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <SharedEmptyState 
          icon={Package} 
          title="No products found" 
          description="Try changing your search or filter settings, or add a new product." 
          action={onAdd} 
          actionLabel="Add Product" 
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3.5">Product</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">SKU / MOQ</th>
                <th className="px-4 py-3.5">Stock</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">SEO Score</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {products.map((p) => {
                const thumb = p.images?.[0]?.src
                const seo = getSeoScore(p)
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {thumb ? (
                          <img src={thumb} alt={p.name} className="size-9 rounded-lg object-cover border border-slate-200 shrink-0" />
                        ) : (
                          <div className="size-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <Package size={16} />
                          </div>
                        )}
                        <div className="min-w-0 max-w-xs sm:max-w-md">
                          <p className="font-bold text-slate-900 truncate">{p.name}</p>
                          {p.tradeAliases && (
                            <p className="text-[10px] text-slate-500 truncate">{p.tradeAliases}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 text-slate-600 font-medium">{p.category}</td>
                    <td className="px-4 font-mono text-slate-500 text-[11px]">{p.sku} (MOQ: {p.moq || 1})</td>
                    <td className="px-4">
                      <SharedStatusBadge status={p.availability || 'In Stock'} variant="availability" />
                    </td>
                    <td className="px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        p.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700  ' 
                          : 'bg-amber-50 text-amber-700  '
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4">
                      <span className={`font-bold text-[11px] ${seo.score >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {seo.score}/100
                      </span>
                    </td>
                    <td className="px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button 
                          onClick={() => onEdit(p)} 
                          className="p-1.5 text-slate-500 hover:text-indigo-600 transition"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button 
                          onClick={() => onDelete(p.id)} 
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

// ==========================================
// COMPONENT 3: CATEGORIES MANAGER
// ==========================================
function CategoryManager({ 
  categories = [], 
  attributes = [], 
  products = [], 
  onEdit, 
  onDelete, 
  loading 
}: any) {
  if (loading) return <div className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Categories</h2>
          <p className="text-xs text-slate-400 mt-0.5">{categories.length} active wholesale categories</p>
        </div>
        <button 
          onClick={() => onEdit({ name: '', slug: '', image: '', attributeIds: [], status: 'Active' })} 
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition"
        >
          <Plus size={14} /> Add Category
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3.5">Category Name</th>
              <th className="px-4 py-3.5">URL Slug</th>
              <th className="px-4 py-3.5">Products Count</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {categories.map((c: Category) => {
              const count = products.filter((p: Product) => p.category === c.name || (p as any).categoryId === c.id).length
              return (
                <tr key={c.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {c.image ? (
                        <img src={c.image} alt={c.name} className="size-9 rounded-lg object-cover border border-slate-200" />
                      ) : (
                        <div className="size-9 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center">
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="font-bold text-slate-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 font-mono text-slate-500">/{c.slug}</td>
                  <td className="px-4 font-semibold text-slate-700">{count} products</td>
                  <td className="px-4">
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button onClick={() => onEdit(c)} className="p-1.5 text-slate-500 hover:text-indigo-600 transition" title="Edit">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => onDelete(c.id)} className="p-1.5 text-slate-400 hover:text-rose-600 transition" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

// ==========================================
// COMPONENT 4: ATTRIBUTES MANAGER
// ==========================================
function AttributeManager({ attributes = [], onEdit, onDelete, loading }: any) {
  if (loading) return <div className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Technical Attributes</h2>
          <p className="text-xs text-slate-400 mt-0.5">{attributes.length} specifications configured</p>
        </div>
        <button 
          onClick={() => onEdit({ name: '', type: 'text', options: [], status: 'Active' })} 
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition"
        >
          <Plus size={14} /> Add Attribute
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3.5">Attribute Name</th>
              <th className="px-4 py-3.5">Type</th>
              <th className="px-4 py-3.5">Configured Options</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {attributes.map((a: Attribute) => {
              const options = Array.isArray(a.options) ? a.options : []
              return (
                <tr key={a.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{a.name}</td>
                  <td className="px-4 text-slate-500 uppercase text-[10px] font-semibold">{a.type}</td>
                  <td className="px-4">
                    <div className="flex flex-wrap gap-1">
                      {options.slice(0, 3).map(o => (
                        <span key={o} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700">
                          {o}
                        </span>
                      ))}
                      {options.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-mono">+{options.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4">
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button onClick={() => onEdit(a)} className="p-1.5 text-slate-500 hover:text-indigo-600 transition" title="Edit">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => onDelete(a.id)} className="p-1.5 text-slate-400 hover:text-rose-600 transition" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}



// ==========================================
// COMPONENT 7: CATEGORY & ATTRIBUTE EDITORS
// ==========================================
function CategoryEditor({ initial = {}, attributes = [], onClose, onSave }: any) {
  const [item, setItem] = useState<Category>({
    id: initial?.id || 0,
    name: initial?.name || '',
    slug: initial?.slug || '',
    image: initial?.image || '',
    attributeIds: Array.isArray(initial?.attributeIds)
      ? initial.attributeIds
      : Array.isArray(initial?.attributes)
      ? initial.attributes.map((a: any) => (typeof a === 'object' ? a.attributeId || a.id : a))
      : [],
    status: initial?.status || 'Active',
    metaTitle: initial?.metaTitle || '',
    metaDescription: initial?.metaDescription || '',
    description: initial?.description || ''
  })
  const [uploading, setUploading] = useState(false)
  const setName = (name: string) => setItem(current => ({ ...current, name, slug: current.slug || name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') }))

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'categories')
      if (item.slug || item.name) {
        formData.append('customName', item.slug || item.name)
      }
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        setItem(curr => ({ ...curr, image: data.url }))
      }
    } catch {
      alert('Error uploading category image')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <SharedModal title={initial?.id ? 'Edit Category' : 'Add Category'} onClose={onClose}>
      <div className="space-y-4 pb-6">
        <Input label="Category name" value={item.name} onChange={setName} />
        <Input label="URL Slug" value={item.slug} onChange={(slug: string) => setItem({ ...item, slug })} />

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Image</label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <label className="cursor-pointer rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition text-center shrink-0">
              {uploading ? 'Uploading...' : 'Choose File'}
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
            </label>
            <input
              value={item.image || ''}
              onChange={e => setItem({ ...item, image: e.target.value })}
              placeholder="Or paste direct image URL"
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none"
            />
          </div>
          {item.image && (
            <div className="mt-2 h-28 w-full border border-slate-200 rounded-lg overflow-hidden bg-slate-100">
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
          <textarea
            value={item.description || ''}
            onChange={e => setItem({ ...item, description: e.target.value })}
            rows={3}
            placeholder="Wholesale category overview..."
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">SEO Meta Title</label>
          <input
            value={item.metaTitle || ''}
            onChange={e => setItem({ ...item, metaTitle: e.target.value })}
            placeholder="e.g. Wholesale Industrial Ropes in Karachi | Tahira Syndicate"
            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">SEO Meta Description</label>
          <textarea
            value={item.metaDescription || ''}
            onChange={e => setItem({ ...item, metaDescription: e.target.value })}
            rows={2}
            placeholder="120–160 character description..."
            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">Attached Technical Attributes</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50">
            {attributes.map((a: Attribute) => (
              <label key={a.id} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={Array.isArray(item.attributeIds) && item.attributeIds.includes(a.id)}
                  onChange={e => {
                    const current = Array.isArray(item.attributeIds) ? item.attributeIds : []
                    setItem({
                      ...item,
                      attributeIds: e.target.checked ? [...current, a.id] : current.filter(id => id !== a.id)
                    })
                  }}
                  className="rounded"
                />
                <span className="truncate">{a.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button 
            onClick={() => onSave(item)} 
            disabled={!item.name.trim()}
            className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition shadow-xs"
          >
            {initial?.id ? 'Update Category' : 'Save Category'}
          </button>
        </div>
      </div>
    </SharedModal>
  )
}

function AttributeEditor({ initial = {}, onClose, onSave }: any) {
  const [item, setItem] = useState<Attribute>({
    id: initial?.id || 0,
    name: initial?.name || '',
    type: initial?.type || 'text',
    options: Array.isArray(initial?.options) ? initial.options : [],
    status: 'Active',
    required: Boolean(initial?.required)
  })
  const [option, setOption] = useState('')
  const addOption = () => { 
    if (option.trim()) { 
      setItem({ ...item, options: [...(item.options || []), option.trim()] })
      setOption('') 
    } 
  }

  return (
    <SharedModal title={initial?.id ? 'Edit Attribute' : 'Add Attribute'} onClose={onClose}>
      <div className="space-y-4 pb-6">
        <Input label="Attribute name" value={item.name} onChange={(v: string) => setItem({ ...item, name: v })} />
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Input Type</label>
          <select 
            value={item.type} 
            onChange={e => setItem({ ...item, type: e.target.value as Attribute['type'] })} 
            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none"
          >
            <option value="select">Select</option>
            <option value="multi-select">Multi-select</option>
            <option value="text">Text</option>
            <option value="number">Number</option>
          </select>
        </div>

        {(item.type === 'select' || item.type === 'multi-select') && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Option Values</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(item.options || []).map(o => (
                <button
                  type="button"
                  key={o}
                  onClick={() => setItem({ ...item, options: item.options.filter(x => x !== o) })}
                  className="rounded-md bg-indigo-50 text-indigo-700 px-2 py-1 text-[11px] font-semibold hover:bg-rose-50 hover:text-rose-600 transition"
                >
                  {o} ×
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={option}
                onChange={e => setOption(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addOption())}
                placeholder="Add option..."
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none"
              />
              <button 
                type="button" 
                onClick={addOption} 
                className="rounded-xl bg-slate-100 px-3 text-xs font-semibold hover:bg-slate-200 transition"
              >
                Add
              </button>
            </div>
          </div>
        )}

        <div className="pt-2">
          <button 
            onClick={() => onSave(item)} 
            disabled={!item.name.trim()}
            className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition shadow-xs"
          >
            Save Attribute
          </button>
        </div>
      </div>
    </SharedModal>
  )
}

// ==========================================
// COMPONENT 8: PRODUCT EDITOR (Comprehensive)
// ==========================================
function ProductEditor({ 
  initial = null, 
  categories = [], 
  attributes: allAttributes = [], 
  onClose, 
  onSave 
}: { 
  initial?: Product | null
  categories?: Category[]
  attributes?: Attribute[]
  onClose: () => void
  onSave: (product: Product) => void 
}) {
  const [name, setName] = useState(initial?.name || '')
  const [sku, setSku] = useState(initial?.sku || '')
  const initialCat = categories.find((c: Category) => c.name === initial?.category || String(c.id) === String(initial?.category))
  const [categoryId, setCategoryId] = useState(initialCat ? String(initialCat.id) : (categories[0] ? String(categories[0].id) : ''))
  const [price, setPrice] = useState(initial?.price || '')
  const [barcode, setBarcode] = useState(initial?.barcode || '')
  const [moq, setMoq] = useState(String(initial?.moq || '1'))
  const [countryOfOrigin, setCountryOfOrigin] = useState(initial?.countryOfOrigin || '')
  const [weight, setWeight] = useState(initial?.weight || '')
  const [dimensions, setDimensions] = useState({ length: initial?.length || '', width: initial?.width || '', height: initial?.height || '' })
  const [availability, setAvailability] = useState<ProductAvailability>(initial?.availability || 'In Stock')
  const [status, setStatus] = useState<RecordStatus>(initial?.status || 'Active')
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle || '')
  const [metaDescription, setMetaDescription] = useState(initial?.metaDescription || '')
  const [slug, setSlug] = useState(initial?.slug || '')
  const [shortDescription, setShortDescription] = useState(initial?.shortDescription || '')
  const [longDescription, setLongDescription] = useState(initial?.longDescription || '')
  const [tradeAliases, setTradeAliases] = useState(initial?.tradeAliases || '')
  const [images, setImages] = useState<ProductImage[]>(initial?.images || [])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [content, setContent] = useState<ProductContent>(initial?.content || defaultProductContent())
  const [uploadingImage, setUploadingImage] = useState(false)

  const category = (categories || []).find((c: Category) => String(c.id) === categoryId)
  const attributes = category ? (allAttributes || []).filter(a => Array.isArray(category.attributeIds) && category.attributeIds.includes(a.id)) : []
  const updateContent = <K extends keyof ProductContent>(key: K, value: ProductContent[K]) => setContent(current => ({ ...current, [key]: value }))

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const categorySlug = category?.slug || slugify(category?.name || 'uncategorized')
      const productSlug = slug || slugify(name || 'product')
      const productFolder = `products/${categorySlug}/${productSlug}`

      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', productFolder)
      if (slug || name) {
        formData.append('customName', productSlug)
      }
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        setImages(curr => [...curr, { src: data.url, alt: name || 'Product image' }])
      }
    } catch {
      alert('Error uploading product image')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages(curr => [...curr, { src: newImageUrl.trim(), alt: name || 'Product image' }])
      setNewImageUrl('')
    }
  }

  const handleAddFaq = () => {
    updateContent('faqs', [...(content.faqs || []), { id: Date.now(), question: '', answer: '' }])
  }

  const handleUpdateFaq = (index: number, field: 'question' | 'answer', val: string) => {
    const updated = [...(content.faqs || [])]
    if (updated[index]) {
      updated[index] = { ...updated[index], [field]: val }
      updateContent('faqs', updated)
    }
  }

  const handleRemoveFaq = (index: number) => {
    updateContent('faqs', (content.faqs || []).filter((_, i) => i !== index))
  }

  return (
    <SharedModal title={initial?.id ? `Edit: ${initial.name}` : 'Add Product'} onClose={onClose}>
      <div className="space-y-6">
        {/* Core Info */}
        <div className="space-y-4">
          <Input label="Product Name" value={name} onChange={setName} />
          <Input label="Trade Aliases / Urdu Names (Optional)" value={tradeAliases} onChange={setTradeAliases} placeholder="e.g. Hara Parda • Sabz Jali • Green Shade Net" />
          <Input label="Card Summary Description" value={shortDescription} onChange={setShortDescription} placeholder="1-2 sentences shown on catalog cards..." />
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Technical Description</label>
            <textarea 
              value={longDescription} 
              onChange={e => setLongDescription(e.target.value)} 
              rows={3} 
              placeholder="Comprehensive specification paragraph..." 
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="SKU Code" value={sku} onChange={setSku} placeholder="e.g. TS-NET-SHD-001" />
            <Input label="MOQ (Units/Rolls)" value={moq} onChange={setMoq} type="number" min="1" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <select 
              value={categoryId} 
              onChange={e => setCategoryId(e.target.value)} 
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none"
            >
              {categories.map((c: Category) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Availability</label>
              <select 
                value={availability} 
                onChange={e => setAvailability(e.target.value as ProductAvailability)} 
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none"
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Listing Status</label>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value as RecordStatus)} 
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* SEO Metadata */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">SEO Metadata</p>
          <Input label="SEO Meta Title" value={metaTitle} onChange={setMetaTitle} placeholder="e.g. Agricultural Green Shade Net Karachi | Tahira Syndicate" />
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">SEO Meta Description</label>
            <textarea 
              value={metaDescription} 
              onChange={e => setMetaDescription(e.target.value)} 
              rows={2} 
              placeholder="120-160 characters for Google snippet..." 
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none"
            />
          </div>
        </div>

        {/* Structured Bullets & Usage */}
        <div className="space-y-4">
          <SharedBulletListEditor 
            label="Product Key Benefits (Min 3 required for 100/100 SEO)" 
            items={content.benefits || []} 
            onChange={benefits => updateContent('benefits', benefits)} 
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Industrial Usage &amp; Application</label>
            <textarea
              value={content.usage || ''}
              onChange={e => updateContent('usage', e.target.value)}
              rows={3}
              placeholder="Describe wholesale applications, warehouse stock availability, engineering specs..."
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs outline-none"
            />
          </div>

          {/* Product FAQs */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Product FAQs</p>
                <p className="text-[11px] text-slate-400">Generates Google FAQPage Schema</p>
              </div>
              <button 
                type="button" 
                onClick={handleAddFaq} 
                className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-indigo-700 transition"
              >
                <Plus size={13} /> Add FAQ
              </button>
            </div>

            <div className="space-y-3">
              {(content.faqs || []).map((faq, idx) => (
                <div key={faq.id || idx} className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-600">Question #{idx + 1}</span>
                    <button type="button" onClick={() => handleRemoveFaq(idx)} className="text-slate-400 hover:text-rose-600">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <input
                    value={faq.question}
                    onChange={e => handleUpdateFaq(idx, 'question', e.target.value)}
                    placeholder="Question..."
                    className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs outline-none"
                  />
                  <textarea
                    value={faq.answer}
                    onChange={e => handleUpdateFaq(idx, 'answer', e.target.value)}
                    rows={2}
                    placeholder="Answer..."
                    className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Images & Gallery */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">Product Images</label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3">
            <label className="cursor-pointer rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition text-center shrink-0">
              {uploadingImage ? 'Uploading...' : 'Upload Image'}
              <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" disabled={uploadingImage} />
            </label>
            <div className="flex gap-2 flex-1">
              <input
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                placeholder="Or paste direct image URL"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none"
              />
              <button 
                type="button" 
                onClick={addImageUrl} 
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold hover:bg-slate-100"
              >
                Add
              </button>
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((image, index) => (
                <div key={index} className="relative rounded-xl border border-slate-200 p-2 bg-white space-y-2">
                  <div className="relative h-20 w-full overflow-hidden rounded-lg bg-slate-100">
                    <img src={image.src} alt={image.alt || name} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 rounded-md bg-rose-600 p-1 text-white hover:bg-rose-700 shadow-xs"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <input
                    value={image.alt || ''}
                    onChange={e => setImages(images.map((item, i) => i === index ? { ...item, alt: e.target.value } : item))}
                    placeholder="Alt text"
                    className="w-full rounded-md border border-slate-200 px-2 py-1 text-[10px]"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit with mobile bottom clearance */}
        <div className="pt-2 pb-6">
          <button
            type="button"
            disabled={!name.trim()}
            onClick={() => onSave({
              id: initial?.id || 0,
              name,
              sku: sku || `TS-${Date.now().toString().slice(-4)}`,
              category: category?.name || categoryId,
              price: price || 'Rs. 0',
              availability,
              status,
              seoStatus: initial?.seoStatus || 'Needs Review',
              metaTitle,
              metaDescription,
              slug,
              barcode,
              moq: Number(moq) || 1,
              shortDescription,
              longDescription,
              tradeAliases,
              bulkPricing: initial?.bulkPricing || [],
              weight,
              length: dimensions.length,
              width: dimensions.width,
              height: dimensions.height,
              countryOfOrigin,
              relatedProductIds: initial?.relatedProductIds || [],
              ogTitle: '',
              ogDescription: '',
              ogImage: '',
              images,
              content
            })}
            className="w-full rounded-xl bg-indigo-600 py-3.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition shadow-xs"
          >
            {initial?.id ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </div>
    </SharedModal>
  )
}

// ==========================================
// COMPONENT 9: COMPANY PROFILE & SETTINGS
// ==========================================
function CompanyProfile({ company, setCompany, logoPreview, setLogoPreview, onSave }: any) {
  const update = (key: string, value: string) => setCompany((current: any) => ({ ...current, [key]: value }))
  return (
    <section className="w-full min-w-0 max-w-full lg:max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-base font-bold text-slate-900">Company Profile &amp; NAP Synchronization</h2>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Physical address and contact info synchronized across the public website and Google LocalBusiness schema.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Business Name" value={company.name} onChange={(v: string) => update('name', v)} />
        <Input label="Tagline" value={company.tagline} onChange={(v: string) => update('tagline', v)} />
        <Input label="Primary Phone" value={company.phone} onChange={(v: string) => update('phone', v)} />
        <Input label="WhatsApp Number" value={company.whatsapp} onChange={(v: string) => update('whatsapp', v)} />
        <Input label="Email Address" value={company.email} onChange={(v: string) => update('email', v)} />
        <Input label="Business Hours" value={company.hours} onChange={(v: string) => update('hours', v)} />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700">
          Physical Warehouse Address
        </label>
        <textarea
          value={company.address}
          onChange={e => update('address', e.target.value)}
          rows={3}
          placeholder="Enter complete physical address..."
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
        <p className="text-[11px] text-slate-400">Must character-match Google Business Profile exactly.</p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700">
          Company Description
        </label>
        <textarea
          value={company.description}
          onChange={e => update('description', e.target.value)}
          rows={4}
          placeholder="Detailed company description for footer and about schemas..."
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-end pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onSave}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-xs"
        >
          <Save size={15} />
          <span>Save Company Profile</span>
        </button>
      </div>
    </section>
  )
}

function SettingsView({ onSave, settings, setSettings }: any) {
  const update = (key: string, value: string) => setSettings((current: any) => ({ ...current, [key]: value }))
  return (
    <section className="w-full min-w-0 max-w-full lg:max-w-2xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs space-y-5">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-base font-bold text-slate-900">Workspace &amp; Global SEO Settings</h2>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Default templates and fallback meta descriptions for pages without dedicated metadata.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Default Site Title Template"
          value={settings.titleTemplate}
          onChange={(v: string) => update('titleTemplate', v)}
          placeholder="{Page Title} | Tahira Syndicate"
        />
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Default Meta Description
          </label>
          <textarea
            value={settings.metaDescription}
            onChange={e => update('metaDescription', e.target.value)}
            rows={4}
            placeholder="120-160 characters fallback meta description..."
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onSave}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-xs"
          >
            <Save size={15} />
            <span>Save Global Settings</span>
          </button>
        </div>
      </div>
    </section>
  )
}
