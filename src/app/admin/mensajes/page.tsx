import type { Metadata } from 'next'
import { getMessages } from '@/lib/services/message'
import { MessageInbox } from '@/components/admin/message-inbox'

export const metadata: Metadata = { title: 'Mensajes' }

interface MensajesPageProps {
  searchParams: Promise<{ tipo?: string }>
}

export default async function MensajesPage({ searchParams }: MensajesPageProps) {
  const { tipo } = await searchParams
  const messages = await getMessages(tipo as 'prensa' | 'publicidad' | 'consulta' | undefined)

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-6">Mensajes</h1>
      <MessageInbox messages={messages} currentFilter={tipo} />
    </div>
  )
}