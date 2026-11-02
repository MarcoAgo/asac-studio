import {HomeIcon, PresentationIcon} from '@sanity/icons'
import {defineField} from 'sanity'
import {actionsField, defineSection} from './defineSection'

// The only sections that render the page H1 (piano-infrastruttura §4).

// Prototype: `.page-head` (every inner page; `compact`, and `lost` on the 404).
export const pageHeaderType = defineSection({
  name: 'pageHeader',
  title: 'Intestazione pagina',
  description: 'Il titolo principale della pagina. Va sempre per prima.',
  icon: PresentationIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo principale',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Sottotitolo',
      description: 'Una o due frasi che dicono di cosa parla la pagina.',
      type: 'text',
      rows: 3,
    }),
    defineField({name: 'image', title: 'Immagine', type: 'figure'}),
    defineField({
      name: 'backLink',
      title: 'Link per tornare indietro',
      description: 'Es. "L\'associazione" sopra il titolo della pagina Trasparenza.',
      type: 'action',
    }),
    actionsField(3),
    defineField({
      name: 'variant',
      title: 'Variante',
      type: 'string',
      initialValue: 'default',
      options: {
        list: [
          {title: 'Normale', value: 'default'},
          {title: 'Compatta', value: 'compact'},
          {title: 'Pagina non trovata (con tracciato interrotto)', value: 'notFound'},
        ],
        layout: 'radio',
      },
    }),
  ],
})

// Prototype: index `.hero` (the 3D heart is rendered by the code).
export const heroType = defineSection({
  name: 'hero',
  title: 'Apertura della home',
  description: 'Il cuore animato con il titolo principale. Solo per la home, sempre per prima.',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo principale',
      description: 'Ogni riga va a capo così come la scrivi (es. "Il bene" / "circola.").',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Sottotitolo',
      description: 'Chi siete e cosa fate, in una frase.',
      type: 'text',
      rows: 3,
    }),
    actionsField(2),
  ],
})
