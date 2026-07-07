import 'server-only'
import { writeClient } from '@/lib/sanity/write-client'

export async function incrementLike(postId: string) {
  return writeClient
    .patch(postId)
    .setIfMissing({ likesCount: 0 })
    .inc({ likesCount: 1 })
    .commit()
}