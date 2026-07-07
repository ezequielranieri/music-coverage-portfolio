import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-2xl bg-surface-raised', className)}
      {...props}
    />
  )
}
