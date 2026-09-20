'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { OptimizedVideo } from '@/components/optimized-video'
import type { ServiceMedia } from '@/lib/data/services'

interface ServiceGalleryProps {
  media: ServiceMedia[]
  serviceTitle: string
}

export function ServiceGallery({ media, serviceTitle }: ServiceGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!media || media.length === 0) {
    return null
  }

  const activeItem = media[activeIndex] || media[0]
  const isVideo = activeItem.isVideo || activeItem.src.endsWith('.mp4') || activeItem.src.endsWith('.mov')

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Primary Visual Stage (0px border radius) */}
      <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full overflow-hidden rounded-none border border-slate-200 bg-slate-100 shadow-xs">
        {isVideo ? (
          <OptimizedVideo
            key={activeItem.src}
            src={activeItem.src}
            poster={activeItem.poster}
            ariaLabel={activeItem.alt || serviceTitle}
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            key={activeItem.src}
            src={activeItem.src}
            alt={activeItem.alt || serviceTitle}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition duration-500"
          />
        )}

        {/* Media Badge */}
        <div className="absolute bottom-3 left-3 rounded-none bg-[#0F172A]/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-white">
          {isVideo ? 'Production Video' : 'On-Site Installation'} ({activeIndex + 1}/{media.length})
        </div>
      </div>

      {/* Thumbnails Row (compact fixed-ratio grid, never stretches single thumbnail across 100%) */}
      {media.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {media.map((item, idx) => {
            const isItemVideo = item.isVideo || item.src.endsWith('.mp4') || item.src.endsWith('.mov')
            const thumbSrc = item.poster || item.src
            const isSelected = activeIndex === idx

            return (
              <button
                type="button"
                key={item.src}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Select media ${idx + 1}: ${item.alt || serviceTitle}`}
                className={`relative aspect-[4/3] w-full overflow-hidden rounded-none border transition ${
                  isSelected
                    ? 'border-2 border-[#1877F2] ring-2 ring-[#1877F2]/20'
                    : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'
                }`}
              >
                {isItemVideo && item.poster ? (
                  <Image
                    src={item.poster}
                    alt={item.alt || `${serviceTitle} preview ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 25vw, 150px"
                    className="object-cover"
                  />
                ) : !isItemVideo ? (
                  <Image
                    src={item.src}
                    alt={item.alt || `${serviceTitle} thumbnail ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 25vw, 150px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-100 flex items-center justify-center">
                    <Play className="h-6 w-6 text-slate-400 fill-slate-400" />
                  </div>
                )}

                {/* Video Play Overlay Icon */}
                {isItemVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                    <div className="rounded-full bg-white/90 p-1 shadow-sm">
                      <Play className="h-3.5 w-3.5 text-slate-900 fill-slate-900 ml-0.5" />
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
