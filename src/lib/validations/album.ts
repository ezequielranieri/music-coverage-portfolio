import { z } from 'zod'

export const albumSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').max(120),
  description: z.string().max(1000).optional(),
  genre: z.array(z.string()).optional(),
  isDestacado: z.boolean().default(false),
  showInPortfolio: z.boolean().default(false),
  portfolioOrder: z.coerce.number().int().min(0).optional(),
  coverImageAssetId: z.string().min(1, 'Falta la portada'),
  photoAssetIds: z.array(z.string()).min(1, 'El álbum necesita al menos una foto'),
})

export type AlbumFormData = z.infer<typeof albumSchema>
