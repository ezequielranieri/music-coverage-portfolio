import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { MobileNavToggle } from './mobile-nav-toggle'

export async function PublicNav() {
  const { userId } = await auth()

  return (
    <header className="border-b border-surface-border bg-surface-card">
      <div className="max-w-[1240px] mx-auto flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center shrink-0 group">
          <img
            src="/logo.svg"
            alt={process.env.NEXT_PUBLIC_SITE_NAME ?? 'Portfolio'}
            className="h-10 w-auto animate-logo-enter transition-transform duration-300 group-hover:scale-110"
          />
        </Link>

        <div className="md:hidden">
          <MobileNavToggle isAdmin={!!userId} />
        </div>

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link href="/" className="text-text-secondary hover:text-text-primary transition-colors">Feed</Link>
          <Link href="/portfolio" className="text-text-secondary hover:text-text-primary transition-colors">Portfolio</Link>
          <a href="/#contacto" className="text-text-secondary hover:text-text-primary transition-colors">Contacto</a>
          {userId && <Link href="/admin" className="text-text-secondary hover:text-text-primary transition-colors">Admin</Link>}
        </nav>
      </div>
    </header>
  )
}
