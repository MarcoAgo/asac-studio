import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {parentOf} from '../fields'

type FigureValue = {asset?: unknown; decorative?: boolean}

// `image` is a built-in type name, hence `figure`. Alt text is mandatory unless
// the image is marked as decorative (piano-infrastruttura §4, §11).
export const figureType = defineType({
  name: 'figure',
  title: 'Immagine',
  type: 'image',
  icon: ImageIcon,
  description: 'Mai foto o documenti con dati personali: le immagini su Sanity sono pubbliche.',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Testo alternativo',
      description:
        'Descrivi cosa si vede, per chi non può vedere l\'immagine (es. "Volontari a un gazebo in Piazza Bra").',
      type: 'string',
      validation: (rule) =>
        rule.custom((value, context) => {
          const {asset, decorative} = parentOf<FigureValue>(context)
          if (!asset || decorative || value?.trim()) return true
          return "Scrivi il testo alternativo, oppure segna l'immagine come decorativa."
        }),
    }),
    defineField({
      name: 'decorative',
      title: 'Immagine decorativa',
      description:
        'Solo se non aggiunge informazioni al testo: i lettori di schermo la salteranno.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({name: 'caption', title: 'Didascalia', type: 'string'}),
    defineField({name: 'credit', title: 'Crediti', type: 'string'}),
    // Written by the engraving pipeline (piano-infrastruttura §7), never by hand.
    // `source` is the asset the engraving was made from: it prevents loops.
    defineField({
      name: 'engraved',
      title: 'Versione incisa',
      description: 'Generata automaticamente.',
      type: 'image',
      readOnly: true,
      hidden: ({value}) => !value,
      fields: [defineField({name: 'source', title: 'Immagine di partenza', type: 'string'})],
    }),
  ],
  preview: {
    select: {media: 'asset', title: 'alt', caption: 'caption'},
    prepare: ({media, title, caption}) => ({
      media,
      title: title ?? caption ?? 'Immagine',
    }),
  },
})
