import 'server-only'
import { client } from '@/lib/sanity/client'
import type { Post, Album } from '@/types/sanity'

interface PortfolioItem {
  _type: 'album' | 'post'
  _id: string
  title: string
  slug: { current: string }
  description?: string
  coverUrl: string
  coverAlt: string
  genre?: string[]
  portfolioOrder?: number
}

const POST_PROJECTION = `{
  _id,
  "coverUrl": coalesce(image.asset->url, videoFile.asset->url, ""),
  "coverAlt": coalesce(image.alt, ""),
  title,
  slug,
  body,
  genre,
  portfolioOrder,
  "description": body
}`

const ALBUM_PROJECTION = `{
  _id,
  title,
  slug,
  "coverUrl": coverImage.asset->url,
  "coverAlt": coverImage.alt,
  description,
  genre,
  portfolioOrder
}`

export async function getPortfolioItems() {
  const [posts, albums] = await Promise.all([
    client.fetch<PortfolioItem[]>(
      `*[_type == "post" && status == "published" && showInPortfolio == true] | order(coalesce(portfolioOrder, 9999) asc, publishedAt desc) ${POST_PROJECTION}`
    ),
    client.fetch<PortfolioItem[]>(
      `*[_type == "album" && status == "published" && showInPortfolio == true] | order(coalesce(portfolioOrder, 9999) asc, _createdAt desc) ${ALBUM_PROJECTION}`
    ),
  ])

  posts.forEach((p) => (p._type = 'post'))
  albums.forEach((a) => (a._type = 'album'))

  const all = [...albums, ...posts].sort(
    (a, b) => (a.portfolioOrder ?? 9999) - (b.portfolioOrder ?? 9999)
  )

  return all
}