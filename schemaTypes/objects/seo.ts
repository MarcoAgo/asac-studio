import {SearchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  options: {collapsible: true, collapsed: false},
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo per Google',
      description: 'Se vuoto si usa il titolo della pagina. Meglio sotto i 60 caratteri.',
      type: 'string',
      validation: (rule) => rule.max(60).warning('Oltre i 60 caratteri Google lo taglia.'),
    }),
    defineField({
      name: 'description',
      title: 'Descrizione per Google',
      description: 'Due righe che invogliano a cliccare. Tra 50 e 160 caratteri.',
      type: 'text',
      rows: 3,
      validation: (rule) => [
        rule.min(50).warning('Troppo corta: almeno 50 caratteri.'),
        rule.max(160).warning('Oltre i 160 caratteri Google la taglia.'),
      ],
    }),
    defineField({
      name: 'socialImage',
      title: 'Immagine per la condivisione',
      description: 'Mostrata quando la pagina viene condivisa. Formato consigliato 1200×630.',
      type: 'image',
    }),
    defineField({
      name: 'noIndex',
      title: 'Nascondi dai motori di ricerca',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Indirizzo canonico',
      description: 'Solo se lo stesso contenuto è pubblicato anche altrove. Di solito resta vuoto.',
      type: 'url',
    }),
  ],
})
