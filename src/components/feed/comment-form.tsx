'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { submitCommentAction } from '@/app/actions/comment'

export function CommentForm({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await submitCommentAction(formData)
      if (!result.success) {
        setError(Object.values(result.errors ?? {}).flat()[0] ?? 'Ocurrió un error.')
      } else {
        setSent(true)
      }
    })
  }

  if (sent) {
    return <p className="text-sm text-text-muted">Tu comentario fue enviado y va a mostrarse una vez aprobado.</p>
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-2">
      <input type="hidden" name="postId" value={postId} />
      <Input name="authorName" placeholder="Tu nombre" required maxLength={60} />
      <textarea
        name="body"
        placeholder="Escribí un comentario..."
        rows={2}
        required
        maxLength={500}
        className="w-full rounded-2xl bg-surface-raised border border-surface-border px-4 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink"
      />
      {error && <p className="text-sm text-state-error">{error}</p>}
      <Button type="submit" variant="secondary" disabled={isPending} className="self-end">
        {isPending ? 'Enviando...' : 'Comentar'}
      </Button>
    </form>
  )
}