'use server'

import { incrementView } from '@/lib/services/views'

export async function registerViewAction(postId: string) {
  await incrementView(postId)
}