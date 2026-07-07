'use server'

import { headers } from 'next/headers'
import { checkRateLimit } from '@/lib/rate-limit'
import { commentSchema } from '@/lib/validations/comment'
import { createComment } from '@/lib/services/comment'
import { revalidatePath } from 'next/cache'

export async function submitCommentAction(formData: FormData) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') ?? 'unknown'

  const allowed = await checkRateLimit('comment', ip)
  if (!allowed) {
    return { success: false, errors: { _form: ['Demasiados comentarios, esperá un momento.'] } }
  }

  const parsed = commentSchema.safeParse({
    postId: formData.get('postId'),
    authorName: formData.get('authorName'),
    body: formData.get('body'),
  })

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }

  try { await createComment(parsed.data) } catch (e) { return { success: false, errors: { _form: ['Error al enviar el comentario'] } } }
  revalidatePath('/admin/comentarios')

  return { success: true, pending: true }
}