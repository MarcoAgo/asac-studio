import {DocumentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {languageField, seoField} from '../fields'
import {sectionsField} from '../sections'
import {isUniqueInLanguage, slugifyPath} from '../slug'

// Paths served by code templates (event and article pages), never by a page.
const RESERVED_PREFIXES = ['eventi/', 'news/']
const PATH_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9]+(-[a-z0-9]+)*)*$/

export const pageType = defineType({
  name: 'page',
  title: 'Pagina',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'content', title: 'Contenuto', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      description: 'Il nome della pagina nello Studio e nei risultati di Google.',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Indirizzo',
      description:
        'Il percorso completo dopo /it/, es. "associazione" o "associazione/trasparenza". Cambiarlo rompe i link già condivisi.',
      type: 'slug',
      group: 'content',
      options: {source: 'title', slugify: slugifyPath, isUnique: isUniqueInLanguage},
      validation: (rule) =>
        rule.required().custom((value) => {
          const path = value?.current
          if (!path) return true
          if (!PATH_PATTERN.test(path)) {
            return 'Solo lettere minuscole, numeri e trattini, con "/" tra una parte e l\'altra.'
          }
          if (RESERVED_PREFIXES.some((prefix) => path.startsWith(prefix))) {
            return 'Gli indirizzi che iniziano con "eventi/" o "news/" sono riservati a eventi e notizie.'
          }
          return true
        }),
    }),
    sectionsField,
    languageField,
    seoField,
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current'},
    prepare: ({title, slug}) => ({title, subtitle: slug ? `/${slug}` : undefined}),
  },
})
