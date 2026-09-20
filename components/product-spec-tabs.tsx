'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, HelpCircle, Truck, Sparkles, ShieldCheck } from 'lucide-react'
import type { ProductItem } from '@/lib/types/crm'
import { specLabel, specValue, bodyText, bulletHighlight } from '@/lib/typography'

export function ProductSpecTabs({ product }: { product: ProductItem }) {
  const [activeTab, setActiveTab] = useState<'specs' | 'applications' | 'freight' | 'faqs'>('specs')

  const hasBenefits = product.benefits && product.benefits.length > 0
  const hasSuited = product.suitedFor && product.suitedFor.length > 0
  const hasNotSuited = product.notSuitedFor && product.notSuitedFor.length > 0
  const hasFaqs = product.faqs && product.faqs.length > 0

  return (
    <div className="rounded-none border border-slate-200 bg-white p-4 sm:p-6 md:p-8 shadow-xs">
      {/* Tab Buttons: 2 rows of 2 on mobile (grid-cols-2), 4 in a line on larger screens (lg:grid-cols-4) */}
      <div className={`grid ${hasFaqs ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'} gap-2 sm:gap-2.5 border-b border-slate-200 pb-3 sm:pb-4`}>
        <button
          type="button"
          onClick={() => setActiveTab('specs')}
          className={`w-full flex items-center justify-center text-center px-2.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold tracking-tight transition cursor-pointer ${
            activeTab === 'specs'
              ? 'bg-[#1877F2] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
          }`}
        >
          1. Specifications
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('applications')}
          className={`w-full flex items-center justify-center text-center px-2.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold tracking-tight transition cursor-pointer ${
            activeTab === 'applications'
              ? 'bg-[#1877F2] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
          }`}
        >
          2. Applications
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('freight')}
          className={`w-full flex items-center justify-center text-center px-2.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold tracking-tight transition cursor-pointer ${
            activeTab === 'freight'
              ? 'bg-[#1877F2] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
          }`}
        >
          3. Freight &amp; Logistics
        </button>

        {hasFaqs && (
          <button
            type="button"
            onClick={() => setActiveTab('faqs')}
            className={`w-full flex items-center justify-center text-center px-2.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold tracking-tight transition cursor-pointer ${
              activeTab === 'faqs'
                ? 'bg-[#1877F2] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            4. Wholesale FAQs
          </button>
        )}
      </div>

      {/* TAB 1: Technical Specifications & Material Quality */}
      {activeTab === 'specs' && (
        <div className="pt-5 sm:pt-6 space-y-5 sm:space-y-6 animate-fadeIn">
          {/* Attributes Grid */}
          {product.attributeValues && product.attributeValues.length > 0 ? (
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3">
                Physical &amp; Chemical Specifications:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {product.attributeValues.map((av, idx) => (
                  <div key={idx} className="rounded-none border border-slate-200 bg-slate-50 p-3.5 sm:p-4">
                    <span className="text-[11px] sm:text-xs uppercase font-bold text-slate-500 tracking-wider block mb-1">
                      {av.attribute?.name || 'Specification'}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-slate-900 block leading-snug break-words">
                      {av.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="rounded-none border border-slate-200 bg-slate-50 p-3.5 sm:p-4">
                <span className={specLabel}>Material Grade</span>
                <span className={`${specValue} mt-1 block`}>100% Virgin Tested</span>
                <span className="text-[11px] sm:text-xs text-slate-500">MFI Certified Batch</span>
              </div>
              <div className="rounded-none border border-slate-200 bg-slate-50 p-3.5 sm:p-4">
                <span className={specLabel}>Origin Standard</span>
                <span className={`${specValue} mt-1 block`}>ASTM / ISO Compatible</span>
                <span className="text-[11px] sm:text-xs text-slate-500">Karachi Port Release</span>
              </div>
              <div className="rounded-none border border-slate-200 bg-slate-50 p-3.5 sm:p-4">
                <span className={specLabel}>Packaging Mode</span>
                <span className={`${specValue} mt-1 block`}>50kg Sacks / Bundles</span>
                <span className="text-[11px] sm:text-xs text-slate-500">Moisture-Proof Liner</span>
              </div>
              <div className="rounded-none border border-slate-200 bg-slate-50 p-3.5 sm:p-4">
                <span className={specLabel}>Weighment Proof</span>
                <span className={`${specValue} mt-1 block`}>Weighbridge Slips</span>
                <span className="text-[11px] sm:text-xs text-[#059669] font-bold">100% Verified</span>
              </div>
            </div>
          )}

          {/* Key Benefits Highlights */}
          {hasBenefits && (
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-[#1877F2]" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Key Material Benefits:
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.benefits!.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-none bg-slate-50 border border-slate-200 p-3 sm:p-3.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-[#059669] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Durability & Application Suitability */}
      {activeTab === 'applications' && (
        <div className="pt-5 sm:pt-6 space-y-5 sm:space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Suited For */}
            {hasSuited && (
              <div className="rounded-none border border-emerald-200 bg-emerald-50/40 p-4 sm:p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-[#059669]" />
                  <h4 className="font-heading text-sm sm:text-base font-black text-slate-900">
                    Recommended Trade Applications
                  </h4>
                </div>
                <ul className="space-y-2 sm:space-y-2.5">
                  {product.suitedFor!.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#059669] shrink-0 mt-2" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Not Suited For */}
            {hasNotSuited && (
              <div className="rounded-none border border-amber-200 bg-amber-50/40 p-4 sm:p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-amber-700" />
                  <h4 className="font-heading text-sm sm:text-base font-black text-slate-900">
                    Technical Limits &amp; Exclusions
                  </h4>
                </div>
                <ul className="space-y-2 sm:space-y-2.5">
                  {product.notSuitedFor!.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-600 shrink-0 mt-2" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Freight & Loading Standards */}
      {activeTab === 'freight' && (
        <div className="pt-5 sm:pt-6 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed animate-fadeIn">
          <p className="text-slate-700 font-medium text-xs sm:text-sm">
            Consignments are loaded directly from our Shahra-e-Liaquat Road central warehouse and SITE industrial depot with certified weighbridge slips.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-1 sm:pt-2">
            <div className="rounded-none border border-slate-200 p-3.5 sm:p-5 bg-slate-50">
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block mb-1">City Fleet</span>
              <span className="text-sm sm:text-base font-black text-slate-900 block mb-1">Shahzore / Mazda (3–6 Tons)</span>
              <p className="text-xs text-slate-600 leading-relaxed">Same-day delivery across Karachi, SITE, Korangi, Landhi, and Hub Industrial Estate.</p>
            </div>
            <div className="rounded-none border border-slate-200 p-3.5 sm:p-5 bg-slate-50">
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block mb-1">Provincial Transit</span>
              <span className="text-sm sm:text-base font-black text-slate-900 block mb-1">Commercial Flatbed (15–25 Tons)</span>
              <p className="text-xs text-slate-600 leading-relaxed">Full truckload dispatch to Hyderabad, Sukkur, Multan, and interior Sindh project sites.</p>
            </div>
            <div className="rounded-none border border-slate-200 p-3.5 sm:p-5 bg-slate-50">
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block mb-1">National Logistics</span>
              <span className="text-sm sm:text-base font-black text-slate-900 block mb-1">40ft Container Freight (28–32 Tons)</span>
              <p className="text-xs text-slate-600 leading-relaxed">Up-country dry port rail and road transit to Lahore, Faisalabad, Islamabad, and Gwadar.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Frequently Asked Questions */}
      {activeTab === 'faqs' && hasFaqs && (
        <div className="pt-5 sm:pt-6 space-y-3 sm:space-y-3.5 animate-fadeIn">
          {product.faqs!.map((faq, i) => (
            <div key={i} className="rounded-none border border-slate-200 bg-slate-50/60 p-3.5 sm:p-5">
              <h4 className="text-sm sm:text-base font-black text-slate-900 mb-1.5">
                {faq.question}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
