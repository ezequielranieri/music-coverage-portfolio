import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PublicNav } from '@/components/feed/public-nav'
import { getPostBySlug } from '@/lib/services/feed'
import { PostCard } from '@/components/feed/post-card'
import { PostJsonLd } from '@/components/shared/post-json-ld'
import { PostBreadcrumbJsonLd } from '@/components/shared/post-breadcrumb-json-ld'
import { auth } from '@clerk/nextjs/server'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) return { title: 'Publicación no encontrada' }

  const description = post.body?.slice(0, 160) ?? `${post.title} — cobertura de evento`
  const ogImageUrl = `/api/og?title=${encodeURIComponent(post.title)}&type=${post.type}${post.image ? `&image=${encodeURIComponent(post.image.asset.url ?? '')}` : ''}`

  return {
    title: post.title,
    description,
    alternates: { canonical: `/post/${slug}` },
    openGraph: {
      title: post.title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: 'article',
      publishedTime: post.publishedAt,
      url: `/post/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  const { userId } = await auth()

  if (!post) notFound()

  return (
    <>
      <PublicNav />
      <PostJsonLd post={post} />
      <PostBreadcrumbJsonLd title={post.title} slug={slug} />
      <div className="max-w-[1240px] mx-auto py-8 px-4">
        <div className="max-w-xl mx-auto space-y-4">
          <h1 className="font-display text-3xl text-text-primary">{post.title}</h1>
          <PostCard post={post} isAdmin={!!userId} />
        </div>
      </div>
    </>
  )
}

export const revalidate = 3600
