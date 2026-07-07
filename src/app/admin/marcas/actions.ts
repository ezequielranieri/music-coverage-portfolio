'use server'

import { requireAdmin } from '@/lib/services/auth'
import { brandSchema } from '@/lib/validations/brand'
import { createBrand, updateBrand, deleteBrand } from '@/lib/services/brand'
import { uploadImageAsset } from '@/lib/services/upload'
import { revalidatePath } from 'next/cache'

export async function createBrandAction(formData: FormData) {
  await requireAdmin()

  const parsed = brandSchema.safeParse({
    name: formData.get('name'),
    link: formData.get('link'),
  })

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }

  const logoFile = formData.get('logoFile') as File | null
  if (!logoFile || logoFile.size === 0) {
    return { success: false, errors: { logoFile: ['El logo es obligatorio'] } }
  }

  let logoAssetId: string
  try { logoAssetId = await uploadImageAsset(logoFile) } catch (e) { return { success: false, errors: { _form: ['Error al subir el logo'] } } }

  try { await createBrand({ name: parsed.data.name, logoAssetId, link: parsed.data.link }) } catch (e) { return { success: false, errors: { _form: ['Error al crear la marca'] } } }

  revalidatePath('/')
  revalidatePath('/admin/marcas')

  return { success: true }
}

export async function updateBrandAction(brandId: string, formData: FormData) {
  await requireAdmin()

  const parsed = brandSchema.safeParse({
    name: formData.get('name'),
    link: formData.get('link'),
  })

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }

  const logoFile = formData.get('logoFile') as File | null
  let logoAssetId: string | undefined
  if (logoFile && logoFile.size > 0) {
    try { logoAssetId = await uploadImageAsset(logoFile) } catch (e) { return { success: false, errors: { _form: ['Error al subir el logo'] } } }
  }

  try { await updateBrand(brandId, { name: parsed.data.name, link: parsed.data.link, logoAssetId }) } catch (e) { return { success: false, errors: { _form: ['Error al actualizar'] } } }

  revalidatePath('/')
  revalidatePath('/admin/marcas')

  return { success: true }
}

export async function deleteBrandAction(brandId: string) {
  await requireAdmin()

  try { await deleteBrand(brandId) } catch (e) { return { success: false, errors: { _form: ['Error al eliminar'] } } }

  revalidatePath('/')
  revalidatePath('/admin/marcas')

  return { success: true }
}