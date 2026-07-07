'use server'

import { requireAdmin } from '@/lib/services/auth'
import { profileSchema } from '@/lib/validations/profile'
import { updateProfile } from '@/lib/services/profile'
import { uploadImageAsset, uploadFileAsset } from '@/lib/services/upload'
import { revalidatePath } from 'next/cache'

export async function updateProfileAction(profileId: string, formData: FormData) {
  await requireAdmin()

  const parsed = profileSchema.safeParse({
    publicName: formData.get('publicName'),
    role: formData.get('role') || undefined,
    bio: formData.get('bio') || undefined,
    tiktok: formData.get('tiktok') || '',
    instagram: formData.get('instagram') || '',
    photoFocalX: formData.get('photoFocalX') || undefined,
    photoFocalY: formData.get('photoFocalY') || undefined,
    coverFocalX: formData.get('coverFocalX') || undefined,
    coverFocalY: formData.get('coverFocalY') || undefined,
  })

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }

  const photoFile = formData.get('photoFile') as File | null
  const coverFile = formData.get('coverFile') as File | null
  const mediaKitFile = formData.get('mediaKitFile') as File | null

  let photoAssetId: string | undefined
  let coverAssetId: string | undefined
  let mediaKitAssetId: string | undefined
  try {
    [photoAssetId, coverAssetId, mediaKitAssetId] = await Promise.all([
      photoFile && photoFile.size > 0 ? uploadImageAsset(photoFile) : undefined,
      coverFile && coverFile.size > 0 ? uploadImageAsset(coverFile) : undefined,
      mediaKitFile && mediaKitFile.size > 0 ? uploadFileAsset(mediaKitFile) : undefined,
    ])
  } catch (e) {
    return { success: false, errors: { _form: ['Error al subir archivos'] } }
  }

  try { await updateProfile(profileId, {
    publicName: parsed.data.publicName,
    role: parsed.data.role,
    bio: parsed.data.bio,
    socialLinks: { tiktok: parsed.data.tiktok, instagram: parsed.data.instagram },
    photoFocalX: parsed.data.photoFocalX,
    photoFocalY: parsed.data.photoFocalY,
    coverFocalX: parsed.data.coverFocalX,
    coverFocalY: parsed.data.coverFocalY,
    photoAssetId,
    coverAssetId,
    mediaKitAssetId,
  })

  } catch (e) {
    return { success: false, errors: { _form: ['Error al guardar el perfil'] } }
  }

  revalidatePath('/')
  revalidatePath('/admin/perfil')

  return { success: true }
}