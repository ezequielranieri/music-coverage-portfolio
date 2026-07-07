import { defineType, defineField } from 'sanity'

export const profile = defineType({
  name: 'profile',
  title: 'Perfil',
  type: 'document',
  fields: [
    defineField({
      name: 'photo',
      title: 'Foto de perfil',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Texto alternativo', type: 'string' }],
    }),
    defineField({ name: 'photoFocalX', title: 'Foco X foto (0-1)', type: 'number', readOnly: true }),
    defineField({ name: 'photoFocalY', title: 'Foco Y foto (0-1)', type: 'number', readOnly: true }),
    defineField({
      name: 'cover',
      title: 'Portada',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Texto alternativo', type: 'string' }],
    }),
    defineField({ name: 'coverFocalX', title: 'Foco X portada (0-1)', type: 'number', readOnly: true }),
    defineField({ name: 'coverFocalY', title: 'Foco Y portada (0-1)', type: 'number', readOnly: true }),
    defineField({ name: 'publicName', title: 'Nombre público', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'role', title: 'Rol / título', type: 'string', description: 'Ej: "Fotógrafo de coberturas y recitales"' }),
    defineField({ name: 'bio', title: 'Sobre mí', type: 'text' }),
    defineField({
      name: 'socialLinks',
      title: 'Redes sociales',
      type: 'object',
      fields: [
        { name: 'tiktok', title: 'TikTok', type: 'url' },
        { name: 'instagram', title: 'Instagram', type: 'url' },
      ],
    }),
    defineField({
      name: 'mediaKitPdf',
      title: 'Media Kit (PDF)',
      type: 'file',
      options: { accept: 'application/pdf' },
      description: 'PDF de una hoja: resumen, mejores fotos, productoras con las que trabajó.',
    }),
  ],
  preview: {
    select: { title: 'publicName', media: 'photo' },
  },
})
