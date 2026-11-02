import {BulbOutlineIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {languageField, seoField} from '../fields'
import {NEWS_TAGS} from '../lists'
import {isUniqueInLanguage, slugify} from '../slug'

export const newsType = defineType({
  name: 'news',
  title: 'Notizia',
  type: 'document',
  icon: BulbOutlineIcon,
  groups: [
    {name: 'content', title: 'Contenuto', default: true},
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
      description: 'La notizia sarà su /it/news/<indirizzo>.',
      type: 'slug',
      group: 'content',
      options: {source: 'title', slugify, isUnique: isUniqueInLanguage},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Data',
      type: 'date',
      group: 'content',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Argomenti',
      description: 'Il notiziario più recente compare in evidenza in cima alla pagina News.',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'string'})],
      options: {list: NEWS_TAGS},
    }),
    defineField({name: 'image', title: 'Immagine', type: 'figure', group: 'content'}),
    defineField({
      name: 'excerpt',
      title: 'Riassunto',
      description: "Due righe mostrate negli elenchi e sotto il titolo dell'articolo.",
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.max(200).warning('Meglio restare sotto i 200 caratteri.'),
    }),
    defineField({name: 'body', title: 'Testo', type: 'articleText', group: 'content'}),
    defineField({
      name: 'attachments',
      title: 'Allegati',
      description: 'Es. il PDF del notiziario. Solo file pubblici.',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'file',
          options: {accept: 'application/pdf'},
          fields: [
            defineField({
              name: 'title',
              title: 'Titolo',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'featured',
      title: 'In evidenza',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    }),
    languageField,
    seoField,
  ],
  orderings: [{title: 'Più recenti', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', date: 'date', media: 'image'},
    prepare: ({title, date, media}) => ({
      title,
      media,
      subtitle: date
        ? new Date(date).toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : undefined,
    }),
  },
})
