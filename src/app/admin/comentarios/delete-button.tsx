'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { deleteCommentAction } from './actions'

export function DeleteCommentButton({ commentId }: { commentId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      type="button"
      variant="secondary"
      disabled={isPending}
      onClick={() => startTransition(async () => { await deleteCommentAction(commentId); toast.success('Comentario eliminado') })}
    >
      {isPending ? '...' : 'Borrar'}
    </Button>
  )
}
