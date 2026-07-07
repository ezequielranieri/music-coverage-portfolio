'use client'

import { useState, useTransition, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fadeInUp } from '@/lib/motion'
import { GENRE_OPTIONS } from '../../../sanity/schemas/objects/genre'
import { createPostAction } from '@/app/admin/crear/actions'
import { updatePostAction } from '@/app/admin/posts/[id]/actions'
import type { Post } from '@/types/sanity'

type PostType = 'image' | 'video' | 'album' | 'text'

const TYPE_LABELS: Record<PostType, string> = {
  image: 'Imagen',
  video: 'Video',
  album: 'Álbum',
  text: 'Texto',
}

interface CreatePostFormProps {
  availableAlbums: { _id: string; title: string }[]
  existingPost?: Post
}

export function CreatePostForm({ availableAlbums, existingPost }: CreatePostFormProps) {
  const isEdit = !!existingPost
  const [type, setType] = useState<PostType>((existingPost?.type as PostType) ?? 'image')
  const [videoSource, setVideoSource] = useState<'tiktok' | 'instagram' | 'native'>(
    (existingPost?.videoSource as 'tiktok' | 'instagram' | 'native') ?? 'tiktok'
  )
  const [imageAssetId, setImageAssetId] = useState('')
  const [videoAssetId, setVideoAssetId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null)
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)

  async function handleImageFile(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.set('file', file)
    const res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd })
    const json = await res.json()
    if (json.assetId) setImageAssetId(json.assetId)
    setUploading(false)
  }

  async function handleVideoFile(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.set('file', file)
    const res = await fetch('/api/admin/upload-file', { method: 'POST', body: fd })
    const json = await res.json()
    if (json.assetId) setVideoAssetId(json.assetId)
    setUploading(false)
  }

  function handleSubmit(formData: FormData) {
    setErrors(null)
    setSuccess(false)
    if (imageAssetId) formData.set('imageAssetId', imageAssetId)
    if (videoAssetId) formData.set('videoAssetId', videoAssetId)
    startTransition(async () => {
      if (isEdit && existingPost) {
        const result = await updatePostAction(existingPost._id, formData)
        if (!result.success) setErrors(result.errors ?? null)
        else setSuccess(true)
      } else {
        const result = await createPostAction(formData)
        if (!result.success) setErrors(result.errors ?? null)
        else {
          setSuccess(true)
          setImageAssetId('')
          setVideoAssetId('')
        }
      }
    })
  }

  const isSubmitting = isPending || uploading

  return (
    <form action={handleSubmit} className="max-w-xl space-y-6">
      <div className="flex gap-2">
        {(Object.keys(TYPE_LABELS) as PostType[]).map((t) => (
          <button
            key={t}
            type="button"
            disabled={isEdit}
            onClick={() => setType(t)}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              type === t ? 'bg-accent-gradient text-white' : 'bg-surface-raised text-text-secondary'
            } ${isEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>
      <input type="hidden" name="type" value={type} />

      <div>
        <label className="text-sm text-text-secondary mb-1 block">Título</label>
        <Input name="title" required maxLength={120} defaultValue={existingPost?.title ?? ''} />
      </div>

      {type !== 'album' && (
        <div>
          <label className="text-sm text-text-secondary mb-1 block">
            {type === 'text' ? 'Texto' : 'Descripción (opcional)'}
          </label>
          <textarea
            name="body"
            rows={4}
            defaultValue={existingPost?.body ?? ''}
            className="w-full rounded-2xl bg-surface-raised border border-surface-border px-4 py-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink"
          />
        </div>
      )}
      {type === 'album' && (
        <p className="text-sm text-text-muted">
          La descripción se edita desde la página del álbum.
        </p>
      )}

      <AnimatePresence mode="wait">
        {type === 'image' && (
          <motion.div key="image" variants={fadeInUp} initial="hidden" animate="visible" className="space-y-2">
            <label className="text-sm text-text-secondary block">Imagen</label>
            {imageAssetId ? (
              <p className="text-sm text-state-success">Imagen subida.</p>
            ) : (
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                required={!isEdit}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageFile(file)
                }}
                className="text-sm text-text-secondary"
              />
            )}
            <Input name="imageAlt" placeholder="Texto alternativo (para accesibilidad y SEO)" defaultValue={existingPost?.image?.alt ?? ''} />
          </motion.div>
        )}

        {type === 'video' && (
          <motion.div key="video" variants={fadeInUp} initial="hidden" animate="visible" className="space-y-2">
            <label className="text-sm text-text-secondary block">Origen del video</label>
            <select
              name="videoSource"
              value={videoSource}
              onChange={(e) => setVideoSource(e.target.value as typeof videoSource)}
              className="w-full rounded-full bg-surface-raised border border-surface-border px-4 py-2 text-sm text-text-primary"
            >
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="native">Subir archivo</option>
            </select>
            {videoSource === 'native' ? (
              videoAssetId ? (
                <p className="text-sm text-state-success">Video subido.</p>
              ) : (
                <input
                  type="file"
                  accept="video/*"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleVideoFile(file)
                  }}
                  className="text-sm text-text-secondary"
                />
              )
            ) : (
              <Input name="videoUrl" placeholder="URL del video" type="url" defaultValue={existingPost?.videoUrl ?? ''} />
            )}
          </motion.div>
        )}

        {type === 'album' && !existingPost?.album && (
          <motion.div key="album" variants={fadeInUp} initial="hidden" animate="visible" className="space-y-2">
            <label className="text-sm text-text-secondary block">Álbum</label>
            <select
              name="albumId"
              className="w-full rounded-full bg-surface-raised border border-surface-border px-4 py-2 text-sm text-text-primary"
            >
              <option value="">Elegí un álbum...</option>
              {availableAlbums.map((album) => (
                <option key={album._id} value={album._id}>{album.title}</option>
              ))}
            </select>
            <a href="/admin/albumes/crear" target="_blank" rel="noopener noreferrer" className="text-xs text-accent-pink underline">
              ¿Necesitás crear un álbum nuevo primero? Abrir en pestaña nueva
            </a>
          </motion.div>
        )}
        {type === 'album' && existingPost?.album && (
          <input type="hidden" name="albumId" value={existingPost.album._id} />
        )}
      </AnimatePresence>

      <div>
        <label className="text-sm text-text-secondary mb-2 block">Género musical</label>
        <div className="flex flex-wrap gap-2">
          {GENRE_OPTIONS.map((g) => (
            <label key={g.value} className="flex items-center gap-1.5 text-sm text-text-secondary">
              <input
                type="checkbox"
                name="genre"
                value={g.value}
                defaultChecked={existingPost?.genre?.includes(g.value!) ?? false}
                className="accent-accent-pink"
              />
              {g.title}
            </label>
          ))}
        </div>
      </div>

      {errors && (
        <div className="text-sm text-state-error space-y-1">
          {Object.values(errors).flat().map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}

      {success && <p className="text-sm text-state-success">{isEdit ? 'Publicación actualizada.' : 'Publicación creada.'}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {uploading ? 'Subiendo archivo...' : isPending ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Publicar'}
        </Button>
        <span className="text-xs text-text-muted hidden sm:inline">Ctrl<span className="text-text-secondary">+</span>Enter</span>
      </div>
    </form>
  )
}
