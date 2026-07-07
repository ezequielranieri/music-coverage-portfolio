'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu as MenuIcon, X } from 'lucide-react'

const LINKS = [
  { href: '/', label: 'Feed' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/#contacto', label: 'Contacto' },
]

export function MobileNavToggle({ isAdmin }: { isAdmin: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 text-text-secondary hover:text-text-primary transition-colors"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
      >
        {open ? <X size={20} /> : <MenuIcon size={20} />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setOpen(false)} />
          <div className="fixed top-14 right-0 z-50 w-56 bg-surface-card border-l border-surface-border rounded-bl-2xl shadow-xl animate-fade-in-up">
            <nav className="flex flex-col p-4 gap-2 text-sm">
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors">
                  {l.label}
                </Link>
              ))}
              {isAdmin && (
                <Link href="/admin" onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors">
                  Admin
                </Link>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  )
}
