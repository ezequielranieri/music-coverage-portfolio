'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface DeleteConfirmDialogProps {
  itemTitle: string
  onConfirm: () => Promise<unknown>
}

export function DeleteConfirmDialog({ itemTitle, onConfirm }: DeleteConfirmDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      await onConfirm()
      setOpen(false)
    })
  }

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)} className="text-state-error">
        Eliminar
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="p-6 max-w-sm">
                <p className="text-text-primary mb-2 font-medium">¿Eliminar &quot;{itemTitle}&quot;?</p>
                <p className="text-sm text-text-secondary mb-6">
                  Queda oculto del feed de inmediato. Tenés 30 días para recuperarlo desde
                  &quot;Elementos eliminados&quot; antes de que se borre para siempre.
                </p>
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button variant="primary" onClick={handleConfirm} disabled={isPending}>
                    {isPending ? 'Eliminando...' : 'Sí, eliminar'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
