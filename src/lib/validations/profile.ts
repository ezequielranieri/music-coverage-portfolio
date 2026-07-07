import { z } from 'zod'

export const profileSchema = z.object({
  publicName: z.string().min(1, 'El nombre es obligatorio').max(80),
  role: z.string().max(100).optional(),
  bio: z.string().max(1000).optional(),
  tiktok: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  photoFocalX: z.coerce.number().min(0).max(1).optional(),
  photoFocalY: z.coerce.number().min(0).max(1).optional(),
  coverFocalX: z.coerce.number().min(0).max(1).optional(),
  coverFocalY: z.coerce.number().min(0).max(1).optional(),
})