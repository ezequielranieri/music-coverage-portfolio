import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full rounded-full bg-surface-raised border border-surface-border px-4 py-2 text-sm text-text-primary placeholder:text-text-secondary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink',
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'
