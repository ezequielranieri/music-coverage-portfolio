'use client'

import { useState, useTransition, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GENRE_OPTIONS } from '../../../sanity/schemas/objects/genre'
import { updateAlbumAction, softDeleteAlbumAction, restoreAlbumAction } from '@/app/admin/albumes/[id]/actions'
import type { Album } from '@/types/sanity'

export function EditAlbumForm({ album }: { album: Album }) {
  const [showOrder, setShowOrder] = useState(album.showInPortfolio ?? false)
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null)
  const [description, setDescription] = useState(album.description ?? '')
  const [buttonLabel, setButtonLabel] = useState('Guardar cambios')

  useEffect(() => {
    setDescription(album.description ?? '')
  }, [album._id, album.description])

  useEffect(() => {
    if (success) {
      setButtonLabel('✓ Guardado')
      const timer = setTimeout(() => setButtonLabel('Guardar cambios'), 2000)
      return () => clearTimeout(timer)
    }
  }, [success])

  function handleSubmit(formData: FormData) {
    setSuccess(false)
    setErrors(null)
    setButtonLabel('Guardando...')
    startTransition(async () => {
      const result = await updateAlbumAction(album._id, formData)
      if (!result.success) {
        setErrors(result.errors ?? null)
        setButtonLabel('Guardar cambios')
      } else setSuccess(true)
    })
  }

  return (
    <form action={handleSubmit} autoComplete="off" className="max-w-xl space-y-6">
      <div>
        <label className="text-sm text-text-secondary mb-1 block">Título del álbum</label>
        <Input name="title" defaultValue={album.title} required maxLength={120} />
      </div>

      <div>
        <label className="text-sm text-text-secondary mb-1 block">Descripción</label>
        <textarea
          name="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          autoComplete="off"
          className="w-full rounded-2xl bg-surface-raised border border-surface-border px-4 py-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink"
        />
      </div>

      <div>
        <label className="text-sm text-text-secondary mb-2 block">Género musical</label>
        <div className="flex flex-wrap gap-2">
          {GENRE_OPTIONS.map((g) => (
            <label key={g.value} className="flex items-center gap-1.5 text-sm text-text-secondary">
              <input type="checkbox" name="genre" value={g.value} defaultChecked={album.genre?.includes(g.value!)} className="accent-accent-pink" />
              {g.title}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input type="checkbox" name="isDestacado" defaultChecked={album.isDestacado} className="accent-accent-pink" />
          Destacado (aparece como historia y como carrusel en el feed)
        </label>
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input type="checkbox" name="showInPortfolio" defaultChecked={album.showInPortfolio} className="accent-accent-pink" onChange={(e) => setShowOrder(e.target.checked)} />
          Mostrar en Portfolio
        </label>
        {showOrder && (
          <div className="ml-6">
            <label className="text-sm text-text-secondary mb-1 block">Orden en Portfolio (menor = primero)</label>
            <Input name="portfolioOrder" type="number" min={0} defaultValue={album.portfolioOrder ?? undefined} className="w-24" />
          </div>
        )}
      </div>

      {errors && (
        <div className="text-sm text-state-error space-y-1">
          {Object.values(errors).flat().map((err, i) => <p key={i}>{err}</p>)}
        </div>
      )}
      {success && <p className="text-sm text-state-success">Álbum actualizado.</p>}

      <div className="flex gap-2">
        <Button type="submit" variant="primary" disabled={isPending}>
          {buttonLabel}
        </Button>
        <span className="text-xs text-text-muted self-center hidden sm:inline">Ctrl<span className="text-text-secondary">+</span>Enter</span>
      </div>
    </form>
  )
}