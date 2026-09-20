'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Star, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import type { ReviewItem } from '@/lib/types/crm'
import { resolveMediaUrl } from '@/lib/utils'


interface ReviewsListProps {
  reviews: ReviewItem[]
  title?: string
  emptyMessage?: string
  showRatingSummary?: boolean
  initialLimit?: number
}

export function ReviewsList({
  reviews,
  title = 'Verified Customer Reviews',
  emptyMessage = 'No customer reviews published yet. Be the first to share your experience!',
  showRatingSummary = true,
  initialLimit = 8,
}: ReviewsListProps) {
  const [displayLimit, setDisplayLimit] = useState(initialLimit)
  const count = reviews.length

  const avgRating = useMemo(() => {
    return count > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / count).toFixed(1)
      : '5.0'
  }, [reviews, count])

  const visibleReviews = useMemo(() => {
    return reviews.slice(0, displayLimit)
  }, [reviews, displayLimit])

  const hasMore = count > displayLimit

  const handleShowMore = () => {
    setDisplayLimit((prev) => prev + 8)
  }

  const handleShowLess = () => {
    setDisplayLimit(initialLimit)
  }

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="w-full">
      {/* Rating Summary Header Card (Zero border-radius) */}
      {showRatingSummary && count > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-none border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
          <div>
            <h3 className="font-heading text-base sm:text-lg font-black text-[#0F172A]">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Based on {count} verified review{count > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-heading text-3xl font-black text-[#0F172A]">{avgRating}</span>
            <div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={
                      star <= Math.round(Number(avgRating))
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }
                  />
                ))}
              </div>
              <p className="text-[11px] font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                <CheckCircle2 size={12} /> 100% Verified Submissions
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Grid: 1 col on mobile, 3 cols on tablet (md), 4 cols on larger desktop (xl) */}
      {count === 0 ? (
        <div className="rounded-none border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
          <p className="text-xs sm:text-sm text-slate-500">{emptyMessage}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {visibleReviews.map((review) => (
              <article
                key={review.id}
                className="flex flex-col justify-between rounded-none border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-slate-400 transition"
              >
                <div>
                  {/* Rating Stars + Date */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={13}
                          className={
                            star <= review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }
                        />
                      ))}
                      <span className="ml-1 text-[11px] font-black text-[#0F172A]">
                        {review.rating}.0
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-700 line-clamp-4 whitespace-pre-line mb-3.5">
                    &ldquo;{review.message}&rdquo;
                  </p>

                  {/* Optional Review Image (Zero border-radius) */}
                  {review.imageUrl && (
                    <div className="relative mb-3.5 h-32 w-full overflow-hidden rounded-none border border-slate-200 bg-slate-100">
                      <Image
                        src={resolveMediaUrl(review.imageUrl)}
                        alt={`Review photo from ${review.name}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                  )}

                </div>

                {/* Author Footer (Zero border-radius) */}
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-none bg-slate-100 font-black text-xs text-[#0F172A] border border-slate-200">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-[#0F172A] truncate">
                        {review.name}
                      </p>
                      <p className="text-[10px] text-slate-400">Verified Client</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Pagination / Limit Controls */}
          {count > initialLimit && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="text-xs font-semibold text-slate-500 w-full text-center">
                Showing {visibleReviews.length} of {count} reviews
              </span>
              {hasMore ? (
                <button
                  type="button"
                  onClick={handleShowMore}
                  className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-slate-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-[#0F172A] shadow-2xs hover:bg-slate-50 hover:border-slate-400 transition"
                >
                  Load More Reviews ({count - visibleReviews.length} remaining)
                  <ChevronDown size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleShowLess}
                  className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Show Less
                  <ChevronUp size={14} />
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
