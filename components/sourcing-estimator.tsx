'use client'

import { useState, useMemo } from 'react'
import { Calculator, ArrowRight, Phone, CheckCircle2, ShieldCheck, Truck, Scale } from 'lucide-react'
import type { CompanySettings } from '@/lib/types/crm'
import { fallbackSettings } from '@/lib/api/crm'
import {
  siteContainer,
  eyebrowText,
  h2Text,
  bodyLead,
  bodyText,
  ctaButtonWhatsAppLarge,
} from '@/lib/typography'

export function SourcingEstimator({ settings: customSettings, products = [] }: { settings?: CompanySettings; products?: any[] }) {
  const settings = customSettings || fallbackSettings
  const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '')

  const defaultProd = products[0] || { id: 1, name: 'Industrial Material Sourcing', sku: 'MAT-GEN-01', price: 100 }
  const [selectedProductId, setSelectedProductId] = useState<number>(defaultProd.id)
  const [quantity, setQuantity] = useState<number>(50)

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || defaultProd
  }, [products, selectedProductId, defaultProd])

  const calculation = useMemo(() => {
    const qty = Math.max(1, Number(quantity) || 1)

    let tierLabel = 'Standard Wholesale Tier'
    let dispatchVehicle = 'Pickup / Shahzore'
    if (qty >= 200) {
      tierLabel = 'Container / 22-Wheeler Direct Tier'
      dispatchVehicle = '22-Wheeler / 40ft Flatbed'
    } else if (qty >= 50) {
      tierLabel = 'Full Mazda Truckload Tier'
      dispatchVehicle = 'Mazda Titan (6-Wheeler)'
    }

    let estimatedKg = qty * 50
    const sku = selectedProduct.sku || ''
    if (sku.includes('NET') || sku.includes('SHADE')) {
      estimatedKg = qty * 18
    } else if (sku.includes('PIPE')) {
      estimatedKg = qty * 35
    } else if (sku.includes('ROPE')) {
      estimatedKg = qty * 22
    }

    const estimatedTons = (estimatedKg / 1000).toFixed(2)

    return {
      qty,
      tierLabel,
      dispatchVehicle,
      estimatedKg,
      estimatedTons,
    }
  }, [quantity, selectedProduct])

  const waText = `*Wholesale Sourcing Estimate - Tahira Syndicate*\n\n` +
    `*Material:* ${selectedProduct.name} (SKU: ${selectedProduct.sku})\n` +
    `*Quantity:* ${calculation.qty} Units / Bags / Coils\n` +
    `*Estimated Total Weight:* ~${calculation.estimatedTons} Tons (${calculation.estimatedKg.toLocaleString('en-PK')} kg)\n` +
    `*Tier:* ${calculation.tierLabel} (${calculation.dispatchVehicle})\n\n` +
    `Please share formal proforma quotation and delivery schedule for Karachi / SITE warehouse pickup.`

  return (
    <section className={`mx-auto ${siteContainer} py-16`}>
      <div className="rounded-none border border-slate-200 bg-white p-6 sm:p-10 md:p-12 shadow-xs">
        <div className="flex flex-col lg:flex-row gap-10 items-start justify-between">
          {/* Left Column: Heading & Trust Badges */}
          <div className="lg:max-w-md space-y-4">
            <p className={`mb-2 ${eyebrowText}`}>
              Sourcing Tools
            </p>
            <h2 className={h2Text}>
              Estimate Bulk Sourcing &amp; Tonnage
            </h2>
            <p className={`mt-3 ${bodyLead}`}>
              Calculate projected tonnage, container loading capacity, and volume discount tiers before placing your factory order.
            </p>

            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-700">
                <ShieldCheck className="h-5 w-5 text-[#1877F2] shrink-0" />
                <span>Certified Live Weighbridge Slip at Shahra-e-Liaquat Road Hub</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-700">
                <Truck className="h-5 w-5 text-[#1877F2] shrink-0" />
                <span>Mazda, Flatbed &amp; Container Dispatch</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-700">
                <Scale className="h-5 w-5 text-[#1877F2] shrink-0" />
                <span>Tested MFI &amp; Pressure Class Specifications</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Light Industrial Form */}
          <div className="w-full lg:max-w-xl rounded-none border border-slate-200 bg-slate-50/60 p-6 sm:p-8 space-y-5">
            <div className="space-y-4">
              <div>
                <label htmlFor="estimator-product-select" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  1. Select Material
                </label>
                <select
                  id="estimator-product-select"
                  name="product"
                  aria-label="Select wholesale industrial material or product"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(Number(e.target.value))}
                  className="w-full rounded-sm border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-[#0F172A] outline-none focus:border-[#1877F2]"
                >
                  {(products.length > 0 ? products : [defaultProd]).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.category?.name ? `— ${p.category.name}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="estimator-quantity-input" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  2. Required Quantity (Sacks / Lengths / Coils)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="estimator-quantity-input"
                    name="quantity"
                    aria-label="Required order quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full sm:flex-1 rounded-sm border border-slate-300 bg-white px-4 py-3 text-sm font-black text-[#0F172A] outline-none focus:border-[#1877F2]"
                  />
                  <div className="flex gap-1.5 flex-wrap sm:flex-nowrap">
                    {[20, 50, 100, 200].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setQuantity(preset)}
                        className={`flex-1 sm:flex-none rounded-sm px-3 py-2.5 sm:py-2 text-xs font-bold transition ${
                          quantity === preset
                            ? 'bg-[#1877F2] text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {preset}+
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Clean Light Result Card */}
            <div className="rounded-none border border-blue-200 bg-blue-50/60 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                <span className="text-xs text-slate-600 font-semibold">Active Pricing Tier</span>
                <span className="text-xs font-bold text-[#059669]">{calculation.tierLabel}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-slate-500 block uppercase font-bold">Estimated Tonnage</span>
                  <span className="text-2xl font-black text-slate-900">~{calculation.estimatedTons} Tons</span>
                  <span className="text-[10px] text-slate-500 block">({calculation.estimatedKg.toLocaleString()} kg total)</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block uppercase font-bold">Wholesale Rate</span>
                  <span className="text-base sm:text-lg font-black text-[#1877F2] block mt-1">Trade Price on Request</span>
                  <span className="text-[10px] text-slate-500 block">Proforma issued on WhatsApp</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Action */}
            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#25D366] px-3 sm:px-5 py-3.5 text-xs sm:text-sm md:text-base font-bold text-[#0F172A] transition hover:brightness-105 active:scale-95 shadow-xs text-center leading-snug"
            >
              <Phone className="h-4 w-4 shrink-0" /> Send Calculated Estimate to WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
