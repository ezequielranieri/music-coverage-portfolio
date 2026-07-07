'use client'

import { useState } from 'react'
import Image from 'next/image'
import { blurUrl } from '@/lib/image'
import { safeAssetUrl } from '@/lib/safe-asset'
import type { Album } from '@/types/sanity'

export function AlbumCarousel({ album }: { album: Album }) {
  const photos = album.photos ?? []
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const total = photos.length

  function next() {
    if (index < total - 1) {
      setDirection(1)
      setIndex((i) => i + 1)
    }
  }

  function prev() {
    if (index > 0) {
      setDirection(-1)
      setIndex((i) => i - 1)
    }
  }

  if (total === 0) {
    return (
      <div className="relative aspect-square w-full overflow-hidden bg-surface-raised flex items-center justify-center">
        <p className="text-text-muted text-sm">Sin fotos</p>
      </div>
    )
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden">
      <div
        className="flex transition-transform duration-300 ease-out h-full"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {photos.map((photo, i) => (
          <div key={i} className="relative w-full h-full flex-shrink-0">
            <Image
              src={safeAssetUrl(photo?.asset)}
              alt={photo?.alt || 'Foto del álbum'}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL={blurUrl(safeAssetUrl(photo?.asset))}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 576px"
            />
          </div>
        ))}
      </div>

      <button onClick={prev} disabled={index === 0} className="absolute left-0 top-0 w-1/3 h-full disabled:cursor-default" aria-label="Foto anterior" />
      <button onClick={next} disabled={index >= total - 1} className="absolute right-0 top-0 w-1/3 h-full disabled:cursor-default" aria-label="Foto siguiente" />

      <div className="absolute top-3 left-3 bg-black/50 rounded-full px-2.5 py-1 text-xs text-white font-mono">
        {index + 1}/{total}
      </div>

      {total <= 8 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
          {photos.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
