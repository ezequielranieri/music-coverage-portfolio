'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { GENRE_OPTIONS } from '../../../sanity/schemas/objects/genre'

const TYPES = [
  { label: 'Todo', value: undefined },
  { label: 'Fotos', value: 'image' },
  { label: 'Videos', value: 'video' },
  { label: 'Álbumes', value: 'album' },
  { label: 'Texto', value: 'text' },
] as const

interface FeedFiltersProps {
  currentType?: string
  currentGenre?: string
  currentSort?: string
  currentQuery?: string
}

export function FeedFilters({ currentType, currentGenre, currentSort, currentQuery }: FeedFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(currentQuery ?? '')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    setSearchValue(currentQuery ?? '')
  }, [currentQuery])

  function updateParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  function handleSearchChange(value: string) {
    setSearchValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateParam('q', value || undefined)
    }, 400)
  }

  return (
    <div className="space-y-3 mb-6">
      <div className="relative max-w-xl">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Buscar por evento o artista..."
          className="w-full rounded-full bg-surface-raised border border-surface-border pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {TYPES.map((t) => (
          <button
            key={t.label}
            onClick={() => updateParam('type', t.value)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm ${
              currentType === t.value || (!currentType && !t.value)
                ? 'bg-accent-gradient text-white'
                : 'bg-surface-raised text-text-secondary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {GENRE_OPTIONS.map((g) => (
          <button
            key={g.value}
            onClick={() => updateParam('genre', currentGenre === g.value ? undefined : g.value)}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-mono ${
              currentGenre === g.value
                ? 'bg-surface-raised text-accent-pink border border-accent-pink'
                : 'bg-surface-raised text-text-secondary'
            }`}
          >
            {g.title}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => updateParam('sort', undefined)}
          className={`text-sm ${!currentSort || currentSort === 'latest' ? 'text-text-primary font-medium' : 'text-text-secondary'}`}
        >
          Más recientes
        </button>
        <button
          onClick={() => updateParam('sort', 'popular')}
          className={`text-sm ${currentSort === 'popular' ? 'text-text-primary font-medium' : 'text-text-secondary'}`}
        >
          Populares
        </button>
      </div>
    </div>
  )
}