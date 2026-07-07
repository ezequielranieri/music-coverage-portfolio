import type { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { PostList } from '@/components/admin/lists/post-list'

export const metadata: Metadata = { title: 'Publicaciones' }

interface PostSummary {
  _id: string
  type: string
  title: string
  genre?: string[]
  publishedAt: string
}

async function getPosts() {
  return client.fetch<PostSummary[]>(
    `*[_type == "post" && status == "published"] | order(publishedAt desc) { _id, type, title, genre, publishedAt }`
  )
}

export default async function PublicacionesPage() {
  const posts = await getPosts()

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-6">Publicaciones</h1>
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-card border border-surface-border flex items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted"><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z"/><path d="M9 9h1.01"/><path d="M9 13h6"/><path d="M9 17h6"/></svg>
          </div>
          <p className="text-text-muted text-sm mb-1">No hay publicaciones</p>
          <a href="/admin/crear" className="text-accent-pink text-sm underline">Crear la primera publicación</a>
        </div>
      ) : (
        <PostList posts={posts} />
      )}
    </div>
  )
}
