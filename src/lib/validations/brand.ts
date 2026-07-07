import { z } from 'zod'

export const brandSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(80),
  link: z.string().url('Debe ser una URL válida'),
})

export const brandFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(80),
  link: z.string().url('Debe ser una URL válida'),
})