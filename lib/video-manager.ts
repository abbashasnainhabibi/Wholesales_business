'use client'

/**
 * Global Video Playback Manager (Singleton)
 *
 * Ensures strictly AT MOST ONE video is playing across the entire application at any given time.
 * Synchronously pauses previously playing videos before any new video begins playing.
 * Provides SSR safety, route change cleanup, and unmount deregistration.
 */

type VideoCallback = () => void

class VideoPlaybackManager {
  private activeVideo: HTMLVideoElement | null = null
  private pauseCallbacks: Map<HTMLVideoElement, VideoCallback> = new Map()

  /**
   * Register a video element and its pause callback with the manager
   */
  public register(video: HTMLVideoElement, onPause: VideoCallback) {
    if (!video) return
    this.pauseCallbacks.set(video, onPause)
  }

  /**
   * Deregister a video element (e.g. on component unmount or route change)
   */
  public deregister(video: HTMLVideoElement) {
    if (!video) return
    if (this.activeVideo === video) {
      this.activeVideo = null
    }
    this.pauseCallbacks.delete(video)
  }

  /**
   * Synchronously pause all videos except the one about to play
   * This is executed synchronously within the same tick before play() is called.
   */
  public requestPlay(video: HTMLVideoElement) {
    if (!video) return

    if (this.activeVideo && this.activeVideo !== video) {
      try {
        this.activeVideo.pause()
      } catch {
        // Ignore any sync pause issues
      }
      const cb = this.pauseCallbacks.get(this.activeVideo)
      if (cb) cb()
    }

    this.activeVideo = video
  }

  /**
   * Notify manager that a video paused (either user-initiated or scroll-out)
   */
  public notifyPause(video: HTMLVideoElement) {
    if (this.activeVideo === video) {
      this.activeVideo = null
    }
  }

  /**
   * Pause the active video (e.g. on document visibility hidden)
   */
  public pauseActive() {
    if (this.activeVideo) {
      try {
        this.activeVideo.pause()
      } catch {
        // Ignore
      }
      const cb = this.pauseCallbacks.get(this.activeVideo)
      if (cb) cb()
      this.activeVideo = null
    }
  }

  /**
   * Get the currently active playing video element
   */
  public getActiveVideo(): HTMLVideoElement | null {
    return this.activeVideo
  }
}

// Ensure single global instance in browser environment
const GLOBAL_KEY = '__tahira_video_playback_manager__'

export function getVideoManager(): VideoPlaybackManager {
  if (typeof window === 'undefined') {
    return new VideoPlaybackManager()
  }

  const win = window as unknown as Record<string, unknown>
  if (!win[GLOBAL_KEY]) {
    win[GLOBAL_KEY] = new VideoPlaybackManager()
  }

  return win[GLOBAL_KEY] as VideoPlaybackManager
}
