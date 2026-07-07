import type { Metadata } from 'next'
import { getAllAlbumsForSelect } from '@/lib/services/album'
import { CreatePostForm } from '@/components/admin/create-post-form'

export const metadata: Metadata = { title: 'Crear publicación' }

export default async function CrearPage() {
  const availableAlbums = await getAllAlbumsForSelect()

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-6">Crear publicación</h1>
      <CreatePostForm availableAlbums={availableAlbums} />
    </div>
  )
}
