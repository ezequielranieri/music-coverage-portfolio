'use client'

import { useState, useEffect, useRef, memo } from 'react'
import { Play } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { TikTokEmbed } from './tiktok-embed'
import { InstagramEmbed } from './instagram-embed'
import type { VideoSource } from '@/types/sanity'

interface VideoEmbedProps {
  source: VideoSource
  url?: string
  nativeFileUrl?: string
}

export const VideoEmbed = memo(function VideoEmbed({ source, url, nativeFileUrl }: VideoEmbedProps) {
  const [isInView, setIsInView] = useState(false)
  const [playing, setPlaying] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  function handlePlay() {
    setPlaying(true)
    videoRef.current?.play()
  }

  return (
    <div
      ref={containerRef}
      className={`w-full bg-black relative ${source === 'native' ? 'aspect-[9/16] max-h-[600px]' : 'min-h-[400px] max-h-[600px] overflow-hidden'}`}
    >
      {!isInView && <Skeleton className="w-full h-full" />}
      {isInView && source === 'native' && nativeFileUrl && (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={nativeFileUrl}
            preload={playing ? 'none' : 'metadata'}
            controls={playing}
            playsInline
            muted={!playing}
            className={`w-full h-full ${playing ? 'object-contain' : 'object-cover blur-xl opacity-50 scale-110'}`}
          />
          {!playing && (
            <>
              <div className="absolute inset-0 bg-black/60" />
              <button
                onClick={handlePlay}
                className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
                aria-label="Reproducir video"
              >
                <div className="w-16 h-16 rounded-full bg-accent-pink flex items-center justify-center hover:scale-105 transition-transform">
                  <Play size={28} className="text-white ml-1" />
                </div>
              </button>
            </>
          )}
        </div>
      )}
      {isInView && source === 'tiktok' && url && <TikTokEmbed url={url} />}
      {isInView && source === 'instagram' && url && <InstagramEmbed url={url} />}
    </div>
  )
})
