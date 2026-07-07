'use client'

import { useState, useTransition, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GENRE_OPTIONS } from '../../../sanity/schemas/objects/genre'
import { createAlbumAction } from '@/app/admin/albumes/crear/actions'

export function CreateAlbumForm() {
  const [previews, setPreviews] = useState<string[]>([])
  const [coverIndex, setCoverIndex] = useState(0)
  const [photoAssetIds, setPhotoAssetIds] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 })
  const [showOrder, setShowOrder] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    setPreviews(files.map((f) => URL.createObjectURL(f)))
    setCoverIndex(0)
    setUploading(true)
    setUploadProgress({ done: 0, total: files.length })

    const assetIds: string[] = []
    for (const file of files) {
      const fd = new FormData()
      fd.set('file', file)
      try {
        const res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd })
        const json = await res.json()
        if (json.assetId) assetIds.push(json.assetId)
      } catch {
        assetIds.push('')
      }
      setUploadProgress((p) => ({ ...p, done: p.done + 1 }))
    }

    setPhotoAssetIds(assetIds)
    setUploading(false)
  }

  function handleSubmit(formData: FormData) {
    setErrors(null)
    setSuccess(false)
    formData.set('coverIndex', String(coverIndex))
    photoAssetIds.forEach((id) => formData.append('photoAssetId', id))
    startTransition(async () => {
      const result = await createAlbumAction(formData)
      if (!result.success) setErrors(result.errors ?? null)
      else {
        setSuccess(true)
        setPhotoAssetIds([])
        setPreviews([])
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    })
  }

  const isSubmitting = isPending || uploading

  return (
    <form action={handleSubmit} className="max-w-xl space-y-6">
      <div>
        <label className="text-sm text-text-secondary mb-1 block">Título del álbum</label>
        <Input name="title" required maxLength={120} />
      </div>

      <div>
        <label className="text-sm text-text-secondary mb-1 block">Descripción</label>
        <textarea
          name="description"
          rows={3}
          className="w-full rounded-2xl bg-surface-raised border border-surface-border px-4 py-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink"
        />
      </div>

      <div>
        <label className="text-sm text-text-secondary mb-2 block">Fotos del álbum</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          required
          disabled={uploading}
          onChange={handleFilesChange}
          className="text-sm text-text-secondary"
        />

        {uploading && (
          <p className="text-sm text-text-muted mt-2">
            Subiendo fotos... {uploadProgress.done}/{uploadProgress.total}
          </p>
        )}

        {previews.length > 0 && !uploading && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {previews.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCoverIndex(i)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                  i === coverIndex ? 'border-accent-pink' : 'border-transparent'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                {i === coverIndex && (
                  <span className="absolute bottom-1 left-1 text-[10px] bg-accent-pink text-white rounded-full px-1.5">
                    Portada
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
        {previews.length > 0 && !uploading && (
          <p className="text-xs text-text-muted mt-1">Tocá una foto para elegirla como portada.</p>
        )}
      </div>

      <div>
        <label className="text-sm text-text-secondary mb-2 block">Género musical</label>
        <div className="flex flex-wrap gap-2">
          {GENRE_OPTIONS.map((g) => (
            <label key={g.value} className="flex items-center gap-1.5 text-sm text-text-secondary">
              <input type="checkbox" name="genre" value={g.value} className="accent-accent-pink" />
              {g.title}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input type="checkbox" name="isDestacado" className="accent-accent-pink" />
          Destacado (aparece como historia y como carrusel en el feed)
        </label>
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input type="checkbox" name="showInPortfolio" className="accent-accent-pink" onChange={(e) => setShowOrder(e.target.checked)} />
          Mostrar en Portfolio
        </label>
        {showOrder && (
          <div className="ml-6">
            <label className="text-sm text-text-secondary mb-1 block">Orden en Portfolio (menor = primero)</label>
            <Input name="portfolioOrder" type="number" min={0} className="w-24" />
          </div>
        )}
      </div>

      {errors && (
        <div className="text-sm text-state-error space-y-1">
          {Object.values(errors).flat().map((err, i) => <p key={i}>{err}</p>)}
        </div>
      )}
      {success && <p className="text-sm text-state-success">Álbum creado.</p>}

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {uploading ? `Subiendo fotos... (${uploadProgress.done}/${uploadProgress.total})` : isPending ? 'Creando álbum...' : 'Crear álbum'}
      </Button>
    </form>
  )
}
