'use server'

import { requireAdmin } from '@/lib/services/auth'
import { approveComment, rejectComment, deleteComment } from '@/lib/services/comment'
import { revalidatePath } from 'next/cache'

export async function approveCommentAction(id: string) {
  await requireAdmin()
  try { await approveComment(id) } catch (e) { return { success: false } }
  revalidatePath('/')
  revalidatePath('/admin/comentarios')
  return { success: true }
}

export async function rejectCommentAction(id: string) {
  await requireAdmin()
  try { await rejectComment(id) } catch (e) { return { success: false } }
  revalidatePath('/admin/comentarios')
  return { success: true }
}

export async function deleteCommentAction(id: string) {
  await requireAdmin()
  try { await deleteComment(id) } catch (e) { return { success: false } }
  revalidatePath('/admin/comentarios')
  return { success: true }
}