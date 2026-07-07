import Image from 'next/image'
import { blurUrl } from '@/lib/image'
import { safeAssetUrl } from '@/lib/safe-asset'
import type { Brand } from '@/types/sanity'

export function BrandsGrid({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null

  return (
    <div>
      <h2 className="text-sm font-medium text-text-secondary mb-3">Marcas con las que trabajé</h2>
      <div className="flex flex-wrap gap-3">
        {brands.map((brand) => (
          <a
            key={brand._id}
            href={brand.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-xl bg-surface-card border border-surface-border px-4 py-2.5 transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink max-w-[180px]"
          >
            <div className="relative h-11 w-32">
              <Image src={safeAssetUrl(brand.logo?.asset)} alt={brand.logo?.alt || brand.name} fill className="object-contain" placeholder="blur" blurDataURL={blurUrl(safeAssetUrl(brand.logo?.asset))} loading="lazy" sizes="128px" />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}