import {defineField, defineType} from 'sanity'

// Phase 1: just enough to render a title. Page builder sections come in phase 2.
export const paginaType = defineType({
  name: 'pagina',
  title: 'Pagina',
  type: 'document',
  fields: [
    defineField({
      name: 'titolo',
      title: 'Titolo',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Indirizzo',
      type: 'slug',
      options: {source: 'titolo'},
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'titolo', slug: 'slug.current'},
    prepare: ({title, slug}) => ({title, subtitle: slug ? `/${slug}` : undefined}),
  },
})
