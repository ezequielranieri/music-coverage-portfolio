'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ConfirmModal } from '@/components/shared/confirm-modal'
import { safeAssetUrl } from '@/lib/safe-asset'
import { createBrandAction, updateBrandAction, deleteBrandAction } from '@/app/admin/marcas/actions'
import type { Brand } from '@/types/sanity'

export function BrandsManager({ brands }: { brands: Brand[] }) {
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function handleCreate(formData: FormData) {
    setErrors(null)
    setSuccess(false)
    startTransition(async () => {
      const result = await createBrandAction(formData)
      if (!result.success) setErrors((result.errors ?? null) as Record<string, string[]> | null)
      else setSuccess(true)
    })
  }

  function handleUpdate(id: string, formData: FormData) {
    setErrors(null)
    setSuccess(false)
    startTransition(async () => {
      const result = await updateBrandAction(id, formData)
      if (!result.success) setErrors((result.errors ?? null) as Record<string, string[]> | null)
      else {
        setSuccess(true)
        setEditingId(null)
      }
    })
  }

  function handleDelete(id: string) {
    setDeleteId(id)
  }

  function confirmDelete() {
    if (!deleteId) return
    startTransition(async () => {
      try {
        await deleteBrandAction(deleteId)
        toast.success('Marca eliminada')
      } catch { toast.error('Error al eliminar') }
      setDeleteId(null)
    })
  }

  return (
    <div className="space-y-6">
      {brands.map((brand) => (
        <div key={brand._id} className="rounded-2xl bg-surface-card border border-surface-border p-4">
          {editingId === brand._id ? (
            <form action={(fd) => handleUpdate(brand._id, fd)} className="space-y-4">
              <div>
                <label className="text-sm text-text-secondary mb-1 block">Nombre</label>
                <Input name="name" defaultValue={brand.name} required />
              </div>
              <div>
                <label className="text-sm text-text-secondary mb-1 block">Link</label>
                <Input name="link" type="url" defaultValue={brand.link} required />
              </div>
              <div>
                <label className="text-sm text-text-secondary mb-1 block">Logo</label>
                <img src={safeAssetUrl(brand.logo?.asset)} alt={brand.logo?.alt ?? ''} className="w-16 h-16 object-contain mb-2" />
                <input type="file" name="logoFile" accept="image/*" className="text-sm text-text-secondary" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="primary" disabled={isPending}>Guardar</Button>
                <Button type="button" variant="secondary" onClick={() => setEditingId(null)}>Cancelar</Button>
              </div>
            </form>
          ) : (
            <div className="flex items-center gap-4">
              <img src={safeAssetUrl(brand.logo?.asset)} alt={brand.logo?.alt || brand.name} className="w-12 h-12 object-contain" />
              <div className="flex-1">
                <p className="text-sm font-medium">{brand.name}</p>
                <a href={brand.link} target="_blank" rel="noopener noreferrer" className="text-xs text-accent-pink underline">{brand.link}</a>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={() => setEditingId(brand._id)}>Editar</Button>
                <Button type="button" variant="secondary" onClick={() => handleDelete(brand._id)}>Eliminar</Button>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="rounded-2xl bg-surface-card border border-surface-border p-4">
        <h3 className="text-sm font-medium mb-4">Agregar marca</h3>
        <form action={handleCreate} className="space-y-4">
          <div>
            <label className="text-sm text-text-secondary mb-1 block">Nombre</label>
            <Input name="name" required />
          </div>
          <div>
            <label className="text-sm text-text-secondary mb-1 block">Link</label>
            <Input name="link" type="url" placeholder="https://..." required />
          </div>
          <div>
            <label className="text-sm text-text-secondary mb-1 block">Logo</label>
            <input type="file" name="logoFile" accept="image/*" required className="text-sm text-text-secondary" />
          </div>
          {errors && (
            <div className="text-sm text-state-error space-y-1">
              {Object.values(errors).flat().map((err, i) => <p key={i}>{err}</p>)}
            </div>
          )}
          {success && <p className="text-sm text-state-success">Marca creada.</p>}
          <Button type="submit" variant="primary" disabled={isPending}>
            {isPending ? 'Guardando...' : 'Agregar marca'}
          </Button>
        </form>
      </div>

      <ConfirmModal
        open={!!deleteId}
        title="Eliminar marca"
        message="¿Estás seguro de eliminar esta marca? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="danger"
        loading={isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}