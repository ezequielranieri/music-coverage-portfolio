'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface px-4">
      <div className="flex flex-col items-center text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-surface-card border border-surface-border flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-state-error">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h1 className="font-display text-4xl text-text-primary mb-2">Algo salió mal</h1>
        <p className="text-text-secondary text-sm mb-8">Ocurrió un error inesperado. Probá de nuevo.</p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-accent-gradient text-white px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  )
}
