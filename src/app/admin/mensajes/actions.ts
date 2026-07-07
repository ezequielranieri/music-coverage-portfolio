'use server'

import { requireAdmin } from '@/lib/services/auth'
import { markMessageAsRead, deleteMessage } from '@/lib/services/message'
import { revalidatePath } from 'next/cache'

export async function markReadAction(id: string) {
  await requireAdmin()
  try { await markMessageAsRead(id) } catch (e) { return }
  revalidatePath('/admin/mensajes')
}

export async function deleteMessageAction(id: string) {
  await requireAdmin()
  try { await deleteMessage(id) } catch (e) { return }
  revalidatePath('/admin/mensajes')
}