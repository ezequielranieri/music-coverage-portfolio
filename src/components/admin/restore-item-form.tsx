'use client'

import { useActionState } from 'react'
import { restoreItemAction } from '@/app/admin/eliminados/actions'

interface RestoreItemFormProps {
  itemId: string
  type: 'post' | 'album'
}

export function RestoreItemForm({ itemId, type }: RestoreItemFormProps) {
  const [state, action, isPending] = useActionState(restoreItemAction, { error: null })

  return (
    <form action={action}>
      <input type="hidden" name="id" value={itemId} />
      <input type="hidden" name="type" value={type} />
      <button type="submit" disabled={isPending} className="text-sm text-accent-pink hover:underline disabled:opacity-50">
        {isPending ? 'Restaurando...' : 'Restaurar'}
      </button>
      {state?.error && (
        <p className="text-xs text-state-error mt-1">{state.error}</p>
      )}
    </form>
  )
}