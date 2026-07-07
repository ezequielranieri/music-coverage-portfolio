'use server'

import { getFeedPosts } from '@/lib/services/feed'

export async function loadMorePosts(page: number, filters: { type?: string; genre?: string; sort?: string; q?: string }) {
  return getFeedPosts({
    type: filters.type as 'image' | 'video' | 'album' | 'text' | undefined,
    genre: filters.genre,
    query: filters.q,
    sort: (filters.sort as 'latest' | 'popular') ?? 'latest',
    page,
  })
}
