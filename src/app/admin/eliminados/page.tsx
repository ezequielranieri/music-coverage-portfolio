import type { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { RestoreItemForm } from '@/components/admin/restore-item-form'

export const metadata: Metadata = { title: 'Eliminados' }

async function getDeletedPosts() {
  return client.fetch<{ _id: string; title: string; deletedAt: string }[]>(
    `*[_type == "post" && status == "deleted"] | order(deletedAt desc) { _id, title, deletedAt }`
  )
}

async function getDeletedAlbums() {
  return client.fetch<{ _id: string; title: string; deletedAt: string }[]>(
    `*[_type == "album" && status == "deleted"] | order(deletedAt desc) { _id, title, deletedAt }`
  )
}

function daysLeft(deletedAt: string) {
  const deleted = new Date(deletedAt).getTime()
  const now = Date.now()
  const remaining = 30 * 24 * 60 * 60 * 1000 - (now - deleted)
  return Math.max(0, Math.ceil(remaining / (24 * 60 * 60 * 1000)))
}

export default async function EliminadosPage() {
  const [posts, albums] = await Promise.all([getDeletedPosts(), getDeletedAlbums()])

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-6">Elementos eliminados</h1>
      <p className="text-sm text-text-secondary mb-8">
        Se borran definitivamente a los 30 días. Podés restaurarlos hasta ese momento.
      </p>

      {posts.length === 0 && albums.length === 0 && (
        <p className="text-text-muted">No hay elementos eliminados.</p>
      )}

      {posts.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display text-xl text-text-secondary mb-4">Publicaciones</h2>
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post._id} className="flex items-center justify-between rounded-2xl bg-surface-card border border-surface-border px-4 py-3">
                <div>
                  <p className="text-text-primary">{post.title}</p>
                  <p className="text-xs text-text-muted font-mono">{daysLeft(post.deletedAt)} días restantes</p>
                </div>
                <RestoreItemForm itemId={post._id} type="post" />
              </div>
            ))}
          </div>
        </section>
      )}

      {albums.length > 0 && (
        <section>
          <h2 className="font-display text-xl text-text-secondary mb-4">Álbumes</h2>
          <div className="space-y-3">
            {albums.map((album) => (
              <div key={album._id} className="flex items-center justify-between rounded-2xl bg-surface-card border border-surface-border px-4 py-3">
                <div>
                  <p className="text-text-primary">{album.title}</p>
                  <p className="text-xs text-text-muted font-mono">{daysLeft(album.deletedAt)} días restantes</p>
                </div>
                <RestoreItemForm itemId={album._id} type="album" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
