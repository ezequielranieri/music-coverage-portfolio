'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth, UserButton } from '@clerk/nextjs'
import { PenSquare, Image, FileText, MessageSquare, BarChart3, Flag, Trash2, User, Eye, List, BookOpen, Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin/crear', label: 'Crear publicación', icon: PenSquare },
  { href: '/admin/albumes/crear', label: 'Crear álbum', icon: Image },
  { href: '/admin/publicaciones', label: 'Ver publicaciones', icon: List },
  { href: '/admin/albumes', label: 'Ver álbumes', icon: BookOpen },
  { href: '/admin/comentarios', label: 'Comentarios', icon: MessageSquare },
  { href: '/admin/mensajes', label: 'Mensajes', icon: FileText },
  { href: '/admin/estadisticas', label: 'Estadísticas', icon: BarChart3 },
  { href: '/admin/marcas', label: 'Marcas', icon: Flag },
  { href: '/admin/perfil', label: 'Perfil', icon: User },
  { href: '/admin/eliminados', label: 'Eliminados', icon: Trash2 },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { userId } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 w-11 h-11 rounded-full bg-surface-card border border-surface-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-56 bg-surface-card border-r border-surface-border flex flex-col
        transition-transform duration-300
        lg:relative lg:translate-x-0 lg:min-h-screen
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-surface-border flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <img
              src="/logo.svg"
              alt={process.env.NEXT_PUBLIC_SITE_NAME ?? 'Portfolio'}
              width={100}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-accent-gradient text-white'
                    : 'text-text-secondary hover:bg-surface-raised'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-surface-border flex flex-col gap-2">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-accent-pink hover:bg-surface-raised transition-colors"
          >
            <Eye size={16} />
            Ver sitio público
          </Link>
          <div className="flex items-center gap-3">
            <UserButton />
            {userId && (
              <span className="text-xs text-text-muted">Admin</span>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
