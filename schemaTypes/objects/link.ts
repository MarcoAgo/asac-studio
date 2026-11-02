import {LinkIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {ANCHOR_PATTERN, requiredWhen} from '../fields'
import {titleOf} from '../lists'

type LinkValue = {type?: string}

export const LINK_TYPES = [
  {title: 'Pagina, evento o notizia', value: 'internal'},
  {title: 'Documento (statuto, bilancio, modulo…)', value: 'document'},
  {title: 'Sito esterno, email o telefono', value: 'external'},
  {title: 'File da scaricare', value: 'file'},
]

// Routable documents a link can point to.
export const LINKABLE_TYPES = [{type: 'page'}, {type: 'event'}, {type: 'news'}]

const unlessType =
  (type: string) =>
  ({parent}: {parent?: LinkValue}) =>
    parent?.type !== type

export const linkType = defineType({
  name: 'link',
  title: 'Collegamento',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'type',
      title: 'Tipo di collegamento',
      type: 'string',
      initialValue: 'internal',
      options: {list: LINK_TYPES, layout: 'radio'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'internal',
      title: 'Pagina',
      type: 'reference',
      to: LINKABLE_TYPES,
      hidden: unlessType('internal'),
      validation: (rule) =>
        rule.custom(requiredWhen<LinkValue>((p) => p.type === 'internal', 'Scegli una pagina.')),
    }),
    defineField({
      name: 'document',
      title: 'Documento',
      type: 'reference',
      to: [{type: 'publicDocument'}],
      hidden: unlessType('document'),
      validation: (rule) =>
        rule.custom(requiredWhen<LinkValue>((p) => p.type === 'document', 'Scegli un documento.')),
    }),
    defineField({
      name: 'external',
      title: 'Indirizzo',
      description: 'Es. https://www.esempio.it, mailto:info@esempio.it, tel:+390450000000',
      type: 'url',
      hidden: unlessType('external'),
      validation: (rule) =>
        rule
          .uri({scheme: ['http', 'https', 'mailto', 'tel']})
          .custom(requiredWhen<LinkValue>((p) => p.type === 'external', "Scrivi l'indirizzo.")),
    }),
    defineField({
      name: 'file',
      title: 'File',
      description: 'Solo file pubblici: mai documenti con dati personali.',
      type: 'file',
      options: {accept: 'application/pdf'},
      hidden: unlessType('file'),
      validation: (rule) =>
        rule.custom(requiredWhen<LinkValue>((p) => p.type === 'file', 'Carica il file.')),
    }),
    defineField({
      name: 'anchor',
      title: 'Ancora',
      description: 'Facoltativa: porta a una sezione della pagina (es. "moduli").',
      type: 'string',
      hidden: unlessType('internal'),
      validation: (rule) =>
        rule.regex(ANCHOR_PATTERN, {name: 'lettere minuscole, numeri e trattini'}),
    }),
  ],
  preview: {
    select: {
      type: 'type',
      internal: 'internal.title',
      document: 'document.title',
      external: 'external',
      file: 'file.asset.originalFilename',
    },
    prepare: ({type, internal, document, external, file}) => ({
      title: internal ?? document ?? external ?? file ?? 'Collegamento',
      subtitle: titleOf(LINK_TYPES, type),
    }),
  },
})
