import type { MetadataRoute } from 'next'
import { client } from '@/lib/sanity/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gabrielmaiocco.vercel.app'

  const posts = await client.fetch<{ slug: string; publishedAt: string }[]>(
    `*[_type == "post" && status == "published"]{ "slug": slug.current, publishedAt }`
  )
  const albums = await client.fetch<{ slug: string }[]>(
    `*[_type == "album" && status == "published" && showInPortfolio == true]{ "slug": slug.current }`
  )

  return [
    { url: baseUrl, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/portfolio`, changeFrequency: 'weekly', priority: 0.8 },
    ...posts.map((p) => ({
      url: `${baseUrl}/post/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...albums.map((a) => ({
      url: `${baseUrl}/portfolio/${a.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
