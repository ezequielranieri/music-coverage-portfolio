'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { markReadAction, deleteMessageAction } from '@/app/admin/mensajes/actions'

const FILTERS = [
  { value: undefined, label: 'Todos' },
  { value: 'prensa', label: 'Prensa / Acreditaciones' },
  { value: 'publicidad', label: 'Publicidad / Marcas' },
  { value: 'consulta', label: 'Consulta general' },
] as const

interface Message {
  _id: string
  contactType: 'prensa' | 'publicidad' | 'consulta'
  senderName: string
  senderEmail: string
  body: string
  read: boolean
  receivedAt: string
}

export function MessageInbox({ messages, currentFilter }: { messages: Message[]; currentFilter?: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete(id: string) {
    startTransition(async () => { await deleteMessageAction(id); toast.success('Mensaje eliminado') })
  }

  function handleMarkRead(id: string) {
    startTransition(async () => { await markReadAction(id); toast.success('Marcado como leído') })
  }

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {FILTERS.map((f) => (
          <Link
            key={f.label}
            href={f.value ? `/admin/mensajes?tipo=${f.value}` : '/admin/mensajes'}
            className={`rounded-full px-4 py-1.5 text-sm ${
              currentFilter === f.value ? 'bg-accent-gradient text-white' : 'bg-surface-raised text-text-secondary'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-card border border-surface-border flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <p className="text-text-muted text-sm">No hay mensajes en esta categoría.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <Card key={msg._id} className={`p-4 ${!msg.read ? 'border-accent-pink' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-text-primary font-medium">{msg.senderName}</p>
                  <p className="text-text-muted text-xs">{msg.senderEmail}</p>
                </div>
                <Badge>{FILTERS.find((f) => f.value === msg.contactType)?.label}</Badge>
              </div>
              <p className="text-text-secondary text-sm mb-3">{msg.body}</p>
              <div className="flex gap-2">
                {!msg.read && (
                  <Button variant="ghost" onClick={() => handleMarkRead(msg._id)} disabled={isPending}>
                    Marcar como leído
                  </Button>
                )}
                <Button variant="ghost" onClick={() => handleDelete(msg._id)} disabled={isPending} className="text-state-error">
                  Eliminar
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}