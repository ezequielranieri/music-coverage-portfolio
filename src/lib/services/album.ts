import 'server-only'
import { writeClient } from '@/lib/sanity/write-client'
import { client } from '@/lib/sanity/client'
import type { AlbumFormData } from '@/lib/validations/album'
import type { Album } from '@/types/sanity'

export async function createAlbum(data: AlbumFormData) {
  const slug = data.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const albumSlug = `${slug}-${Date.now().toString(36)}`

  const album = await writeClient.create({
    _type: 'album',
    title: data.title,
    slug: { _type: 'slug', current: albumSlug },
    description: data.description,
    genre: data.genre ?? [],
    isDestacado: data.isDestacado,
    showInPortfolio: data.showInPortfolio,
    portfolioOrder: data.portfolioOrder,
    status: 'published',
    coverImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: data.coverImageAssetId },
      alt: `Portada de ${data.title}`,
    },
    photos: data.photoAssetIds.map((assetId, index) => ({
      _type: 'image',
      _key: assetId,
      asset: { _type: 'reference', _ref: assetId },
      alt: `Foto ${index + 1} de ${data.title}`,
    })),
  })

  // Crear automáticamente un post de tipo álbum que referencia este álbum
  await writeClient.create({
    _type: 'post',
    type: 'album',
    title: data.title,
    slug: { _type: 'slug', current: `album-${albumSlug}` },
    album: { _type: 'reference', _ref: album._id },
    genre: data.genre ?? [],
    status: 'published',
    publishedAt: new Date().toISOString(),
    likesCount: 0,
  })

  return album
}

export async function updateAlbum(id: string, data: Partial<AlbumFormData>) {
  const patch: Record<string, unknown> = {}

  if (data.title !== undefined) patch.title = data.title
  if (data.description !== undefined) patch.description = data.description
  if (data.genre !== undefined) patch.genre = data.genre
  if (data.isDestacado !== undefined) patch.isDestacado = data.isDestacado
  if (data.showInPortfolio !== undefined) patch.showInPortfolio = data.showInPortfolio
  if (data.portfolioOrder !== undefined) patch.portfolioOrder = data.portfolioOrder

  const album = await writeClient.patch(id).set(patch).commit()

  // Sincronizar título y género con el post asociado
  if (data.title !== undefined || data.genre !== undefined) {
    try {
      const postPatch: Record<string, unknown> = {}
      if (data.title !== undefined) postPatch.title = data.title
      if (data.genre !== undefined) postPatch.genre = data.genre
      const posts = await client.fetch<{ _id: string }[]>(
        `*[_type == "post" && album._ref == $id && status == "published"]{_id}`,
        { id }
      )
      for (const p of posts) {
        await writeClient.patch(p._id).set(postPatch).commit()
      }
    } catch {
      // El álbum ya se guardó, el post es secundario
    }
  }

  return album
}

async function findAlbumPostId(id: string) {
  const posts = await client.fetch<{ _id: string }[]>(
    `*[_type == "post" && album._ref == $id]{_id}`,
    { id }
  )
  return posts[0]?._id
}

export async function softDeleteAlbum(id: string) {
  const postId = await findAlbumPostId(id)
  const tx = writeClient.transaction()
    .patch(id, { set: { status: 'deleted', deletedAt: new Date().toISOString() } })
  if (postId) {
    tx.patch(postId, { set: { status: 'deleted', deletedAt: new Date().toISOString() } })
  }
  return tx.commit()
}

export async function restoreAlbum(id: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const postId = await findAlbumPostId(id)
    const tx = writeClient.transaction()
      .patch(id, { set: { status: 'published' }, unset: ['deletedAt'] })
    if (postId) {
      tx.patch(postId, { set: { status: 'published' }, unset: ['deletedAt'] })
    }
    await tx.commit()
    return { success: true }
  } catch {
    return { success: false, error: 'Este álbum ya no está disponible (fue eliminado automáticamente).' }
  }
}

export async function getAllAlbumsForSelect() {
  return client.fetch<{ _id: string; title: string }[]>(
    `*[_type == "album" && status == "published"] | order(_createdAt desc) { _id, title }`
  )
}

export async function getDeletedAlbums() {
  return client.fetch<{ _id: string; title: string; deletedAt: string }[]>(
    `*[_type == "album" && status == "deleted"] | order(deletedAt desc) { _id, title, deletedAt }`
  )
}

const ALBUM_PROJECTION = `{
  _id,
  title,
  slug,
  description,
  coverImage { asset->{ url }, alt },
  photos[] { asset->{ url }, alt },
  isDestacado,
  showInPortfolio,
  portfolioOrder,
  genre,
  status
}`

export async function getDestacadosAlbums() {
  return client.fetch<Album[]>(
    `*[_type == "album" && status == "published" && isDestacado == true] | order(_createdAt desc) ${ALBUM_PROJECTION}`
  )
}

export async function getPortfolioAlbums() {
  return client.fetch<Album[]>(
    `*[_type == "album" && status == "published" && showInPortfolio == true] | order(coalesce(portfolioOrder, 9999) asc, _createdAt desc) ${ALBUM_PROJECTION}`
  )
}

export async function getAlbumBySlug(slug: string) {
  return client.fetch<Album | null>(
    `*[_type == "album" && slug.current == $slug && status == "published"][0] ${ALBUM_PROJECTION}`,
    { slug }
  )
}
