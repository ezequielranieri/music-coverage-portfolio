'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Edit, Trash2, Star, Eye } from 'lucide-react'
import { softDeleteAlbumAction } from '@/app/admin/albumes/[id]/actions'
import { ConfirmModal } from '@/components/shared/confirm-modal'
import { GENRE_OPTIONS } from '../../../../sanity/schemas/objects/genre'

interface AlbumSummary {
  _id: string
  title: string
  genre?: string[]
  showInPortfolio?: boolean
  isDestacado?: boolean
  _createdAt: string
}

function AlbumCard({ album }: { album: AlbumSummary }) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      await softDeleteAlbumAction(album._id)
      router.refresh()
    })
  }

  const genreNames = album.genre
    ?.map((g) => GENRE_OPTIONS.find((o) => o.value === g)?.title)
    .filter(Boolean)

  return (
    <div className="flex items-center justify-between rounded-2xl bg-surface-card border border-surface-border px-4 py-3 gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-text-primary truncate">{album.title}</p>
          {album.isDestacado && <Star size={12} className="text-accent-pink flex-shrink-0" />}
          {album.showInPortfolio && <Eye size={12} className="text-text-secondary flex-shrink-0" />}
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          {genreNames && genreNames.length > 0 && <span>{genreNames.join(', ')}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href={`/admin/albumes/${album._id}`}
          className="rounded-full bg-surface-raised p-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <Edit size={14} />
        </Link>
        <button
          onClick={() => setConfirming(true)}
          className="rounded-full bg-surface-raised p-2 text-text-secondary hover:text-state-error transition-colors"
        >
          <Trash2 size={14} />
        </button>
        <ConfirmModal
          open={confirming}
          title="Eliminar álbum"
          message="El álbum y su publicación asociada se eliminarán de forma lógica. Se purgarán automáticamente en 30 días."
          confirmLabel="Eliminar"
          loading={isPending}
          onConfirm={handleDelete}
          onCancel={() => setConfirming(false)}
        />
      </div>
    </div>
  )
}

export function AlbumList({ albums }: { albums: AlbumSummary[] }) {
  return (
    <div className="space-y-3">
      {albums.map((album) => (
        <AlbumCard key={album._id} album={album} />
      ))}
    </div>
  )
}
