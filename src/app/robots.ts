import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gabrielmaiocco.vercel.app'

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/studio', '/api'] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
