import type { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { AlbumList } from '@/components/admin/lists/album-list'

export const metadata: Metadata = { title: 'Álbumes' }

interface AlbumSummary {
  _id: string
  title: string
  genre?: string[]
  showInPortfolio?: boolean
  isDestacado?: boolean
  _createdAt: string
}

async function getAlbums() {
  return client.fetch<AlbumSummary[]>(
    `*[_type == "album" && status == "published"] | order(_createdAt desc) { _id, title, genre, showInPortfolio, isDestacado, _createdAt }`
  )
}

export default async function AlbumesPage() {
  const albums = await getAlbums()

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-6">Álbumes</h1>
      {albums.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-card border border-surface-border flex items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          </div>
          <p className="text-text-muted text-sm mb-1">No hay álbumes</p>
          <a href="/admin/albumes/crear" className="text-accent-pink text-sm underline">Crear el primer álbum</a>
        </div>
      ) : (
        <AlbumList albums={albums} />
      )}
    </div>
  )
}
