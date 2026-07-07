'use server'

import { requireAdmin } from '@/lib/services/auth'
import { albumSchema } from '@/lib/validations/album'
import { createAlbum } from '@/lib/services/album'
import { revalidatePath } from 'next/cache'

export async function createAlbumAction(formData: FormData) {
  await requireAdmin()

  const rawPhotoAssetIds = formData.getAll('photoAssetId')
  const rawCoverIndex = formData.get('coverIndex')

  const photoAssetIds = rawPhotoAssetIds.map((id) => String(id)).filter(Boolean)
  const coverIndex = rawCoverIndex ? Number(rawCoverIndex) : 0
  const coverImageAssetId = photoAssetIds[coverIndex] ?? photoAssetIds[0]

  if (photoAssetIds.length === 0) {
    return { success: false, errors: { photoAssetIds: ['El álbum necesita al menos una foto'] } }
  }

  const parsed = albumSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    genre: formData.getAll('genre'),
    isDestacado: formData.get('isDestacado') === 'on',
    showInPortfolio: formData.get('showInPortfolio') === 'on',
    portfolioOrder: formData.get('portfolioOrder') || undefined,
    coverImageAssetId,
    photoAssetIds,
  })

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }

  try {
    const album = await createAlbum(parsed.data)
    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/portfolio')
    return { success: true, albumId: album._id }
  } catch (e) {
    return { success: false, errors: { _form: ['Error al crear el álbum'] } }
  }
}
