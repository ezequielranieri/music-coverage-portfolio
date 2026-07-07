import { defineType, defineField } from 'sanity'

export const brand = defineType({
  name: 'brand',
  title: 'Marca',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre de la marca',
      type: 'string',
      description: 'Solo para identificarla en el panel — no se muestra públicamente, solo el logo.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo (fondo transparente)',
      type: 'image',
      options: { hotspot: false },
      description: 'Subí el PNG/WebP tal cual, sin recorte. Debe tener fondo transparente.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link (Instagram o sitio web)',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Orden',
      type: 'number',
      description: 'Opcional — define el orden en el grid. Si se deja vacío, se ordena por fecha de carga.',
    }),
  ],
  preview: {
    select: { title: 'name', media: 'logo' },
  },
})
