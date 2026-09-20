'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Play, Pause } from 'lucide-react'
import { getVideoManager } from '@/lib/video-manager'

export interface OptimizedVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src?: string
  webmSrc?: string
  mp4Src?: string
  poster?: string
  isHero?: boolean
  loop?: boolean
  className?: string
  containerClassName?: string
  ariaLabel?: string
  showControlsOverlay?: boolean
}

export function OptimizedVideo({
  src,
  webmSrc,
  mp4Src,
  poster,
  isHero = false,
  loop = true,
  className = 'h-full w-full object-cover',
  containerClassName = 'relative h-full w-full overflow-hidden group',
  ariaLabel,
  showControlsOverlay = true,
  ...restProps
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [hasEnteredView, setHasEnteredView] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const [isMobileScreen, setIsMobileScreen] = useState(false)
  const isAttemptingPlayRef = useRef(false)
  const playDebounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Derive source URLs and poster fallback
  let baseSrc = ''
  if (src) {
    baseSrc = src.replace(/\.(mov|mp4|webm)$/i, '')
  }

  const resolvedWebm = webmSrc || (baseSrc ? `${baseSrc}.webm` : undefined)
  const resolvedMp4 = mp4Src || (baseSrc ? `${baseSrc}.mp4` : src)
  const resolvedPoster = poster || (baseSrc ? `${baseSrc}-poster.jpg` : undefined)

  // Screen width & prefers-reduced-motion detection
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)

    const checkMobile = () => {
      setIsMobileScreen(window.innerWidth < 768)
    }
    checkMobile()

    // On desktop, hero video should be marked as ready immediately
    if (isHero && window.innerWidth >= 768) {
      setHasEnteredView(true)
    }

    const handleResize = () => checkMobile()
    window.addEventListener('resize', handleResize)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches)
      if (e.matches) {
        safePause()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => {
      window.removeEventListener('resize', handleResize)
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [isHero])

  // Safe Promise-based play invocation with synchronous singleton coordination
  const safePlay = useCallback(() => {
    const videoEl = videoRef.current
    if (!videoEl || isAttemptingPlayRef.current) return

    // 1. Synchronously tell the manager to pause whichever other video was active
    const manager = getVideoManager()
    manager.requestPlay(videoEl)

    isAttemptingPlayRef.current = true

    const playPromise = videoEl.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isAttemptingPlayRef.current = false
          setIsPlaying(true)
        })
        .catch((err) => {
          isAttemptingPlayRef.current = false
          setIsPlaying(false)
          // Cleanly swallow AbortError and NotAllowedError without polluting console
          if (err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
            console.debug('Video playback notice:', err.name)
          }
        })
    } else {
      isAttemptingPlayRef.current = false
      setIsPlaying(true)
    }
  }, [])

  // Safe Pause invocation
  const safePause = useCallback(() => {
    const videoEl = videoRef.current
    if (!videoEl) return

    try {
      videoEl.pause()
    } catch {
      // Ignore sync pause errors
    }

    setIsPlaying(false)
    const manager = getVideoManager()
    manager.notifyPause(videoEl)
  }, [])

  // Register in singleton manager & handle route change / unmount cleanup
  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl) return

    const manager = getVideoManager()
    manager.register(videoEl, () => {
      // Called when manager pauses this video because another video started playing
      setIsPlaying(false)
    })

    return () => {
      manager.deregister(videoEl)
      if (playDebounceTimerRef.current) {
        clearTimeout(playDebounceTimerRef.current)
      }
    }
  }, [])

  // Tab visibility listener: pause when tab is backgrounded
  useEffect(() => {
    if (typeof document === 'undefined') return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isPlaying) {
          safePause()
        }
      } else {
        // If tab returns and video is in viewport & not manually paused by user & not reduced motion
        if (hasEnteredView && !userInteracted && !isReducedMotion && isHero && !isMobileScreen) {
          safePlay()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isPlaying, hasEnteredView, userInteracted, isReducedMotion, isHero, isMobileScreen, safePause, safePlay])

  // Scroll-based IntersectionObserver with Debounce
  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl || isReducedMotion) return

    if (isHero) {
      if (!isMobileScreen) {
        setHasEnteredView(true)
        const timer = setTimeout(() => {
          safePlay()
        }, 50)
        return () => clearTimeout(timer)
      }
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        // True Lazy-Loading: attach source elements once within 200px proximity
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          setHasEnteredView(true)
        }

        // Debounce play trigger to avoid thrashing during fast flings
        if (playDebounceTimerRef.current) {
          clearTimeout(playDebounceTimerRef.current)
        }

        playDebounceTimerRef.current = setTimeout(() => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            // Respect user manual pause unless they scroll out and come back
            if (!userInteracted && !isMobileScreen) {
              safePlay()
            }
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.15) {
            safePause()
            // Reset user pause lock when scrolled completely off-screen
            setUserInteracted(false)
          }
        }, 120)
      },
      {
        threshold: [0, 0.15, 0.35, 0.7],
        rootMargin: '200px 0px 200px 0px',
      }
    )

    observer.observe(videoEl)

    return () => {
      observer.disconnect()
      if (playDebounceTimerRef.current) {
        clearTimeout(playDebounceTimerRef.current)
      }
    }
  }, [isHero, isReducedMotion, isMobileScreen, userInteracted, safePlay, safePause])

  // User manual toggle click handler
  const handleTogglePlay = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const videoEl = videoRef.current
    if (!videoEl) return

    setHasEnteredView(true)
    setUserInteracted(true)

    if (videoEl.paused) {
      safePlay()
    } else {
      safePause()
    }
  }

  return (
    <div
      className={`cursor-pointer ${containerClassName}`}
      onClick={handleTogglePlay}
    >
      <video
        ref={videoRef}
        muted
        loop={loop}
        playsInline
        poster={resolvedPoster}
        preload={isHero && !isMobileScreen ? 'auto' : 'none'}
        className={className}
        aria-label={ariaLabel || restProps['aria-label'] || 'Tahira Syndicate Industrial Facility & Warehouse Tour'}
        onEnded={() => setIsPlaying(false)}
        {...restProps}
      >
        {hasEnteredView && (
          <>
            {resolvedWebm && <source src={resolvedWebm} type="video/webm" />}
            {resolvedMp4 && <source src={resolvedMp4} type="video/mp4" />}
          </>
        )}
        <track kind="captions" src="/hero/captions.vtt" srcLang="en" label="English" default={false} />
        Your browser does not support HTML5 video.
      </video>

      {/* Interactive Minimalist Play/Pause Overlay */}
      {showControlsOverlay && (
        <button
          type="button"
          onClick={handleTogglePlay}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          className={`absolute bottom-3 right-3 z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-slate-900/80 text-white backdrop-blur-md transition duration-200 hover:bg-[#1877F2] hover:scale-105 shadow-sm ${
            isPlaying ? 'opacity-0 group-hover:opacity-90 focus:opacity-90' : 'opacity-90 ring-2 ring-white/40'
          }`}
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current" />
          ) : (
            <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current ml-0.5" />
          )}
        </button>
      )}
    </div>
  )
}
