import 'server-only'
import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis'

const likeLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 m'),
  prefix: 'ratelimit:like',
})

const commentLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  prefix: 'ratelimit:comment',
})

const contactLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 m'),
  prefix: 'ratelimit:contact',
})

const limiters: Record<string, Ratelimit> = {
  like: likeLimiter,
  comment: commentLimiter,
  contact: contactLimiter,
}

export async function checkRateLimit(action: 'like' | 'comment' | 'contact', ip: string) {
  const limiter = limiters[action]
  if (!limiter) return true
  const { success } = await limiter.limit(ip)
  return success
}