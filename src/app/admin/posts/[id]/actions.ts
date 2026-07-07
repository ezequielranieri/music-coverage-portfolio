'use server'

import { requireAdmin } from '@/lib/services/auth'
import { updatePostSchema } from '@/lib/validations/post'
import { updatePost, softDeletePost, restorePost } from '@/lib/services/post'
import { revalidatePath } from 'next/cache'

export async function updatePostAction(id: string, formData: FormData) {
  await requireAdmin()

  const parsed = updatePostSchema.safeParse({
    title: formData.get('title'),
    body: formData.get('body') || undefined,
    genre: formData.getAll('genre'),
    imageAssetId: formData.get('imageAssetId') || undefined,
    imageAlt: formData.get('imageAlt') || undefined,
    videoUrl: formData.get('videoUrl') || undefined,
  })

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }

  try {
    await updatePost(id, parsed.data)
  } catch (e) {
    return { success: false, errors: { _form: ['Error al actualizar'] } }
  }
  revalidatePath('/')
  revalidatePath('/admin')

  return { success: true }
}

export async function deletePostAction(id: string) {
  await requireAdmin()
  try { await softDeletePost(id) } catch (e) { return { success: false, errors: { _form: ['Error al eliminar'] } } }
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/eliminados')
  return { success: true }
}

export async function restorePostAction(id: string) {
  await requireAdmin()
  try { await restorePost(id) } catch (e) { return { success: false, errors: { _form: ['Error al restaurar'] } } }
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/eliminados')
  return { success: true }
}
