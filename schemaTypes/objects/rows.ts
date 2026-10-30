import {defineField, defineType} from 'sanity'

// Small building blocks used inside sections and settings.

export const factRowType = defineType({
  name: 'factRow',
  title: 'Riga di dati',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Etichetta',
      description: 'Es. "Per chi", "Causale".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Valore',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {select: {title: 'label', subtitle: 'value'}},
})

export const splitRowType = defineType({
  name: 'splitRow',
  title: 'Riga a due capi',
  type: 'object',
  fields: [
    defineField({
      name: 'item',
      title: 'Voce',
      description: 'Es. "Socio ordinario".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'detail',
      title: 'Dettaglio',
      description: 'Es. "Per tutti".',
      type: 'string',
    }),
    defineField({
      name: 'value',
      title: 'Valore a destra',
      description: 'Es. "€ 25" o "da € 50".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'item', detail: 'detail', value: 'value'},
    prepare: ({title, detail, value}) => ({
      title,
      subtitle: [value, detail].filter(Boolean).join(' · '),
    }),
  },
})

export const stepType = defineType({
  name: 'step',
  title: 'Tappa',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'text', title: 'Testo', type: 'text', rows: 3}),
    defineField({
      name: 'note',
      title: 'Nota breve',
      description: 'Es. "Due minuti", "Entro pochi giorni", un anno.',
      type: 'string',
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'note'}},
})

export const faqItemType = defineType({
  name: 'faqItem',
  title: 'Domanda',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Domanda',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Risposta',
      type: 'richText',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {select: {title: 'question'}},
})

export const highlightType = defineType({
  name: 'highlight',
  title: 'Punto',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'text', title: 'Testo', type: 'text', rows: 3}),
  ],
  preview: {select: {title: 'title', subtitle: 'text'}},
})

export const menuItemType = defineType({
  name: 'menuItem',
  title: 'Voce di menu',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Testo',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Collegamento',
      type: 'link',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {select: {title: 'label', subtitle: 'link.internal.title'}},
})
