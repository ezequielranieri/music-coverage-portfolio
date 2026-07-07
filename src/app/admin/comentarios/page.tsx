import type { Metadata } from 'next'
import { getPendingComments, getApprovedComments } from '@/lib/services/comment'

export const metadata: Metadata = { title: 'Comentarios' }
import { ApproveRejectButtons } from './approve-reject-buttons'
import { DeleteCommentButton } from './delete-button'

function CommentCard({
  authorName,
  body,
  createdAt,
  postTitle,
  actions,
}: {
  authorName: string
  body: string
  createdAt: string
  postTitle?: string
  actions: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-surface-card border border-surface-border p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-text-primary">{authorName}</span>
        <span className="text-xs text-text-muted font-mono">{new Date(createdAt).toLocaleString('es-AR')}</span>
      </div>
      <p className="text-sm text-text-secondary mb-1">{body}</p>
      {postTitle && <p className="text-xs text-text-muted mb-3">En: {postTitle}</p>}
      <div className="mt-2">{actions}</div>
    </div>
  )
}

export default async function AdminComentariosPage() {
  const [pending, approved] = await Promise.all([
    getPendingComments(),
    getApprovedComments(),
  ])

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-10">
      <section>
        <h1 className="font-display text-3xl mb-2">Comentarios pendientes</h1>
        <p className="text-sm text-text-secondary mb-8">Aprobá o rechazá los comentarios antes de que se muestren públicamente.</p>

        {pending.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-card border border-surface-border flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            </div>
            <p className="text-text-muted text-sm">No hay comentarios pendientes.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((c) => (
              <CommentCard
                key={c._id}
                authorName={c.authorName}
                body={c.body}
                createdAt={c.createdAt}
                postTitle={c.post?.title}
                actions={<ApproveRejectButtons commentId={c._id} />}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-2xl mb-2">Comentarios aprobados</h2>
        <p className="text-sm text-text-secondary mb-8">Comentarios visibles en el feed. Podés borrarlos si es necesario.</p>

        {approved.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-card border border-surface-border flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <p className="text-text-muted text-sm">No hay comentarios aprobados.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {approved.map((c) => (
              <CommentCard
                key={c._id}
                authorName={c.authorName}
                body={c.body}
                createdAt={c.createdAt}
                postTitle={c.post?.title}
                actions={<DeleteCommentButton commentId={c._id} />}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
