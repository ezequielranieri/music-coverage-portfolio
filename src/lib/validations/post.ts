import { z } from 'zod'

export const postSchema = z.object({
  type: z.enum(['image', 'video', 'album', 'text']),
  title: z.string().min(1, 'El título es obligatorio').max(120),
  body: z.string().max(2000).optional(),
  genre: z.array(z.string()).optional(),
  imageAssetId: z.string().optional(),
  imageAlt: z.string().optional(),
  videoSource: z.enum(['tiktok', 'instagram', 'native']).optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  videoAssetId: z.string().optional(),
  albumId: z.string().optional(),
  showInPortfolio: z.coerce.boolean().optional(),
  portfolioOrder: z.coerce.number().optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'image' && !data.imageAssetId) {
    ctx.addIssue({ code: 'custom', message: 'Falta subir la imagen', path: ['imageAssetId'] })
  }
  if (data.type === 'video' && !data.videoSource) {
    ctx.addIssue({ code: 'custom', message: 'Elegí el origen del video', path: ['videoSource'] })
  }
  if (data.type === 'video' && data.videoSource !== 'native' && !data.videoUrl) {
    ctx.addIssue({ code: 'custom', message: 'Falta la URL del video', path: ['videoUrl'] })
  }
  if (data.type === 'album' && !data.albumId) {
    ctx.addIssue({ code: 'custom', message: 'Elegí o creá un álbum', path: ['albumId'] })
  }
})

export type PostFormData = z.infer<typeof postSchema>

export const updatePostSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').max(120).optional(),
  body: z.string().max(2000).optional(),
  genre: z.array(z.string()).optional(),
  imageAssetId: z.string().optional(),
  imageAlt: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  videoAssetId: z.string().optional(),
  showInPortfolio: z.coerce.boolean().optional(),
  portfolioOrder: z.coerce.number().optional(),
})
