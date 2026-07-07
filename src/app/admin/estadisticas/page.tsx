import type { Metadata } from 'next'
import { getDashboardStats } from '@/lib/services/stats'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = { title: 'Estadísticas' }

export default async function EstadisticasPage() {
  const { totalViews, totalLikes, postsWithStats, pendingMessages, pendingComments } = await getDashboardStats()

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-6">Estadísticas</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <p className="text-text-muted text-xs mb-1">Vistas totales</p>
          <p className="font-mono text-2xl text-text-primary">{totalViews.toLocaleString('es-AR')}</p>
        </Card>
        <Card className="p-4">
          <p className="text-text-muted text-xs mb-1">Likes totales</p>
          <p className="font-mono text-2xl text-text-primary">{totalLikes.toLocaleString('es-AR')}</p>
        </Card>
        <Card className="p-4">
          <p className="text-text-muted text-xs mb-1">Mensajes sin leer</p>
          <p className="font-mono text-2xl text-accent-pink">{pendingMessages}</p>
        </Card>
        <Card className="p-4">
          <p className="text-text-muted text-xs mb-1">Comentarios pendientes</p>
          <p className="font-mono text-2xl text-accent-pink">{pendingComments}</p>
        </Card>
      </div>

      <h2 className="text-lg text-text-primary mb-3">Vistas por publicación</h2>
      <div className="space-y-2">
        {postsWithStats.map((post) => (
          <div key={post._id} className="flex items-center justify-between rounded-xl bg-surface-card border border-surface-border px-4 py-3">
            <span className="text-text-primary text-sm truncate">{post.title}</span>
            <div className="flex gap-4 flex-shrink-0">
              <Badge>{post.views.toLocaleString('es-AR')} vistas</Badge>
              <Badge>{(post.likesCount ?? 0).toLocaleString('es-AR')} likes</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}