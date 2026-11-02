import {DownloadIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {parentOf} from '../fields'
import {DOCUMENT_CATEGORIES, titleOf, UNDATED_DOCUMENT_CATEGORIES} from '../lists'

// `document` is a built-in type name, hence `publicDocument`. Feeds the
// Trasparenza page automatically (setup-progetto §3, §5).
export const publicDocumentType = defineType({
  name: 'publicDocument',
  title: 'Documento',
  type: 'document',
  icon: DownloadIcon,
  description:
    'Solo documenti pubblici: i file caricati su Sanity sono visibili a chiunque. Mai moduli compilati o dati personali.',
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      description: 'Es. "Bilancio d\'esercizio 2025".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {list: DOCUMENT_CATEGORIES, layout: 'radio'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Anno di riferimento',
      type: 'number',
      hidden: ({parent}) => UNDATED_DOCUMENT_CATEGORIES.has(parent?.category),
      validation: (rule) =>
        rule
          .integer()
          .min(1990)
          .max(new Date().getFullYear() + 1)
          .custom((year, context) => {
            const {category} = parentOf<{category?: string}>(context)
            if (!category || UNDATED_DOCUMENT_CATEGORIES.has(category) || year) return true
            return "Indica l'anno di riferimento."
          }),
    }),
    defineField({
      name: 'file',
      title: 'File PDF',
      type: 'file',
      options: {accept: 'application/pdf'},
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {title: 'Anno, più recenti', name: 'yearDesc', by: [{field: 'year', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title', category: 'category', year: 'year'},
    prepare: ({title, category, year}) => ({
      title,
      subtitle: [titleOf(DOCUMENT_CATEGORIES, category), year].filter(Boolean).join(' · '),
    }),
  },
})
