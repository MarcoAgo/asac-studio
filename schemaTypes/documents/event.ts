import {CalendarIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {languageField, parentOf, seoField} from '../fields'
import {EVENT_CATEGORIES, titleOf} from '../lists'
import {isUniqueInLanguage, slugify} from '../slug'

export const eventType = defineType({
  name: 'event',
  title: 'Evento',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'content', title: 'Contenuto', default: true},
    {name: 'practical', title: 'Informazioni pratiche'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Indirizzo',
      description: "L'evento sarà su /it/eventi/<indirizzo>.",
      type: 'slug',
      group: 'content',
      options: {source: 'title', slugify, isUnique: isUniqueInLanguage},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      group: 'content',
      options: {list: EVENT_CATEGORIES, layout: 'radio', direction: 'horizontal'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'start',
      title: 'Inizio',
      type: 'datetime',
      group: 'content',
      options: {timeStep: 15},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'end',
      title: 'Fine',
      description: 'Facoltativa.',
      type: 'datetime',
      group: 'content',
      options: {timeStep: 15},
      validation: (rule) =>
        rule.custom((end, context) => {
          const {start} = parentOf<{start?: string}>(context)
          if (!end || !start) return true
          return Date.parse(end as string) >= Date.parse(start)
            ? true
            : "La fine non può essere prima dell'inizio."
        }),
    }),
    defineField({name: 'image', title: 'Immagine', type: 'figure', group: 'content'}),
    defineField({name: 'description', title: 'Descrizione', type: 'articleText', group: 'content'}),
    defineField({
      name: 'featured',
      title: 'In evidenza',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    }),
    defineField({
      name: 'location',
      title: 'Luogo',
      description: 'Es. "Lungadige San Giorgio, davanti alla chiesa".',
      type: 'string',
      group: 'practical',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Indirizzo del luogo',
      type: 'string',
      group: 'practical',
    }),
    defineField({
      name: 'mapUrl',
      title: 'Link alla mappa',
      description: 'Es. il link di Google Maps o OpenStreetMap.',
      type: 'url',
      group: 'practical',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'mapImage',
      title: 'Mappa statica',
      description: "Un'immagine della mappa: niente mappe interattive (userebbero cookie).",
      type: 'figure',
      group: 'practical',
    }),
    defineField({
      name: 'free',
      title: 'Gratuito',
      type: 'boolean',
      group: 'practical',
      initialValue: true,
    }),
    defineField({
      name: 'howToTakePart',
      title: 'Come partecipare',
      description: 'Ingresso libero oppure come prenotare (telefono, email).',
      type: 'richText',
      group: 'practical',
    }),
    defineField({
      name: 'poster',
      title: 'Locandina (PDF)',
      type: 'file',
      group: 'practical',
      options: {accept: 'application/pdf'},
    }),
    languageField,
    seoField,
  ],
  orderings: [
    {title: 'Data, più recenti', name: 'startDesc', by: [{field: 'start', direction: 'desc'}]},
    {title: 'Data, più vecchi', name: 'startAsc', by: [{field: 'start', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', start: 'start', category: 'category', media: 'image'},
    prepare: ({title, start, category, media}) => ({
      title,
      media,
      subtitle: [
        start &&
          new Date(start).toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
        titleOf(EVENT_CATEGORIES, category),
      ]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})
