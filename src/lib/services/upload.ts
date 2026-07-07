import 'server-only'
import { writeClient } from '@/lib/sanity/write-client'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/avif']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const MAX_FILE_SIZE = 20 * 1024 * 1024

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Solo se permiten imágenes JPEG, PNG, WebP o AVIF'
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return 'La imagen no puede superar los 10 MB'
  }
  return null
}

export function validateFileAsset(file: File): string | null {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Solo se permiten archivos PDF, JPEG, PNG, WebP o AVIF'
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'El archivo no puede superar los 20 MB'
  }
  return null
}

export async function uploadImageAsset(file: File) {
  const error = validateImageFile(file)
  if (error) throw new Error(error)

  const asset = await writeClient.assets.upload('image', file, {
    filename: file.name,
  })
  return asset._id
}

export async function uploadFileAsset(file: File) {
  const error = validateFileAsset(file)
  if (error) throw new Error(error)

  const asset = await writeClient.assets.upload('file', file, {
    filename: file.name,
  })
  return asset._id
}
