import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'
import { deletePostAction } from './actions'

export function DeletePostButton({ id, title: itemTitle }: { id: string; title: string }) {
  return (
    <DeleteConfirmDialog
      itemTitle={itemTitle}
      onConfirm={deletePostAction.bind(null, id)}
    />
  )
}
