'use server'

import { requireAdmin } from '@/lib/services/auth'
import { restorePost } from '@/lib/services/post'
import { restoreAlbum } from '@/lib/services/album'
import { revalidatePath } from 'next/cache'

export async function restoreItemAction(prevState: unknown, formData: FormData) {
  await requireAdmin()

  const id = formData.get('id') as string
  const type = formData.get('type') as 'post' | 'album'

  let result
  if (type === 'post') {
    result = await restorePost(id)
  } else {
    result = await restoreAlbum(id)
  }

  revalidatePath('/admin/eliminados')
  revalidatePath('/')

  if (!result.success) {
    return { error: result.error }
  }

  return { error: null }
}
