import 'server-only'
import { client } from '@/lib/sanity/client'
import { getViewCounts } from './views'
import type { Post } from '@/types/sanity'

const POSTS_PER_PAGE = 12

interface FeedFilters {
  type?: 'image' | 'video' | 'album' | 'text'
  genre?: string
  query?: string
  sort?: 'latest' | 'popular'
  page?: number
}

const POST_PROJECTION = `{
  _id,
  type,
  title,
  slug,
  body,
  image { asset->{ url }, alt },
  videoSource,
  videoUrl,
  videoFile { asset->{ url } },
  album->{
    _id, title, slug,
    coverImage { asset->{ url }, alt },
    photos[] { asset->{ url }, alt },
    isDestacado
  },
  genre,
  likesCount,
  "comments": *[_type == "comment" && post._ref == ^._id && visible == true] | order(createdAt asc) { _id, authorName, body, createdAt },
  publishedAt
}`

export async function getFeedPosts(filters: FeedFilters = {}): Promise<{ posts: Post[]; hasMore: boolean }> {
  const { type, genre, query, sort = 'latest', page = 0 } = filters

  const conditions: string[] = ['_type == "post"', 'status == "published"']
  const params: Record<string, unknown> = {}

  if (type) conditions.push(`type == $type`)
  if (type) params.type = type

  if (genre) conditions.push(`$genre in genre`)
  if (genre) params.genre = genre

  if (query) {
    conditions.push(`(title match $query || body match $query)`)
    params.query = `*${query}*`
  }

  const filterClause = conditions.join(' && ')

  if (sort === 'popular') {
    const candidateLimit = 100
    const candidates = await client.fetch<Post[]>(
      `*[${filterClause}] | order(likesCount desc) [0...${candidateLimit}] ${POST_PROJECTION}`,
      params
    )

    const viewCounts = await getViewCounts(candidates.map((p) => p._id))

    const scored = candidates
      .map((post) => ({
        post,
        score: (post.likesCount ?? 0) * 3 + (viewCounts[post._id] ?? 0),
      }))
      .sort((a, b) => b.score - a.score)

    const start = page * POSTS_PER_PAGE
    const end = start + POSTS_PER_PAGE
    const posts = scored.slice(start, end).map((s) => s.post)
    const hasMore = end < scored.length

    return { posts, hasMore }
  }

  const start = page * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE

  const posts = await client.fetch<Post[]>(
    `*[${filterClause}] | order(publishedAt desc) [${start}...${end}] ${POST_PROJECTION}`,
    params
  )

  const hasMore = posts.length === POSTS_PER_PAGE

  return { posts, hasMore }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return client.fetch<Post | null>(
    `*[_type == "post" && slug.current == $slug && status == "published"][0] ${POST_PROJECTION}`,
    { slug }
  )
}