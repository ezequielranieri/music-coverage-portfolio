import { getAlbumBySlug } from '@/lib/services/album'
import { AlbumCarousel } from '@/components/feed/album-carousel'
import { PublicNav } from '@/components/feed/public-nav'
import { AlbumBreadcrumbJsonLd } from '@/components/shared/album-breadcrumb-json-ld'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const album = await getAlbumBySlug(slug)

  if (!album) return { title: 'Álbum no encontrado' }

  const description = album.description?.slice(0, 160) ?? `Álbum ${album.title}`
  const ogImageUrl = `/api/og?title=${encodeURIComponent(album.title)}&type=album`

  return {
    title: album.title,
    description,
    alternates: { canonical: `/portfolio/${slug}` },
    openGraph: {
      title: album.title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: 'article',
      url: `/portfolio/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: album.title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function PortfolioAlbumPage({ params }: Props) {
  const { slug } = await params
  const album = await getAlbumBySlug(slug)

  if (!album) return notFound()

  return (
    <>
      <PublicNav />
      <AlbumBreadcrumbJsonLd title={album.title} slug={slug} />
      <div className="max-w-[1240px] mx-auto py-6 px-4">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-4"
        >
          <ChevronLeft size={16} />
          Volver al portfolio
        </Link>

        <div className="max-w-xl mx-auto rounded-2xl bg-surface-card border border-surface-border overflow-hidden">
          <AlbumCarousel album={album} />

          <div className="p-4 space-y-2">
            <h1 className="font-display text-2xl text-text-primary">{album.title}</h1>
            {album.description && (
              <p className="text-sm text-text-secondary">{album.description}</p>
            )}
            {album.genre && album.genre.length > 0 && (
              <div className="flex gap-1.5 pt-1">
                {album.genre.map((g) => (
                  <Badge key={g}>{g}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export const revalidate = 3600
