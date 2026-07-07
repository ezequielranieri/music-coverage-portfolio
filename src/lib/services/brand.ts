import 'server-only'
import { client } from '@/lib/sanity/client'
import { writeClient } from '@/lib/sanity/write-client'
import type { Brand } from '@/types/sanity'

const BRAND_PROJECTION = `{ _id, name, logo { asset->{ url }, alt }, link, order }`

export async function getBrands(): Promise<Brand[]> {
  return client.fetch<Brand[]>(`*[_type == "brand"] | order(order asc, _createdAt desc) ${BRAND_PROJECTION}`)
}

export async function createBrand(data: { name: string; logoAssetId: string; link: string }) {
  return writeClient.create({
    _type: 'brand',
    name: data.name,
    logo: { _type: 'image', asset: { _type: 'reference', _ref: data.logoAssetId } },
    link: data.link,
  })
}

export async function updateBrand(id: string, data: { name?: string; logoAssetId?: string; link?: string }) {
  const patch: Record<string, unknown> = {}
  if (data.name !== undefined) patch.name = data.name
  if (data.link !== undefined) patch.link = data.link
  if (data.logoAssetId) {
    patch.logo = { _type: 'image', asset: { _type: 'reference', _ref: data.logoAssetId } }
  }
  return writeClient.patch(id).set(patch).commit()
}

export async function deleteBrand(id: string) {
  return writeClient.delete(id)
}