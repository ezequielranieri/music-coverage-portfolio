import type { Metadata } from 'next'
import { CreateAlbumForm } from '@/components/admin/create-album-form'

export const metadata: Metadata = { title: 'Crear álbum' }

export default function CrearAlbumPage() {
  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-6">Crear álbum</h1>
      <CreateAlbumForm />
    </div>
  )
}
