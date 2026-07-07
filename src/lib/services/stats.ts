import 'server-only'
import { client } from '@/lib/sanity/client'
import { getViewCounts } from './views'

export async function getDashboardStats() {
  const posts = await client.fetch<{ _id: string; title: string; likesCount: number; publishedAt: string }[]>(
    `*[_type == "post" && status == "published"] { _id, title, likesCount, publishedAt } | order(publishedAt desc)`
  )

  const viewCounts = await getViewCounts(posts.map((p) => p._id))

  const totalViews = Object.values(viewCounts).reduce((sum, v) => sum + v, 0)
  const totalLikes = posts.reduce((sum, p) => sum + (p.likesCount ?? 0), 0)

  const postsWithStats = posts.map((post) => ({
    ...post,
    views: viewCounts[post._id] ?? 0,
  }))

  const [pendingMessages, pendingComments] = await Promise.all([
    client.fetch<number>(`count(*[_type == "message" && read == false])`),
    client.fetch<number>(`count(*[_type == "comment" && visible == false])`),
  ])

  return { totalViews, totalLikes, postsWithStats, pendingMessages, pendingComments }
}