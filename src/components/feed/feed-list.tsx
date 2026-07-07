'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { loadMorePosts } from '@/app/actions/feed'
import { PostCard } from './post-card'
import { LazyCard } from './lazy-card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Post } from '@/types/sanity'

const ABOVE_FOLD = 2

interface FeedListProps {
  initialPosts: Post[]
  initialHasMore: boolean
  filters: { type?: string; genre?: string; sort?: string; q?: string }
  isAdmin?: boolean
}

export function FeedList({ initialPosts, initialHasMore, filters, isAdmin }: FeedListProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPosts(initialPosts)
    setHasMore(initialHasMore)
    setPage(0)
  }, [initialPosts, initialHasMore])

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    const nextPage = page + 1
    const result = await loadMorePosts(nextPage, filters)
    setPosts((prev) => [...prev, ...result.posts])
    setHasMore(result.hasMore)
    setPage(nextPage)
    setIsLoading(false)
  }, [page, hasMore, isLoading, filters])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { rootMargin: '400px' }
    )
    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [loadMore])

  return (
    <div className="space-y-2.5">
      {posts.map((post, i) => {
        const card = (
          <div key={post._id} className="max-w-xl mx-auto w-full animate-fade-in-up">
            <PostCard post={post} isAdmin={isAdmin} />
          </div>
        )
        if (i < ABOVE_FOLD) return card
        return (
          <LazyCard key={post._id} className="max-w-xl mx-auto w-full animate-fade-in-up">
            {card}
          </LazyCard>
        )
      })}
      {isLoading && <Skeleton className="h-96 w-full" />}
      {hasMore && <div ref={sentinelRef} className="h-1" />}
      {!hasMore && posts.length > 0 && (
        <p className="text-center text-text-muted text-sm py-6">No hay más publicaciones.</p>
      )}
      {posts.length === 0 && (
        <p className="text-center text-text-muted text-sm py-12">
          No se encontraron publicaciones con estos filtros.
        </p>
      )}
    </div>
  )
}
