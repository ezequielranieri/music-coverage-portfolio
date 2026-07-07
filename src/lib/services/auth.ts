import 'server-only'
import { auth } from '@clerk/nextjs/server'

export async function requireAdmin() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('No autorizado')
  }

  return userId
}
