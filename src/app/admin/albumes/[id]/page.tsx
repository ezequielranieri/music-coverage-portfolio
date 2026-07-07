import type { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { EditAlbumForm } from '@/components/admin/edit-album-form'
import { DeleteAlbumButton } from './delete-button'
import type { Album } from '@/types/sanity'

const ALBUM_PROJECTION = `{
  _id,
  title,
  slug,
  description,
  coverImage { asset->{ url }, alt },
  photos[] { asset->{ url }, alt },
  isDestacado,
  showInPortfolio,
  portfolioOrder,
  genre,
  status
}`

async function getAlbum(id: string) {
  return client.fetch<Album | null>(
    `*[_type == "album" && _id == $id && status == "published"][0] ${ALBUM_PROJECTION}`,
    { id }
  )
}

export default async function EditAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const album = await getAlbum(id)

  if (!album) {
    return (
      <div className="p-8">
        <h1 className="font-display text-3xl mb-6">Álbum no encontrado</h1>
        <p className="text-text-secondary">No existe o fue eliminado.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="font-display text-3xl mb-8">Editar álbum</h1>
      <EditAlbumForm album={album} />
      <div className="mt-8 pt-8 border-t border-surface-border">
        <DeleteAlbumButton albumId={album._id} albumTitle={album.title} />
      </div>
    </div>
  )
}