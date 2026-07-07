'use server'

import { headers } from 'next/headers'
import { checkRateLimit } from '@/lib/rate-limit'
import { incrementLike } from '@/lib/services/like'

export async function likePostAction(postId: string) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') ?? 'unknown'

  const allowed = await checkRateLimit('like', ip)
  if (!allowed) {
    return { success: false, error: 'Demasiadas acciones, esperá un momento.' }
  }

  try { await incrementLike(postId) } catch (e) { return { success: false, error: 'Error del servidor' } }
  return { success: true }
}