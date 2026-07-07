'use client'

import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'
import { softDeleteAlbumAction } from './actions'

export function DeleteAlbumButton({ albumId, albumTitle }: { albumId: string; albumTitle: string }) {
  return (
    <DeleteConfirmDialog
      itemTitle={albumTitle}
      onConfirm={async () => {
        await softDeleteAlbumAction(albumId)
      }}
    />
  )
}