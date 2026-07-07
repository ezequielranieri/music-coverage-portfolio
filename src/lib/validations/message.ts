import { z } from 'zod'

export const messageSchema = z.object({
  contactType: z.enum(['prensa', 'publicidad', 'consulta'], {
    message: 'Elegí un motivo de contacto',
  }),
  senderName: z.string().min(1, 'Tu nombre es obligatorio').max(80),
  senderEmail: z.string().email('Ingresá un email válido'),
  body: z.string().min(1, 'El mensaje no puede estar vacío').max(2000),
})

export type MessageFormData = z.infer<typeof messageSchema>