import { defineType, defineField } from 'sanity'
import { GENRE_OPTIONS } from '../objects/genre'

export const post = defineType({
  name: 'post',
  title: 'Publicación',
  type: 'document',
  fields: [
    defineField({
      name: 'type',
      title: 'Tipo de publicación',
      type: 'string',
      options: {
        list: [
          { title: 'Imagen', value: 'image' },
          { title: 'Video', value: 'video' },
          { title: 'Álbum', value: 'album' },
          { title: 'Texto', value: 'text' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Texto',
      type: 'text',
      description: 'Contenido para posts de tipo texto, o caption para imagen/video/álbum',
    }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ document }) => document?.type !== 'image',
      fields: [
        {
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'videoSource',
      title: 'Origen del video',
      type: 'string',
      options: {
        list: [
          { title: 'TikTok', value: 'tiktok' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'Nativo (subido acá)', value: 'native' },
        ],
      },
      hidden: ({ document }) => document?.type !== 'video',
    }),
    defineField({
      name: 'videoUrl',
      title: 'URL del video (TikTok/Instagram)',
      type: 'url',
      hidden: ({ document }) => document?.type !== 'video' || document?.videoSource === 'native',
    }),
    defineField({
      name: 'videoFile',
      title: 'Archivo de video nativo',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({ document }) => document?.type !== 'video' || document?.videoSource !== 'native',
    }),
    defineField({
      name: 'album',
      title: 'Álbum',
      type: 'reference',
      to: [{ type: 'album' }],
      hidden: ({ document }) => document?.type !== 'album',
    }),
    defineField({
      name: 'genre',
      title: 'Género musical',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: GENRE_OPTIONS },
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'Publicado', value: 'published' },
          { title: 'Eliminado (borrado lógico)', value: 'deleted' },
        ],
      },
      initialValue: 'published',
      description: 'El borrado real nunca se hace desde acá — el panel admin usa borrado lógico con purga automática a 30 días (ver skill 06).',
    }),
    defineField({
      name: 'deletedAt',
      title: 'Fecha de borrado lógico',
      type: 'datetime',
      hidden: ({ document }) => document?.status !== 'deleted',
      readOnly: true,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'showInPortfolio',
      title: 'Mostrar en Portfolio',
      type: 'boolean',
      initialValue: false,
      description: 'Muestra esta publicación en la galería de Portfolio (independiente del feed).',
    }),
    defineField({
      name: 'portfolioOrder',
      title: 'Orden en Portfolio',
      type: 'number',
      description: 'Menor = primero. Las publicaciones sin valor van al final.',
    }),
    defineField({
      name: 'likesCount',
      title: 'Cantidad de likes',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      description: 'Se actualiza automáticamente, no editar a mano.',
    }),
  ],
  preview: {
    select: { title: 'title', type: 'type', media: 'image' },
    prepare({ title, type, media }) {
      return { title, subtitle: type, media }
    },
  },
})
