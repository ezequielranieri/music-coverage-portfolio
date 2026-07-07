import { z } from 'zod'

export const commentSchema = z.object({
  postId: z.string().min(1),
  authorName: z.string().min(1, 'Tu nombre es obligatorio').max(60),
  body: z.string().min(1, 'El comentario no puede estar vacío').max(500),
})