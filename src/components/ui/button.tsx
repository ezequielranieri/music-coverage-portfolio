import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'accent-gradient text-white hover:opacity-90 shadow-[0_0_12px_var(--color-accent-pink)] hover:shadow-[0_0_20px_var(--color-accent-pink)]',
  secondary: 'bg-surface-raised text-text-primary hover:bg-surface-border',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
          'disabled:opacity-50 disabled:pointer-events-none',
          variantStyles[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
