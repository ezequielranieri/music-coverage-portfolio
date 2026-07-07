'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Avatar } from '@/components/ui/avatar'
import { safeAssetUrl } from '@/lib/safe-asset'
import type { Album } from '@/types/sanity'

const StoryViewer = dynamic(() => import('./story-viewer').then(m => m.StoryViewer))

export function StoryCircles({ albums }: { albums: Album[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (albums.length === 0) return null

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-2 mb-6">
        {albums.map((album, i) => (
          <button
            key={album._id}
            onClick={() => setOpenIndex(i)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink rounded-2xl"
          >
            <Avatar
              src={safeAssetUrl(album.coverImage?.asset)}
              alt={album.coverImage?.alt || 'Foto del álbum'}
              size={64}
              hasGradientRing
            />
            <span className="text-xs text-text-secondary max-w-[64px] truncate">{album.title}</span>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <StoryViewer
          albums={albums}
          initialIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  )
}
