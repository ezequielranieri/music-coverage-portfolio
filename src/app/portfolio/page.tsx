import type { Metadata } from 'next'
import { getPortfolioAlbums } from '@/lib/services/album'
import Image from 'next/image'
import Link from 'next/link'
import { PublicNav } from '@/components/feed/public-nav'
import { Badge } from '@/components/ui/badge'
import { PoweredBy } from '@/components/shared/powered-by'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Álbumes destacados de coberturas de eventos',
}

export default async function PortfolioPage() {
  const albums = await getPortfolioAlbums()

  return (
    <>
      <PublicNav />
      <div className="max-w-[1240px] mx-auto py-6 px-4">
      <h1 className="font-display text-3xl mb-6">Portfolio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {albums.map((album) => (
          <Link key={album._id} href={`/portfolio/${album.slug.current}`} className="rounded-2xl bg-surface-card border border-surface-border overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-pink/20 hover:shadow-lg">
            <div className="relative aspect-video w-full">
              <Image
                src={album.coverImage.asset.url ?? ''}
                alt={album.coverImage.alt || 'Foto del álbum'}
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-5 space-y-1.5">
              <h2 className="font-display text-lg text-text-primary">{album.title}</h2>
              {album.description && (
                <p className="text-sm text-text-secondary line-clamp-2">{album.description}</p>
              )}
              {album.genre && album.genre.length > 0 && (
                <div className="flex gap-1.5 pt-1">
                  {album.genre.map((g) => (
                    <Badge key={g}>{g}</Badge>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      {albums.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-card border border-surface-border flex items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          </div>
          <p className="text-text-muted text-sm">Todavía no hay álbumes en el portfolio.</p>
        </div>
      )}
      </div>
      <PoweredBy />
    </>
  )
}

export const revalidate = 3600