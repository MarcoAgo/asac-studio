import {CommentIcon, EnvelopeIcon, PinIcon} from '@sanity/icons'
import {defineArrayMember, defineField} from 'sanity'
import {FORM_TYPES} from '../lists'
import {defineSection, titleField} from './defineSection'

// Address, hours, phone and email come from the settings.

// Prototype: `.contact` rows (home, and the head of contatti.html).
export const quickContactsType = defineSection({
  name: 'quickContacts',
  title: 'Contatti rapidi',
  description: 'Sede, orari e telefono dalle Impostazioni.',
  icon: CommentIcon,
  fields: [
    titleField('Contatti'),
    defineField({
      name: 'isPageHeading',
      title: 'È il titolo principale della pagina',
      description: 'Sì solo nella pagina Contatti, dove questa sezione va per prima.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({name: 'showEmail', title: "Mostra l'email", type: 'boolean', initialValue: false}),
    defineField({
      name: 'writeToUsLink',
      title: 'Link "Scrivici"',
      description: 'Es. alla sezione con il modulo di contatto.',
      type: 'action',
    }),
  ],
})

// Prototype: contatti #arrivare. A static image with a link: no embedded map,
// so no third-party cookies.
export const staticMapType = defineSection({
  name: 'staticMap',
  title: 'Come arrivare',
  description: 'Mappa statica, link alla mappa e indicazioni.',
  icon: PinIcon,
  fields: [
    titleField('Come arrivare'),
    defineField({name: 'text', title: 'Testo', type: 'text', rows: 3}),
    defineField({
      name: 'mapImage',
      title: 'Mappa statica',
      description: 'Se vuota si usa quella delle Impostazioni.',
      type: 'figure',
    }),
    defineField({
      name: 'mapUrl',
      title: 'Link alla mappa',
      description: 'Se vuoto si usa quello delle Impostazioni.',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'directions',
      title: 'Indicazioni',
      description: 'Es. "A piedi", "In autobus", "In auto".',
      type: 'array',
      of: [defineArrayMember({type: 'factRow'})],
    }),
  ],
})

// Prototype: the contatti and diventa-socio forms. Fields and validation live
// in the code (piano-infrastruttura §8); only the texts are here.
export const requestFormType = defineSection({
  name: 'requestForm',
  title: 'Modulo',
  description: 'Il modulo di contatto o di richiesta socio.',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'formType',
      title: 'Quale modulo',
      type: 'string',
      options: {list: FORM_TYPES, layout: 'radio', direction: 'horizontal'},
      validation: (rule) => rule.required(),
    }),
    titleField(),
    defineField({name: 'text', title: 'Testo', type: 'text', rows: 3}),
    defineField({
      name: 'note',
      title: 'Avvertenza',
      description:
        'Es. "Per un\'emergenza chiama il 112: questo modulo non è un servizio sanitario."',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'successMessage',
      title: "Messaggio dopo l'invio",
      description: 'Es. "Grazie! Ti richiamiamo entro pochi giorni."',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
  ],
})
