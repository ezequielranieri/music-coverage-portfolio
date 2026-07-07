'use server'

import { requireAdmin } from '@/lib/services/auth'
import { albumSchema } from '@/lib/validations/album'
import { updateAlbum, softDeleteAlbum, restoreAlbum } from '@/lib/services/album'
import { revalidatePath } from 'next/cache'

export async function updateAlbumAction(albumId: string, formData: FormData) {
  await requireAdmin()

  const parsed = albumSchema.partial().safeParse({
    title: formData.get('title') || undefined,
    description: formData.get('description') || undefined,
    genre: formData.getAll('genre'),
    isDestacado: formData.get('isDestacado') === 'on',
    showInPortfolio: formData.get('showInPortfolio') === 'on',
    portfolioOrder: formData.get('portfolioOrder') || undefined,
  })

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }

  try {
    await updateAlbum(albumId, parsed.data)
  } catch (e) {
    return { success: false, errors: { _form: [e instanceof Error ? e.message : 'Error al guardar'] } }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/portfolio')
  revalidatePath(`/admin/albumes/${albumId}`)

  return { success: true }
}

export async function softDeleteAlbumAction(albumId: string) {
  await requireAdmin()

  try { await softDeleteAlbum(albumId) } catch (e) { return { success: false, errors: { _form: ['Error al eliminar'] } } }
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/eliminados')

  return { success: true }
}

export async function restoreAlbumAction(albumId: string) {
  await requireAdmin()

  try { await restoreAlbum(albumId) } catch (e) { return { error: 'Error al restaurar' } }
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/eliminados')

  return { error: null }
}