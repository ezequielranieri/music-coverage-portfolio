import { defineType, defineField } from 'sanity'

export const comment = defineType({
  name: 'comment',
  title: 'Comentario',
  type: 'document',
  fields: [
    defineField({
      name: 'post',
      title: 'Publicación',
      type: 'reference',
      to: [{ type: 'post' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'authorName', title: 'Nombre', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'body', title: 'Comentario', type: 'text', validation: (Rule) => Rule.required().max(500) }),
    defineField({
      name: 'visible',
      title: 'Visible públicamente',
      type: 'boolean',
      initialValue: false,
      description: 'El cliente modera manualmente — arranca oculto hasta que lo aprueba desde el panel.',
    }),
    defineField({
      name: 'createdAt',
      title: 'Fecha',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: 'authorName', subtitle: 'body' },
  },
})
