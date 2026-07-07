'use client'

import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

function getInstagramShortcode(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([^/?]+)/)
  return match?.[1] ?? null
}

export function InstagramEmbed({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false)

  const shortcode = getInstagramShortcode(url)

  if (!shortcode) {
    return (
      <div className="w-full h-full flex items-center justify-center text-text-muted text-sm p-4 text-center">
        URL de Instagram inválida.{' '}
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent-pink underline ml-1">
          Abrir en Instagram
        </a>
      </div>
    )
  }

  return (
    <div className="w-full aspect-[4/5] flex items-center justify-center overflow-hidden bg-black relative">
      {!loaded && <Skeleton className="w-full h-full" />}
      <iframe
        src={`https://www.instagram.com/p/${shortcode}/embed/`}
        className={`w-full h-full ${loaded ? '' : 'absolute inset-0 opacity-0 pointer-events-none'}`}
        style={{ border: 'none' }}
        allowFullScreen
        loading="lazy"
        title="Instagram post"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
