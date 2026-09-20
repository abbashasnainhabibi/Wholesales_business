'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import type { ServiceFaq } from '@/lib/data/services'

interface ServiceFaqAccordionProps {
  faqs: ServiceFaq[]
  serviceTitle: string
}

export function ServiceFaqAccordion({ faqs, serviceTitle }: ServiceFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  if (!faqs || faqs.length === 0) {
    return null
  }

  return (
    <div className="divide-y divide-slate-200 rounded-none border border-slate-200 bg-white">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index
        return (
          <div key={index} className="transition-colors hover:bg-slate-50/50">
            <button
              type="button"
              onClick={() => toggleFaq(index)}
              className="flex w-full items-center justify-between gap-4 p-4 sm:p-5 text-left transition"
              aria-expanded={isOpen}
            >
              <span className="flex items-start gap-3 text-sm sm:text-base font-bold text-[#0F172A]">
                <HelpCircle className="h-5 w-5 shrink-0 text-[#1877F2] mt-0.5" />
                {faq.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-[#1877F2]' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-5 pt-1 sm:px-5 text-xs sm:text-sm leading-relaxed text-slate-600 pl-12">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
