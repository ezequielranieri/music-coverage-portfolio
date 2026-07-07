import Image from 'next/image'
import { cn } from '@/lib/utils'

interface AvatarProps {
  src: string
  alt: string
  size?: number
  hasGradientRing?: boolean
  className?: string
}

export function Avatar({ src, alt, size = 56, hasGradientRing = false, className }: AvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full p-[2px]',
        hasGradientRing ? 'accent-gradient' : 'bg-transparent',
        className
      )}
      style={{ width: size, height: size }}
    >
      <div className="rounded-full overflow-hidden w-full h-full bg-surface-card">
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  )
}
