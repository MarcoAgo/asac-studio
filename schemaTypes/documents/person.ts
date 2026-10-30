import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {orderField} from '../fields'
import {PERSON_GROUPS, titleOf} from '../lists'

export const personType = defineType({
  name: 'person',
  title: 'Persona',
  type: 'document',
  icon: UserIcon,
  description: 'Pubblica solo dati che la persona ha accettato di mostrare sul sito.',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome e cognome',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Ruolo',
      description: 'Es. "Presidente", "Cardiologo".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'group',
      title: 'Gruppo',
      type: 'string',
      options: {list: PERSON_GROUPS, layout: 'radio'},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'photo', title: 'Foto', type: 'figure'}),
    defineField({
      name: 'bio',
      title: 'Bio breve',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(300),
    }),
    orderField,
  ],
  orderings: [{title: 'Ordine', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', role: 'role', group: 'group', media: 'photo'},
    prepare: ({title, role, group, media}) => ({
      title,
      media,
      subtitle: [role, titleOf(PERSON_GROUPS, group)].filter(Boolean).join(' · '),
    }),
  },
})
