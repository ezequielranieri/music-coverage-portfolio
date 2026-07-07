'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Edit, Trash2, Image, Video, Film, FileText } from 'lucide-react'
import { deletePostAction } from '@/app/admin/posts/[id]/actions'
import { ConfirmModal } from '@/components/shared/confirm-modal'
import { GENRE_OPTIONS } from '../../../../sanity/schemas/objects/genre'

interface PostSummary {
  _id: string
  type: string
  title: string
  genre?: string[]
  publishedAt: string
}

const TYPE_ICONS: Record<string, typeof Image> = {
  image: Image,
  video: Video,
  album: Film,
  text: FileText,
}

const TYPE_LABELS: Record<string, string> = {
  image: 'Imagen',
  video: 'Video',
  album: 'Álbum',
  text: 'Texto',
}

function PostCard({ post }: { post: PostSummary }) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const Icon = TYPE_ICONS[post.type] ?? FileText

  function handleDelete() {
    startTransition(async () => {
      await deletePostAction(post._id)
      router.refresh()
    })
  }

  const genreNames = post.genre
    ?.map((g) => GENRE_OPTIONS.find((o) => o.value === g)?.title)
    .filter(Boolean)

  return (
    <div className="flex items-center justify-between rounded-2xl bg-surface-card border border-surface-border px-4 py-3 gap-4">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-raised flex items-center justify-center text-text-secondary">
          <Icon size={14} />
        </div>
        <div className="min-w-0">
          <p className="text-text-primary truncate">{post.title}</p>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span>{TYPE_LABELS[post.type] ?? post.type}</span>
            {genreNames && genreNames.length > 0 && (
              <span className="truncate">· {genreNames.join(', ')}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href={`/admin/posts/${post._id}`}
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
          title="Eliminar publicación"
          message="Se eliminará de forma lógica. Se purgará automáticamente en 30 días."
          confirmLabel="Eliminar"
          loading={isPending}
          onConfirm={handleDelete}
          onCancel={() => setConfirming(false)}
        />
      </div>
    </div>
  )
}

export function PostList({ posts }: { posts: PostSummary[] }) {
  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  )
}
