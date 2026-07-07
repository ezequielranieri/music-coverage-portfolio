'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { approveCommentAction, rejectCommentAction } from './actions'

export function ApproveRejectButtons({ commentId }: { commentId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="primary"
        disabled={isPending}
        onClick={() => startTransition(async () => { await approveCommentAction(commentId); toast.success('Comentario aprobado') })}
      >
        {isPending ? '...' : 'Aprobar'}
      </Button>
      <Button
        type="button"
        variant="secondary"
        disabled={isPending}
        onClick={() => startTransition(async () => { await rejectCommentAction(commentId); toast.success('Comentario rechazado') })}
      >
        Rechazar
      </Button>
    </div>
  )
}