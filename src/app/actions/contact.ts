'use server'

import { headers } from 'next/headers'
import { checkRateLimit } from '@/lib/rate-limit'
import { messageSchema } from '@/lib/validations/message'
import { createMessage } from '@/lib/services/message'
import { revalidatePath } from 'next/cache'

export async function submitContactAction(formData: FormData) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') ?? 'unknown'

  const allowed = await checkRateLimit('contact', ip)
  if (!allowed) {
    return { success: false, errors: { _form: ['Demasiados mensajes enviados, esperá un momento.'] } }
  }

  const parsed = messageSchema.safeParse({
    contactType: formData.get('contactType'),
    senderName: formData.get('senderName'),
    senderEmail: formData.get('senderEmail'),
    body: formData.get('body'),
  })

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }

  try { await createMessage(parsed.data) } catch (e) { return { success: false, errors: { _form: ['Error al enviar el mensaje'] } } }
  revalidatePath('/admin/mensajes')

  return { success: true }
}