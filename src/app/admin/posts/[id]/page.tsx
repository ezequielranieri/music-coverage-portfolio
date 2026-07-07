import type { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { getAllAlbumsForSelect } from '@/lib/services/album'
import { getViewCount } from '@/lib/services/views'
import { CreatePostForm } from '@/components/admin/create-post-form'
import { DeletePostButton } from './delete-button'
import type { Post } from '@/types/sanity'
import { Badge } from '@/components/ui/badge'

async function getPost(id: string) {
  return client.fetch<Post | null>(
    `*[_type == "post" && _id == $id && status == "published"][0]`,
    { id }
  )
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [existingPost, availableAlbums] = await Promise.all([
    getPost(id),
    getAllAlbumsForSelect(),
  ])

  if (!existingPost) {
    return (
      <div className="p-8">
        <h1 className="font-display text-3xl mb-6">Publicación no encontrada</h1>
        <p className="text-text-secondary">No existe o fue eliminada.</p>
      </div>
    )
  }

  const views = await getViewCount(id)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl">Editar publicación</h1>
        <div className="flex items-center gap-3">
          <Badge>{views.toLocaleString('es-AR')} vistas</Badge>
          <Badge>{(existingPost.likesCount ?? 0).toLocaleString('es-AR')} likes</Badge>
          <DeletePostButton id={id} title={existingPost.title} />
        </div>
      </div>
      <CreatePostForm availableAlbums={availableAlbums} existingPost={existingPost} />
    </div>
  )
}
