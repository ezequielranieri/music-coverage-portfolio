'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { submitContactAction } from '@/app/actions/contact'

const CONTACT_TYPES = [
  { value: 'prensa', label: 'Prensa / Acreditaciones' },
  { value: 'publicidad', label: 'Publicidad / Marcas' },
  { value: 'consulta', label: 'Consulta general' },
] as const

export function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null)

  function handleSubmit(formData: FormData) {
    setErrors(null)
    startTransition(async () => {
      const result = await submitContactAction(formData)
      if (!result.success) setErrors(result.errors ?? null)
      else setSent(true)
    })
  }

  if (sent) {
    return (
      <div id="contacto" className="rounded-2xl bg-surface-card border border-surface-border p-6">
        <p className="text-text-primary">Tu mensaje fue enviado. Te van a responder pronto.</p>
      </div>
    )
  }

  return (
    <form id="contacto" action={handleSubmit} className="rounded-2xl bg-surface-card border border-surface-border p-6 space-y-4 scroll-mt-20">
      <h2 className="font-display text-2xl text-text-primary">Contacto</h2>

      <div>
        <label className="text-sm text-text-secondary mb-2 block">Motivo</label>
        <div className="flex flex-col gap-2">
          {CONTACT_TYPES.map((ct) => (
            <label key={ct.value} className="flex items-center gap-2 text-sm text-text-secondary">
              <input type="radio" name="contactType" value={ct.value} required className="accent-accent-pink" />
              {ct.label}
            </label>
          ))}
        </div>
      </div>

      <Input name="senderName" placeholder="Tu nombre" required maxLength={80} />
      <Input name="senderEmail" type="email" placeholder="Tu email" required />
      <textarea
        name="body"
        placeholder="Tu mensaje..."
        rows={4}
        required
        maxLength={2000}
        className="w-full rounded-2xl bg-surface-raised border border-surface-border px-4 py-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink"
      />

      {errors && (
        <div className="text-sm text-state-error space-y-1">
          {Object.values(errors).flat().map((err, i) => <p key={i}>{err}</p>)}
        </div>
      )}

      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? 'Enviando...' : 'Enviar mensaje'}
      </Button>
    </form>
  )
}