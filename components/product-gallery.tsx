'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import type { ProductImageItem } from '@/lib/types/crm'
import { resolveMediaUrl } from '@/lib/utils'

interface ProductGalleryProps {
  images?: ProductImageItem[]
  productName: string
}

export function ProductGallery({ images = [], productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const galleryList = images && images.length > 0
    ? images.map((img) => ({
        ...img,
        src: resolveMediaUrl(img.src),
      }))
    : [{ src: resolveMediaUrl(null), alt: productName }]


  const activeImage = galleryList[selectedIndex] || galleryList[0]

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? galleryList.length - 1 : prev - 1))
  }, [galleryList.length])

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === galleryList.length - 1 ? 0 : prev + 1))
  }, [galleryList.length])

  useEffect(() => {
    if (!isLightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false)
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, handlePrev, handleNext])

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Main Image View */}
      <div
        className="group relative h-80 sm:h-[460px] lg:h-[500px] w-full overflow-hidden rounded-none border border-slate-200 bg-slate-100 cursor-zoom-in shadow-xs"
        onClick={() => setIsLightboxOpen(true)}
      >
        <Image
          src={activeImage.src}
          alt={activeImage.alt || `${productName} - View ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 45vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Zoom Indicator Badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-none bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs transition group-hover:bg-[#1877F2]">
          <ZoomIn size={14} />
          <span>Click to Enlarge ({selectedIndex + 1}/{galleryList.length})</span>
        </div>
      </div>

      {/* Thumbnails Row */}
      {galleryList.length > 1 && (
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
          {galleryList.map((img, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative h-20 sm:h-24 overflow-hidden rounded-none border transition ${
                selectedIndex === i
                  ? 'border-2 border-[#1877F2] ring-2 ring-[#1877F2]/20'
                  : 'border-slate-200 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt || `${productName} thumbnail ${i + 1}`}
                fill
                sizes="(max-width: 640px) 25vw, 140px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close lightbox"
            className="absolute top-5 right-5 z-50 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition"
          >
            <X size={24} />
          </button>

          {/* Navigation Controls */}
          {galleryList.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrev()
                }}
                aria-label="Previous image"
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                aria-label="Next image"
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          {/* Large Image Container */}
          <div
            className="relative max-h-[85vh] max-w-5xl w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[70vh] sm:h-[80vh]">
              <Image
                src={activeImage.src}
                alt={activeImage.alt || productName}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {/* Caption & Counter */}
            <div className="mt-3 text-center text-white">
              <p className="text-sm font-semibold">
                {activeImage.alt || productName}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Image {selectedIndex + 1} of {galleryList.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
