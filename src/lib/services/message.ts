import 'server-only'
import { writeClient } from '@/lib/sanity/write-client'
import type { MessageFormData } from '@/lib/validations/message'

export async function createMessage(data: MessageFormData) {
  return writeClient.create({
    _type: 'message',
    ...data,
    read: false,
    receivedAt: new Date().toISOString(),
  })
}

export async function getMessages(contactType?: 'prensa' | 'publicidad' | 'consulta') {
  const filter = contactType
    ? `_type == "message" && contactType == $contactType`
    : `_type == "message"`

  return writeClient.fetch<{
    _id: string
    contactType: 'prensa' | 'publicidad' | 'consulta'
    senderName: string
    senderEmail: string
    body: string
    read: boolean
    receivedAt: string
  }[]>(
    `*[${filter}] | order(receivedAt desc) { _id, contactType, senderName, senderEmail, body, read, receivedAt }`,
    contactType ? { contactType } : {}
  )
}

export async function markMessageAsRead(id: string) {
  return writeClient.patch(id).set({ read: true }).commit()
}

export async function deleteMessage(id: string) {
  return writeClient.delete(id)
}