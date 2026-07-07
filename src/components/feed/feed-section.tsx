import { getFeedPosts } from '@/lib/services/feed'
import { FeedList } from './feed-list'

interface FeedSectionProps {
  filters: { type?: string; genre?: string; sort?: string; q?: string }
  isAdmin: boolean
}

export async function FeedSection({ filters, isAdmin }: FeedSectionProps) {
  const { posts, hasMore } = await getFeedPosts({
    type: filters.type as 'image' | 'video' | 'album' | 'text' | undefined,
    genre: filters.genre,
    query: filters.q,
    sort: (filters.sort as 'latest' | 'popular') ?? 'latest',
    page: 0,
  })
  return <FeedList initialPosts={posts} initialHasMore={hasMore} filters={filters} isAdmin={isAdmin} />
}
