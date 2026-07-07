import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { blurUrl } from '@/lib/image'
import { safeAssetUrl } from '@/lib/safe-asset'
import type { Profile } from '@/types/sanity'

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.36 0 .69.07 1 .19V8.28a6.48 6.48 0 0 0-1-.08 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.87a8.24 8.24 0 0 0 4.68 1.5v-3.7a4.83 4.83 0 0 1-1.02.02z" fill="currentColor"/>
    </svg>
  )
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="18" cy="6" r="1.2" fill="currentColor"/>
    </svg>
  )
}

export function ProfileHero({ profile }: { profile: Profile }) {
  return (
    <div className="mb-4">
      <div className="relative h-28 md:h-40 overflow-hidden bg-surface-card">
        {safeAssetUrl(profile.cover?.asset) && (
          <Image src={safeAssetUrl(profile.cover?.asset)} alt={profile.cover?.alt ?? ''} fill className="object-cover" placeholder="blur" blurDataURL={blurUrl(safeAssetUrl(profile.cover?.asset))} style={{ objectPosition: `${(profile.coverFocalX ?? 0.5) * 100}% ${(profile.coverFocalY ?? 0.5) * 100}%` }} priority sizes="100vw" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
      </div>

      <div className="max-w-[1240px] mx-auto px-4">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-surface bg-surface-card flex-shrink-0">
            {safeAssetUrl(profile.photo?.asset) && (
              <Image src={safeAssetUrl(profile.photo?.asset)} alt={profile.photo?.alt ?? profile.publicName} width={96} height={96} className="object-cover w-full h-full" placeholder="blur" blurDataURL={blurUrl(safeAssetUrl(profile.photo?.asset))} style={{ objectPosition: `${(profile.photoFocalX ?? 0.5) * 100}% ${(profile.photoFocalY ?? 0.5) * 100}%` }} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-display text-3xl md:text-4xl text-text-primary break-words leading-tight">{profile.publicName}</h1>
            {profile.role && <p className="text-text-secondary text-sm mt-1">{profile.role}</p>}

            <div className="flex flex-wrap items-center gap-2 mt-3">
              {safeAssetUrl(profile.mediaKitPdf?.asset) && (
                <a
                  href={`${safeAssetUrl(profile.mediaKitPdf?.asset)}?dl=${encodeURIComponent(profile.mediaKitPdf?.asset?.originalFilename ?? 'Media_Kit.pdf')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary">Descargar Media Kit</Button>
                </a>
              )}
              <a href="/#contacto">
                <Button variant="primary">Contactar</Button>
              </a>
            </div>

            {profile.bio && <p className="text-text-secondary text-sm mt-3 leading-relaxed">{profile.bio}</p>}

            {(profile.socialLinks?.tiktok || profile.socialLinks?.instagram) && (
              <div className="flex gap-3 mt-3">
                {profile.socialLinks.tiktok && (
                  <a href={profile.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm">
                    <TikTokIcon size={16} /> TikTok
                  </a>
                )}
                {profile.socialLinks.instagram && (
                  <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm">
                    <InstagramIcon size={16} /> Instagram
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}