import 'server-only'
import { writeClient } from '@/lib/sanity/write-client'
import type { PostFormData } from '@/lib/validations/post'

export async function createPost(data: PostFormData) {
  const slug = data.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const doc: Record<string, unknown> = {
    _type: 'post',
    type: data.type,
    title: data.title,
    slug: { _type: 'slug', current: `${slug}-${Date.now().toString(36)}` },
    body: data.body,
    genre: data.genre ?? [],
    status: 'published',
    publishedAt: new Date().toISOString(),
  }

  if (data.type === 'image' && data.imageAssetId) {
    doc.image = {
      _type: 'image',
      asset: { _type: 'reference', _ref: data.imageAssetId },
      alt: data.imageAlt ?? data.title,
    }
  }

  if (data.type === 'video') {
    doc.videoSource = data.videoSource
    if (data.videoSource === 'native' && data.videoAssetId) {
      doc.videoFile = { _type: 'file', asset: { _type: 'reference', _ref: data.videoAssetId } }
    } else {
      doc.videoUrl = data.videoUrl
    }
  }

  if (data.type === 'album' && data.albumId) {
    doc.album = { _type: 'reference', _ref: data.albumId }
  }

  return writeClient.create(doc as any)
}

export async function updatePost(id: string, data: Partial<PostFormData>) {
  const patch: Record<string, unknown> = {}

  if (data.title !== undefined) patch.title = data.title
  if (data.body !== undefined) patch.body = data.body
  if (data.genre !== undefined) patch.genre = data.genre
  if (data.imageAssetId) {
    patch.image = {
      _type: 'image',
      asset: { _type: 'reference', _ref: data.imageAssetId },
      alt: data.imageAlt ?? data.title,
    }
  }
  if (data.videoUrl !== undefined) patch.videoUrl = data.videoUrl

  return writeClient.patch(id).set(patch).commit()
}

export async function softDeletePost(id: string) {
  return writeClient
    .patch(id)
    .set({ status: 'deleted', deletedAt: new Date().toISOString() })
    .commit()
}

export async function restorePost(id: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await writeClient
      .patch(id)
      .set({ status: 'published' })
      .unset(['deletedAt'])
      .commit()
    return { success: true }
  } catch {
    return { success: false, error: 'Esta publicación ya no está disponible (fue eliminada automáticamente).' }
  }
}
