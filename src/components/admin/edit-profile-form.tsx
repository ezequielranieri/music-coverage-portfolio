'use client'

import { useState, useTransition, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { safeAssetUrl } from '@/lib/safe-asset'
import { updateProfileAction } from '@/app/admin/perfil/actions'
import type { Profile } from '@/types/sanity'

function FocalPreview({
  src,
  alt,
  className,
  focalX,
  focalY,
  onChange,
}: {
  src: string
  alt: string
  className: string
  focalX: number
  focalY: number
  onChange: (x: number, y: number) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  function getCoords(clientX: number, clientY: number) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.round(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) * 100) / 100
    const y = Math.round(Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)) * 100) / 100
    onChange(x, y)
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    dragging.current = true
    containerRef.current?.setPointerCapture(e.pointerId)
    getCoords(e.clientX, e.clientY)
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return
    getCoords(e.clientX, e.clientY)
  }

  function handlePointerUp() {
    dragging.current = false
  }

  return (
    <div
      ref={containerRef}
      className={`relative cursor-crosshair overflow-hidden touch-none select-none ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" style={{ objectPosition: `${focalX * 100}% ${focalY * 100}%` }} />
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-white shadow-md"
          style={{ left: `${focalX * 100}%`, top: `${focalY * 100}%` }}
        />
      </div>
    </div>
  )
}

export function EditProfileForm({ profile }: { profile: Profile }) {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null)
  const [photoFocalX, setPhotoFocalX] = useState(profile.photoFocalX ?? 0.5)
  const [photoFocalY, setPhotoFocalY] = useState(profile.photoFocalY ?? 0.5)
  const [coverFocalX, setCoverFocalX] = useState(profile.coverFocalX ?? 0.5)
  const [coverFocalY, setCoverFocalY] = useState(profile.coverFocalY ?? 0.5)

  function handleSubmit(formData: FormData) {
    setSuccess(false)
    setErrors(null)
    formData.set('photoFocalX', String(photoFocalX))
    formData.set('photoFocalY', String(photoFocalY))
    formData.set('coverFocalX', String(coverFocalX))
    formData.set('coverFocalY', String(coverFocalY))
    startTransition(async () => {
      const result = await updateProfileAction(profile._id, formData)
      if (!result.success) setErrors(result.errors ?? null)
      else setSuccess(true)
    })
  }

  return (
    <form action={handleSubmit} className="max-w-xl space-y-6">
      <div>
        <label className="text-sm text-text-secondary mb-1 block">Foto de perfil</label>
        {profile.photo?.asset.url && (
          <FocalPreview
            src={profile.photo.asset.url}
            alt=""
            className="w-20 h-20 rounded-full mb-2"
            focalX={photoFocalX}
            focalY={photoFocalY}
            onChange={(x, y) => { setPhotoFocalX(x); setPhotoFocalY(y) }}
          />
        )}
        <p className="text-xs text-text-muted mb-2">Hacé clic en la foto para ajustar el encuadre.</p>
        <input type="file" name="photoFile" accept="image/*" className="text-sm text-text-secondary" />
      </div>

      <div>
        <label className="text-sm text-text-secondary mb-1 block">Foto de portada</label>
        {profile.cover?.asset.url && (
          <FocalPreview
            src={profile.cover.asset.url}
            alt=""
            className="w-full h-24 rounded-xl mb-2"
            focalX={coverFocalX}
            focalY={coverFocalY}
            onChange={(x, y) => { setCoverFocalX(x); setCoverFocalY(y) }}
          />
        )}
        <p className="text-xs text-text-muted mb-2">Hacé clic en la portada para ajustar el encuadre.</p>
        <input type="file" name="coverFile" accept="image/*" className="text-sm text-text-secondary" />
      </div>

      <div>
        <label className="text-sm text-text-secondary mb-1 block">Nombre público</label>
        <Input name="publicName" defaultValue={profile.publicName} required maxLength={80} />
      </div>

      <div>
        <label className="text-sm text-text-secondary mb-1 block">Rol / título</label>
        <Input name="role" defaultValue={profile.role} placeholder="Ej: Fotógrafo de coberturas y recitales" />
      </div>

      <div>
        <label className="text-sm text-text-secondary mb-1 block">Sobre mí</label>
        <textarea
          name="bio"
          rows={5}
          defaultValue={profile.bio}
          className="w-full rounded-2xl bg-surface-raised border border-surface-border px-4 py-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-text-secondary mb-1 block">TikTok</label>
          <Input name="tiktok" type="url" defaultValue={profile.socialLinks?.tiktok} placeholder="https://tiktok.com/@..." />
        </div>
        <div>
          <label className="text-sm text-text-secondary mb-1 block">Instagram</label>
          <Input name="instagram" type="url" defaultValue={profile.socialLinks?.instagram} placeholder="https://instagram.com/..." />
        </div>
      </div>

      <div>
        <label className="text-sm text-text-secondary mb-1 block">Media Kit (PDF)</label>
        {safeAssetUrl(profile.mediaKitPdf?.asset) && (
          <a href={safeAssetUrl(profile.mediaKitPdf?.asset)} target="_blank" rel="noopener noreferrer" className="text-accent-pink underline text-sm block mb-2">
            Ver PDF actual
          </a>
        )}
        <input type="file" name="mediaKitFile" accept="application/pdf" className="text-sm text-text-secondary" />
      </div>

      {errors && (
        <div className="text-sm text-state-error space-y-1">
          {Object.values(errors).flat().map((err, i) => <p key={i}>{err}</p>)}
        </div>
      )}
      {success && <p className="text-sm text-state-success">Perfil actualizado.</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar cambios'}
        </Button>
        <span className="text-xs text-text-muted hidden sm:inline">Ctrl<span className="text-text-secondary">+</span>Enter</span>
      </div>
    </form>
  )
}