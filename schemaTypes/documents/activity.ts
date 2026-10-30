import {HeartIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {orderField} from '../fields'
import {EVENT_CATEGORIES, titleOf} from '../lists'
import {slugify} from '../slug'

// Recurring activities, not dated events. Not routable: the slug is the anchor
// of the activity on the Attività page.
export const activityType = defineType({
  name: 'activity',
  title: 'Attività',
  type: 'document',
  icon: HeartIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Ancora',
      description: 'Permette di linkare questa attività: /it/attivita#<ancora>.',
      type: 'slug',
      options: {source: 'title', slugify},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'image', title: 'Immagine', type: 'figure'}),
    defineField({
      name: 'description',
      title: 'Cos’è',
      type: 'richText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'audience',
      title: 'A chi si rivolge',
      description: 'Es. "Tutti, anche chi ha avuto un problema di cuore".',
      type: 'string',
    }),
    defineField({
      name: 'howToTakePart',
      title: 'Come partecipare',
      description: 'Es. "Ritrovo alla partenza, senza iscrizione".',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Eventi collegati',
      description: 'La categoria di eventi da mostrare con il link "Le prossime date".',
      type: 'string',
      options: {list: EVENT_CATEGORIES},
    }),
    orderField,
  ],
  orderings: [{title: 'Ordine', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'title', category: 'category', media: 'image'},
    prepare: ({title, category, media}) => ({
      title,
      media,
      subtitle: titleOf(EVENT_CATEGORIES, category),
    }),
  },
})
