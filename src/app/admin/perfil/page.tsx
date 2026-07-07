import type { Metadata } from 'next'
import { getProfile } from '@/lib/services/profile'
import { EditProfileForm } from '@/components/admin/edit-profile-form'

export const metadata: Metadata = { title: 'Perfil' }

export default async function AdminPerfilPage() {
  const profile = await getProfile()

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-text-muted text-sm">Todavía no hay un perfil configurado. Creá uno desde el Studio de Sanity.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="font-display text-3xl mb-8">Editar perfil</h1>
      <EditProfileForm profile={profile} />
    </div>
  )
}