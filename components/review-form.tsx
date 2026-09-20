'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Star, Upload, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react'
import { resolveMediaUrl } from '@/lib/utils'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        params: {
          sitekey: string
          callback: (token: string) => void
          'error-callback'?: () => void
          'expired-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
        }
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

interface ReviewFormProps {
  productId?: number
  serviceId?: string
  contextTitle?: string
  onReviewSubmitted?: () => void
}

export function ReviewForm({
  productId,
  serviceId,
  contextTitle,
  onReviewSubmitted,
}: ReviewFormProps) {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [honeypot, setHoneypot] = useState('')

  const [turnstileToken, setTurnstileToken] = useState('')
  const [clientTimestamp, setClientTimestamp] = useState<number>(0)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const turnstileContainerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  useEffect(() => {
    setClientTimestamp(Date.now())
  }, [])

  // Initialize Cloudflare Turnstile widget when script is ready
  useEffect(() => {
    if (!siteKey) return

    const checkAndRender = () => {
      if (window.turnstile && turnstileContainerRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              setTurnstileToken(token)
            },
            'error-callback': () => {
              setTurnstileToken('')
            },
            'expired-callback': () => {
              setTurnstileToken('')
            },
            theme: 'light',
          })
        } catch (err) {
          console.error('Turnstile render error:', err)
        }
      }
    }

    if (window.turnstile) {
      checkAndRender()
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          checkAndRender()
          clearInterval(interval)
        }
      }, 100)

      const timeout = setTimeout(() => clearInterval(interval), 5000)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
          widgetIdRef.current = null
        } catch {}
      }
    }
  }, [siteKey])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const reviewFolder = productId
        ? 'reviews/product'
        : serviceId
        ? 'reviews/service'
        : 'reviews/home'
      formData.append('folder', reviewFolder)

      if (name.trim()) {
        formData.append('customName', name.trim())
      } else {
        formData.append('customName', 'review-user')
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const json = await res.json()
        setImageUrl(json.url || json.src || '')
      } else {
        const errJson = await res.json().catch(() => ({}))
        setError(errJson.error || 'Failed to upload photo')
      }
    } catch {
      setError('Network error while uploading photo')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }
    if (!message.trim()) {
      setError('Please share your feedback or experience.')
      return
    }
    if (siteKey && !turnstileToken) {
      setError('Please complete the verification check before submitting.')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          rating,
          message: message.trim(),
          contact: contact.trim() || undefined,
          imageUrl: imageUrl || undefined,
          productId,
          serviceId,
          honeypot,
          clientTimestamp,
          turnstileToken,
        }),
      })

      const result = await res.json().catch(() => ({}))

      if (res.ok && (result.success || result.reviewId)) {
        setSuccess(true)
        setName('')
        setMessage('')
        setContact('')
        setImageUrl('')
        setTurnstileToken('')
        if (onReviewSubmitted) onReviewSubmitted()
      } else {
        setError(result.error || 'Unable to submit review. Please try again.')
      }
    } catch {
      setError('A connection error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-none border border-emerald-300 bg-emerald-50/70 p-5 sm:p-6 text-center shadow-xs">
        <div className="mx-auto mb-2.5 flex size-10 items-center justify-center rounded-none bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={24} />
        </div>
        <h3 className="font-heading text-base sm:text-lg font-black text-[#0F172A]">
          Thank you for your review!
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Your feedback has been received and will appear on the website shortly after verification by our team.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-4 inline-flex items-center justify-center rounded-sm bg-[#1877F2] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-600 transition"
        >
          Submit another response
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-none border border-slate-200 bg-white p-5 sm:p-7 shadow-xs transition-all max-w-2xl"
    >
      <div className="border-b border-slate-100 pb-4 mb-4">
        <h3 className="font-heading text-lg sm:text-xl font-black text-[#0F172A] tracking-tight">
          {contextTitle || 'Share your feedback'}
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Your authentic rating helps wholesale and commercial clients make informed procurement decisions.
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-none border border-rose-300 bg-rose-50 p-3 text-xs font-semibold text-rose-800">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Honeypot Field */}
      <div
        style={{
          opacity: 0,
          position: 'absolute',
          top: 0,
          left: 0,
          height: 0,
          width: 0,
          zIndex: -1,
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <label htmlFor="website_url_hp">Leave this field empty</label>
        <input
          id="website_url_hp"
          type="text"
          name="website_url_hp"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Star Rating Picker (Compact) */}
      <div className="mb-4">
        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
          Your Rating <span className="text-rose-500">*</span>
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="p-0.5 text-slate-300 transition-transform hover:scale-110 focus:outline-none"
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <Star
                size={22}
                className={
                  star <= (hoverRating || rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-200'
                }
              />
            </button>
          ))}
          <span className="ml-2 text-xs font-bold text-slate-700">
            {rating === 5 ? '5.0 (Excellent)' : rating === 4 ? '4.0 (Very Good)' : rating === 3 ? '3.0 (Good)' : rating === 2 ? '2.0 (Fair)' : '1.0 (Poor)'}
          </span>
        </div>
      </div>

      {/* Name & Contact Info (Compact 2 cols) */}
      <div className="grid gap-3 sm:grid-cols-2 mb-3">
        <div>
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Muhammad Farooq / Company"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-none border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
            Phone / Email <span className="text-slate-400 font-normal lowercase">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. 0321-xxxxxxx or email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full rounded-none border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2]"
          />
        </div>
      </div>

      {/* Message Textarea (Compact) */}
      <div className="mb-3">
        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
          Review &amp; Feedback <span className="text-rose-500">*</span>
        </label>
        <textarea
          required
          rows={2}
          placeholder="Briefly describe material quality, gauge accuracy, or delivery service..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-none border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] leading-relaxed"
        />
      </div>

      {/* Optional Photo Attachment (Compact inline) */}
      <div className="mb-4">
        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
          Attach photo <span className="text-slate-400 font-normal lowercase">(optional, max 5MB)</span>
        </label>
        {imageUrl ? (
          <div className="relative flex items-center gap-2.5 rounded-none border border-slate-200 bg-slate-50 p-1.5 max-w-xs">
            <div className="relative size-10 shrink-0 overflow-hidden rounded-none">
              <Image
                src={resolveMediaUrl(imageUrl)}
                alt="Uploaded preview"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 truncate">
              <p className="text-[11px] font-bold text-slate-700">Photo attached</p>
              <p className="text-[10px] text-slate-400 truncate">{imageUrl}</p>
            </div>
            <button
              type="button"
              onClick={() => setImageUrl('')}
              className="rounded-none p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
              title="Remove photo"
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs">
            {uploadingImage ? (
              <>
                <Loader2 size={13} className="animate-spin text-[#1877F2]" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={13} className="text-slate-500" />
                <span>Choose photo</span>
              </>
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Cloudflare Turnstile CAPTCHA Widget Container */}
      {siteKey && (
        <div className="mb-4">
          <div ref={turnstileContainerRef} className="min-h-[65px]" />
        </div>
      )}

      {/* Submit Button (Site standard: rounded-sm, bg-[#1877F2], font-bold) */}
      <button
        type="submit"
        disabled={submitting || uploadingImage}
        className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#1877F2] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-blue-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            <span>Submitting review...</span>
          </>
        ) : (
          <span>Submit Review</span>
        )}
      </button>
    </form>
  )
}
