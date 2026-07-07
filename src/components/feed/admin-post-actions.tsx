'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Edit, Trash2 } from 'lucide-react'
import { deletePostAction } from '@/app/admin/posts/[id]/actions'
import { ConfirmModal } from '@/components/shared/confirm-modal'

export function AdminPostActions({ postId, isAdmin }: { postId: string; isAdmin: boolean }) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  if (!isAdmin) return null

  function handleDelete() {
    startTransition(async () => {
      await deletePostAction(postId)
      setConfirming(false)
      router.refresh()
    })
  }

  return (
    <div className="absolute top-2 right-2 flex gap-1.5 z-20">
      <Link
        href={`/admin/posts/${postId}`}
        className="flex items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white hover:bg-black/80 transition-colors"
      >
        <Edit size={12} />
        Editar
      </Link>
      <button
        onClick={() => setConfirming(true)}
        className="rounded-full bg-black/60 px-3 py-1.5 text-xs text-white hover:bg-state-error/80 transition-colors"
      >
        <Trash2 size={12} />
      </button>
      <ConfirmModal
        open={confirming}
        title="Eliminar publicación"
        message="Esta publicación se eliminará de forma lógica y se purgará automáticamente en 30 días."
        confirmLabel="Eliminar"
        loading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirming(false)}
      />
    </div>
  )
}
