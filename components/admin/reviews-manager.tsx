'use client'

import { useState } from 'react'
import type { Review, ReviewStatus } from '@/lib/domain-types'
import { Star, Check, X, Trash2, Eye, Package, Wrench, Globe, Calendar, User, Phone, Mail } from 'lucide-react'
import { EmptyState } from '@/components/admin/shared-ui'

interface ReviewsManagerProps {
  reviews: Review[]
  loading?: boolean
  search: string
  onStatusChange: (id: number, status: ReviewStatus) => void
  onDelete: (id: number) => void
}

export function ReviewsManager({
  reviews,
  loading,
  search,
  onStatusChange,
  onDelete,
}: ReviewsManagerProps) {
  const [selectedStatus, setSelectedStatus] = useState<'All' | ReviewStatus>('All')
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  const filtered = reviews.filter((item) => {
    const matchStatus = selectedStatus === 'All' || item.status === selectedStatus
    const term = search.toLowerCase().trim()
    const matchSearch =
      !term ||
      item.name.toLowerCase().includes(term) ||
      item.message.toLowerCase().includes(term) ||
      (item.contact && item.contact.toLowerCase().includes(term)) ||
      (item.product?.name && item.product.name.toLowerCase().includes(term)) ||
      (item.serviceId && item.serviceId.toLowerCase().includes(term))

    return matchStatus && matchSearch
  })

  const pendingCount = reviews.filter((r) => r.status === 'Pending').length
  const approvedCount = reviews.filter((r) => r.status === 'Approved').length
  const rejectedCount = reviews.filter((r) => r.status === 'Rejected').length

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
    <section className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      {/* Top Filter Header Bar */}
      <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 md:flex-row md:items-center md:justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Customer Reviews</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              {reviews.length}
            </span>
            {pendingCount > 0 && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 animate-pulse">
                {pendingCount} Pending
              </span>
            )}
          </div>
        </div>

        {/* Status Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-slate-100 p-1">
          {(
            [
              { label: 'All', value: 'All', count: reviews.length },
              { label: 'Pending', value: 'Pending', count: pendingCount },
              { label: 'Approved', value: 'Approved', count: approvedCount },
              { label: 'Rejected', value: 'Rejected', count: rejectedCount },
            ] as const
          ).map((tab) => {
            const isActive = selectedStatus === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setSelectedStatus(tab.value)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-md px-1.5 py-0.2 text-[10px] ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 font-bold'
                      : 'bg-slate-200/60 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading reviews...</div>
      ) : filtered.length === 0 ? (
        <div className="p-6 sm:p-10">
          <EmptyState
            icon={Star}
            title="No reviews found"
            description={
              search
                ? `No reviews matching "${search}" in ${selectedStatus} status.`
                : `There are currently no ${selectedStatus !== 'All' ? selectedStatus.toLowerCase() : ''} customer reviews in the database.`
            }
          />
        </div>
      ) : (
        <>
          {/* ==================================================== */}
          {/* 1. MOBILE COMPACT 1-ROW LIST VIEW (< md)             */}
          {/* ==================================================== */}
          <div className="block divide-y divide-slate-100 md:hidden bg-white">
            {filtered.map((item) => {
              const isApproved = item.status === 'Approved'
              const isRejected = item.status === 'Rejected'
              const isPending = item.status === 'Pending'

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2.5 p-3 hover:bg-slate-50 transition"
                >
                  {/* Left Column: Info & Truncated Message */}
                  <div
                    onClick={() => setSelectedReview(item)}
                    className="min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-xs truncate max-w-[130px] sm:max-w-[180px]">
                        {item.name}
                      </span>
                      <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.2 text-[10px] font-bold text-amber-700 border border-amber-200/60 shrink-0">
                        ★ {item.rating}
                      </span>
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700 shrink-0">
                          Approved
                        </span>
                      ) : isRejected ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-1.5 py-0.2 text-[9px] font-bold text-rose-700 shrink-0">
                          Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-1.5 py-0.2 text-[9px] font-bold text-amber-700 shrink-0">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-xs">
                      {item.message}
                    </p>
                  </div>

                  {/* Right Column: Inline Action Buttons (View, Tick, Cross, Trash) */}
                  <div className="flex items-center gap-1 shrink-0">
                    {/* 1. View Detail Button */}
                    <button
                      type="button"
                      title="View review details"
                      aria-label={`View review by ${item.name}`}
                      onClick={() => setSelectedReview(item)}
                      className="flex size-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition shadow-2xs"
                    >
                      <Eye size={13} />
                    </button>

                    {/* 2. Approve (Tick) Button */}
                    {!isApproved && (
                      <button
                        type="button"
                        title="Approve review"
                        aria-label={`Approve review by ${item.name}`}
                        onClick={() => onStatusChange(item.id, 'Approved')}
                        className="flex size-7 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-2xs"
                      >
                        <Check size={13} />
                      </button>
                    )}

                    {/* 3. Reject (Cross) Button */}
                    {!isRejected && (
                      <button
                        type="button"
                        title="Reject review"
                        aria-label={`Reject review by ${item.name}`}
                        onClick={() => onStatusChange(item.id, 'Rejected')}
                        className="flex size-7 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition shadow-2xs"
                      >
                        <X size={13} />
                      </button>
                    )}

                    {/* 4. Delete (Trash) Button */}
                    <button
                      type="button"
                      title="Delete review"
                      aria-label={`Delete review by ${item.name}`}
                      onClick={() => onDelete(item.id)}
                      className="flex size-7 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ==================================================== */}
          {/* 2. DESKTOP TABLE VIEW (>= md)                        */}
          {/* ==================================================== */}
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3.5">Reviewer</th>
                  <th className="px-4 py-3.5">Rating & Feedback</th>
                  <th className="px-4 py-3.5">Target Scope</th>
                  <th className="px-4 py-3.5">Attachment</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((item) => {
                  const isApproved = item.status === 'Approved'
                  const isRejected = item.status === 'Rejected'

                  return (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      {/* Reviewer Info */}
                      <td className="px-5 py-4 align-top">
                        <div className="flex items-start gap-2.5">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-600">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{item.name}</p>
                            {item.contact ? (
                              <p className="mt-0.5 text-[11px] text-slate-500">
                                {item.contact}
                              </p>
                            ) : (
                              <p className="mt-0.5 text-[10px] text-slate-400 italic">No contact info</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Rating & Message */}
                      <td className="max-w-[320px] px-4 py-4 align-top">
                        <div className="flex items-center gap-1 mb-1.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < item.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200 '
                              }
                            />
                          ))}
                          <span className="ml-1 text-[11px] font-bold text-slate-700">
                            {item.rating}/5
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line">
                          {item.message}
                        </p>
                      </td>

                      {/* Target Scope */}
                      <td className="px-4 py-4 align-top">
                        {item.productId ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-2.5 py-1 text-[11px] font-medium text-indigo-700">
                            <Package size={12} />
                            {item.product?.name || `Product #${item.productId}`}
                          </span>
                        ) : item.serviceId ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50/70 px-2.5 py-1 text-[11px] font-medium text-purple-700">
                            <Wrench size={12} />
                            Service: {item.serviceId}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                            <Globe size={12} />
                            General (Homepage)
                          </span>
                        )}
                      </td>

                      {/* Image Attachment */}
                      <td className="px-4 py-4 align-top">
                        {item.imageUrl ? (
                          <button
                            type="button"
                            onClick={() => setPreviewImage(item.imageUrl!)}
                            className="group relative flex size-12 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 transition-transform hover:scale-105"
                          >
                            <img
                              src={item.imageUrl}
                              alt="Review attachment"
                              className="size-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                              <Eye size={16} className="text-white" />
                            </div>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">—</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-4 py-4 align-top text-[11px] text-slate-500">
                        {formatDate(item.createdAt)}
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-4 align-top">
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                            <Check size={11} /> Approved
                          </span>
                        ) : isRejected ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700">
                            <X size={11} /> Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="px-5 py-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isApproved && (
                            <button
                              type="button"
                              title="Approve Review (Go Live)"
                              onClick={() => onStatusChange(item.id, 'Approved')}
                              className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
                            >
                              <Check size={13} />
                              <span>Approve</span>
                            </button>
                          )}
                          {!isRejected && (
                            <button
                              type="button"
                              title="Reject Review"
                              onClick={() => onStatusChange(item.id, 'Rejected')}
                              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                            >
                              <X size={13} />
                              <span>Reject</span>
                            </button>
                          )}
                          <button
                            type="button"
                            title="Delete Review"
                            onClick={() => onDelete(item.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
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
        </>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-h-[85vh] max-w-2xl overflow-hidden rounded-2xl bg-white p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close image preview"
              onClick={() => setPreviewImage(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-1.5 text-white hover:bg-black transition"
            >
              <X size={18} />
            </button>
            <img
              src={previewImage}
              alt="Review full attachment"
              className="max-h-[75vh] w-auto rounded-xl object-contain"
            />
          </div>
        </div>
      )}

      {/* Review Detail Modal */}
      {selectedReview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-600 text-sm">
                  {selectedReview.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedReview.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500">
                      {selectedReview.contact || 'No contact provided'}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-400">
                      {formatDate(selectedReview.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close review details"
                onClick={() => setSelectedReview(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 py-4">
              {/* Rating & Status */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < selectedReview.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }
                    />
                  ))}
                  <span className="ml-1 text-xs font-bold text-slate-700">
                    {selectedReview.rating} out of 5 stars
                  </span>
                </div>

                <div>
                  {selectedReview.status === 'Approved' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      <Check size={12} /> Approved
                    </span>
                  ) : selectedReview.status === 'Rejected' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">
                      <X size={12} /> Rejected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                      Pending Moderation
                    </span>
                  )}
                </div>
              </div>

              {/* Target Scope */}
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Target Scope
                </span>
                {selectedReview.productId ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
                    <Package size={14} />
                    <span>Product: {selectedReview.product?.name || `#${selectedReview.productId}`}</span>
                  </div>
                ) : selectedReview.serviceId ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-purple-700">
                    <Wrench size={14} />
                    <span>Service: {selectedReview.serviceId}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Globe size={14} />
                    <span>General Website / Homepage</span>
                  </div>
                )}
              </div>

              {/* Full Review Message */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Review Feedback
                </span>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-xs leading-relaxed text-slate-800 whitespace-pre-line max-h-48 overflow-y-auto">
                  {selectedReview.message}
                </div>
              </div>

              {/* Photo Attachment if present */}
              {selectedReview.imageUrl && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Attached Photo
                  </span>
                  <div className="relative inline-block overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={selectedReview.imageUrl}
                      alt="Review attachment"
                      className="h-32 w-auto object-cover cursor-pointer hover:opacity-95 transition"
                      onClick={() => setPreviewImage(selectedReview.imageUrl!)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-4 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  onDelete(selectedReview.id)
                  setSelectedReview(null)
                }}
                className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedReview.status !== 'Approved' && (
                  <button
                    type="button"
                    onClick={() => {
                      onStatusChange(selectedReview.id, 'Approved')
                      setSelectedReview((prev) => (prev ? { ...prev, status: 'Approved' } : null))
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
                  >
                    <Check size={14} />
                    <span>Approve</span>
                  </button>
                )}

                {selectedReview.status !== 'Rejected' && (
                  <button
                    type="button"
                    onClick={() => {
                      onStatusChange(selectedReview.id, 'Rejected')
                      setSelectedReview((prev) => (prev ? { ...prev, status: 'Rejected' } : null))
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                  >
                    <X size={14} />
                    <span>Reject</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

