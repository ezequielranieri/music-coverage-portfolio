import 'server-only'
import { client } from '@/lib/sanity/client'
import { writeClient } from '@/lib/sanity/write-client'
import type { Profile } from '@/types/sanity'

const PROFILE_PROJECTION = `{
  _id,
  photo { asset->{ url }, alt },
  photoFocalX,
  photoFocalY,
  cover { asset->{ url }, alt },
  coverFocalX,
  coverFocalY,
  publicName,
  role,
  bio,
  socialLinks,
  mediaKitPdf { asset->{ url, originalFilename } }
}`

export async function getProfile(): Promise<Profile | null> {
  return client.fetch<Profile | null>(`*[_type == "profile"][0] ${PROFILE_PROJECTION}`)
}

export async function updateProfile(id: string, data: Partial<Profile> & { mediaKitAssetId?: string; photoAssetId?: string; coverAssetId?: string }) {
  const patch: Record<string, unknown> = {}

  if (data.publicName !== undefined) patch.publicName = data.publicName
  if (data.role !== undefined) patch.role = data.role
  if (data.bio !== undefined) patch.bio = data.bio
  if (data.socialLinks !== undefined) patch.socialLinks = data.socialLinks
  if (data.photoFocalX !== undefined) patch.photoFocalX = data.photoFocalX
  if (data.photoFocalY !== undefined) patch.photoFocalY = data.photoFocalY
  if (data.coverFocalX !== undefined) patch.coverFocalX = data.coverFocalX
  if (data.coverFocalY !== undefined) patch.coverFocalY = data.coverFocalY

  if (data.photoAssetId) {
    patch.photo = { _type: 'image', asset: { _type: 'reference', _ref: data.photoAssetId } }
  }
  if (data.coverAssetId) {
    patch.cover = { _type: 'image', asset: { _type: 'reference', _ref: data.coverAssetId } }
  }
  if (data.mediaKitAssetId) {
    patch.mediaKitPdf = { _type: 'file', asset: { _type: 'reference', _ref: data.mediaKitAssetId } }
  }

  return writeClient.patch(id).set(patch).commit()
}