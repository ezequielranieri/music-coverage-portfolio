import 'server-only'
import { redis } from '@/lib/redis'

function viewKey(postId: string) {
  return `views:post:${postId}`
}

export async function incrementView(postId: string) {
  return redis.incr(viewKey(postId))
}

export async function getViewCount(postId: string): Promise<number> {
  const count = await redis.get<number>(viewKey(postId))
  return count ?? 0
}

export async function getViewCounts(postIds: string[]): Promise<Record<string, number>> {
  if (postIds.length === 0) return {}
  const keys = postIds.map(viewKey)
  const counts = await redis.mget<(number | null)[]>(...keys)
  return Object.fromEntries(postIds.map((id, i) => [id, counts[i] ?? 0]))
}