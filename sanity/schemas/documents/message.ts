import { defineType, defineField } from 'sanity'

export const message = defineType({
  name: 'message',
  title: 'Mensaje de contacto',
  type: 'document',
  fields: [
    defineField({
      name: 'contactType',
      title: 'Motivo',
      type: 'string',
      options: {
        list: [
          { title: 'Prensa / Acreditaciones', value: 'prensa' },
          { title: 'Publicidad / Marcas', value: 'publicidad' },
          { title: 'Consulta general', value: 'consulta' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'senderName', title: 'Nombre', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'senderEmail', title: 'Email', type: 'string', validation: (Rule) => Rule.required().email() }),
    defineField({ name: 'body', title: 'Mensaje', type: 'text', validation: (Rule) => Rule.required().max(2000) }),
    defineField({
      name: 'read',
      title: 'Leído',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'receivedAt',
      title: 'Fecha de recepción',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: 'senderName', subtitle: 'contactType' },
  },
})
