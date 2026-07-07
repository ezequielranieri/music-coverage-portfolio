'use server'

import { requireAdmin } from '@/lib/services/auth'
import { postSchema } from '@/lib/validations/post'
import { createPost } from '@/lib/services/post'
import { revalidatePath } from 'next/cache'

export async function createPostAction(formData: FormData) {
  await requireAdmin()

  const rawType = formData.get('type') as string

  const parsed = postSchema.safeParse({
    type: rawType,
    title: formData.get('title'),
    body: formData.get('body') || undefined,
    genre: formData.getAll('genre'),
    imageAssetId: formData.get('imageAssetId') || undefined,
    imageAlt: formData.get('imageAlt') || undefined,
    videoSource: formData.get('videoSource') || undefined,
    videoUrl: formData.get('videoUrl') || undefined,
    videoAssetId: formData.get('videoAssetId') || undefined,
    albumId: formData.get('albumId') || undefined,
  })

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }

  try {
    await createPost(parsed.data)
  } catch (e) {
    return { success: false, errors: { _form: ['Error al crear la publicación'] } }
  }
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/portfolio')

  return { success: true }
}
