import {MenuIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {languageField} from '../fields'

// One per language, fixed `_id: "navigation-<lang>"` (see `structure/`).
export const navigationType = defineType({
  name: 'navigation',
  title: 'Navigazione',
  type: 'document',
  icon: MenuIcon,
  groups: [
    {name: 'header', title: 'Menu in alto', default: true},
    {name: 'footer', title: 'Piè di pagina'},
  ],
  fields: [
    defineField({
      name: 'menu',
      title: 'Voci del menu',
      description: 'Al massimo 5: Associazione, Attività, Eventi, News, Sostienici.',
      type: 'array',
      group: 'header',
      of: [defineArrayMember({type: 'menuItem'})],
      validation: (rule) => rule.required().min(1).max(5),
    }),
    defineField({
      name: 'primaryAction',
      title: 'Pulsante in evidenza',
      description: 'Il bottone distinto dal menu, es. "Diventa socio".',
      type: 'action',
      group: 'header',
    }),
    defineField({
      name: 'footerText',
      title: 'Frase del piè di pagina',
      description: 'Es. "Associazione di volontari per la prevenzione cardiovascolare a Verona."',
      type: 'text',
      rows: 2,
      group: 'footer',
    }),
    defineField({
      name: 'footerLinks',
      title: 'Link del piè di pagina',
      description:
        'Es. Contatti, Trasparenza, Privacy, Cookie. I dati legali arrivano dalle Impostazioni.',
      type: 'array',
      group: 'footer',
      of: [defineArrayMember({type: 'menuItem'})],
    }),
    defineField({
      name: 'footerAction',
      title: 'Invito nel piè di pagina',
      description: 'Es. "Il bene circola. Diventa socio".',
      type: 'action',
      group: 'footer',
    }),
    defineField({
      name: 'credits',
      title: 'Crediti',
      description: 'Es. la licenza del modello 3D del cuore (CC BY 4.0, obbligatoria).',
      type: 'text',
      rows: 3,
      group: 'footer',
    }),
    languageField,
  ],
  preview: {
    select: {language: 'language'},
    prepare: ({language}) => ({title: 'Navigazione', subtitle: language}),
  },
})
