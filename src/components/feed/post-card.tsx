'use client'

import { useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { LikeButton } from './like-button'
import { AlbumCarousel } from './album-carousel'
import { ViewTracker } from './view-tracker'
import { AdminPostActions } from './admin-post-actions'
import { blurUrl } from '@/lib/image'
import { safeAssetUrl } from '@/lib/safe-asset'
import type { Post } from '@/types/sanity'

const VideoEmbed = dynamic(() => import('./video-embed').then(m => m.VideoEmbed))
const CommentForm = dynamic(() => import('./comment-form').then(m => m.CommentForm))
const Lightbox = dynamic(() => import('./lightbox').then(m => m.Lightbox))

export function PostCard({ post, isAdmin }: { post: Post; isAdmin?: boolean }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  return (
    <article className="relative rounded-2xl bg-surface-card border border-surface-border overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <AdminPostActions postId={post._id} isAdmin={!!isAdmin} />
      <ViewTracker postId={post._id} />
      {post.type === 'text' && (
        <div className="p-5">
          <p className="text-text-primary whitespace-pre-wrap">{post.body}</p>
        </div>
      )}

      {post.type === 'image' && post.image && (
        <>
          <button type="button" onClick={() => setLightboxOpen(true)} className="relative aspect-square w-full block cursor-zoom-in">
            <Image
              src={safeAssetUrl(post.image?.asset)}
              alt={post.image?.alt ?? ''}
              fill
              className="object-cover"
              loading="lazy"
              placeholder="blur"
              blurDataURL={blurUrl(safeAssetUrl(post.image?.asset))}
              sizes="(max-width: 768px) 100vw, 576px"
            />
          </button>
          {post.body && <p className="p-4 text-sm text-text-secondary">{post.body}</p>}
          {lightboxOpen && safeAssetUrl(post.image?.asset) && (
            <Lightbox src={safeAssetUrl(post.image?.asset)} alt={post.image?.alt ?? ''} onClose={() => setLightboxOpen(false)} />
          )}
        </>
      )}

      {post.type === 'video' && post.videoSource && (
        <>
          <VideoEmbed source={post.videoSource} url={post.videoUrl} nativeFileUrl={safeAssetUrl(post.videoFile?.asset)} />
          {post.body && <p className="p-4 text-sm text-text-secondary border-t border-surface-border">{post.body}</p>}
        </>
      )}

      {post.type === 'album' && post.album && (
        <>
          <AlbumCarousel album={post.album} />
          {post.body && <p className="p-4 text-sm text-text-secondary border-t border-surface-border">{post.body}</p>}
        </>
      )}

      <div className="flex items-center justify-between p-4 border-t border-surface-border">
        <LikeButton postId={post._id} initialLikes={post.likesCount ?? 0} />
        {post.genre && post.genre.length > 0 && (
          <div className="flex gap-1.5">
            {post.genre.map((g) => (
              <Badge key={g}>{g}</Badge>
            ))}
          </div>
        )}
      </div>

      {post.comments && post.comments.length > 0 && (
        <div className="px-4 pb-2 border-t border-surface-border space-y-2 pt-3">
          {post.comments.map((c) => (
            <div key={c._id} className="text-sm">
              <span className="font-semibold text-text-primary">{c.authorName}</span>{' '}
              <span className="text-text-secondary">{c.body}</span>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 border-t border-surface-border">
        <CommentForm postId={post._id} />
      </div>
    </article>
  )
}
