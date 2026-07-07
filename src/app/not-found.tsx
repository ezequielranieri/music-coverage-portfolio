import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface px-4">
      <div className="flex flex-col items-center text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-surface-card border border-surface-border flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
            <circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </div>
        <h1 className="font-display text-4xl text-text-primary mb-2">Página no encontrada</h1>
        <p className="text-text-secondary text-sm mb-8">La página que buscás no existe o fue movida.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-accent-gradient text-white px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
