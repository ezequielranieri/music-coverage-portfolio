import { defineType, defineField } from 'sanity'
import { GENRE_OPTIONS } from '../objects/genre'

export const album = defineType({
  name: 'album',
  title: 'Álbum',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
    }),
    defineField({
      name: 'coverImage',
      title: 'Portada',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Texto alternativo', type: 'string', validation: (Rule) => Rule.required() },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photos',
      title: 'Fotos del álbum',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Texto alternativo', type: 'string', validation: (Rule) => Rule.required() },
          ],
        },
      ],
      description: 'El orden acá define el orden del carrusel en el feed Y del visor de historia — son la misma fuente.',
      validation: (Rule) => Rule.min(1).error('El álbum necesita al menos una foto'),
    }),
    defineField({
      name: 'isDestacado',
      title: 'Destacado',
      type: 'boolean',
      initialValue: false,
      description: 'Un solo toggle: activa el círculo de historia Y el formato carrusel en el feed al mismo tiempo. No son togles separados.',
    }),
    defineField({
      name: 'showInPortfolio',
      title: 'Mostrar en Portfolio',
      type: 'boolean',
      initialValue: false,
      description: 'Independiente de "Destacado". Controla si aparece en la galería curada de Portfolio.',
    }),
    defineField({
      name: 'portfolioOrder',
      title: 'Orden en Portfolio',
      type: 'number',
      description: 'Menor = primero. Los álbumes sin valor asignado van al final ordenados por fecha.',
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
    }),
    defineField({
      name: 'deletedAt',
      title: 'Fecha de borrado lógico',
      type: 'datetime',
      hidden: ({ document }) => document?.status !== 'deleted',
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', destacado: 'isDestacado' },
    prepare({ title, media, destacado }) {
      return { title, subtitle: destacado ? 'Destacado' : undefined, media }
    },
  },
})
