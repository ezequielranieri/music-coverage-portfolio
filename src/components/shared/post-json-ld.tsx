import type { Post } from '@/types/sanity'

export function PostJsonLd({ post }: { post: Post }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL

  let jsonLd: Record<string, unknown>

  if (post.type === 'album' || post.type === 'image') {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      name: post.title,
      description: post.body,
      datePublished: post.publishedAt,
      url: `${baseUrl}/post/${post.slug.current}`,
    }
  } else if (post.type === 'video') {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: post.title,
      description: post.body,
      uploadDate: post.publishedAt,
      contentUrl: post.videoUrl,
    }
  } else {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      articleBody: post.body,
      datePublished: post.publishedAt,
      url: `${baseUrl}/post/${post.slug.current}`,
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
