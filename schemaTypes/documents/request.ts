import {EnvelopeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {titleOf} from '../lists'

export const REQUEST_TYPES = [
  {title: 'Contatti', value: 'contact'},
  {title: 'Diventa socio', value: 'membership'},
  {title: 'Donazione', value: 'donation'},
]

export const REQUEST_STATUSES = [
  {title: 'Nuova', value: 'new'},
  {title: 'Presa in carico', value: 'inProgress'},
  {title: 'Archiviata', value: 'archived'},
]

const MEMBERSHIP_FEES = [
  {title: 'Socio ordinario', value: 'ordinary'},
  {title: 'Socio familiare', value: 'family'},
  {title: 'Socio sostenitore', value: 'supporter'},
  {title: 'Non lo so ancora', value: 'undecided'},
]

const CONTACT_REASONS = [
  {title: 'Informazioni', value: 'information'},
  {title: 'Diventare volontario', value: 'volunteering'},
  {title: 'Proporre un evento', value: 'eventProposal'},
  {title: 'Donazioni', value: 'donations'},
  {title: 'Altro', value: 'other'},
]

// Form submissions. Created only by the website, always with
// `_id: "richieste.<uuid>"`: an ID with a dot is never served to
// unauthenticated requests, even from a public dataset. `liveEdit` because
// there is nothing to publish: the document is the record.
export const requestType = defineType({
  name: 'request',
  title: 'Richiesta',
  type: 'document',
  icon: EnvelopeIcon,
  liveEdit: true,
  fields: [
    defineField({
      name: 'type',
      title: 'Tipo',
      type: 'string',
      readOnly: true,
      options: {list: REQUEST_TYPES},
    }),
    defineField({
      name: 'status',
      title: 'Stato',
      type: 'string',
      initialValue: 'new',
      options: {list: REQUEST_STATUSES, layout: 'radio', direction: 'horizontal'},
    }),
    defineField({name: 'name', title: 'Nome e cognome', type: 'string', readOnly: true}),
    defineField({name: 'email', title: 'Email', type: 'string', readOnly: true}),
    defineField({name: 'phone', title: 'Telefono', type: 'string', readOnly: true}),
    defineField({
      name: 'town',
      title: 'Comune',
      type: 'string',
      readOnly: true,
      hidden: ({value}) => !value,
    }),
    defineField({
      name: 'membershipFee',
      title: 'Tipo di quota',
      type: 'string',
      readOnly: true,
      options: {list: MEMBERSHIP_FEES},
      hidden: ({value}) => !value,
    }),
    defineField({
      name: 'reason',
      title: 'Motivo del contatto',
      type: 'string',
      readOnly: true,
      options: {list: CONTACT_REASONS},
      hidden: ({value}) => !value,
    }),
    defineField({name: 'message', title: 'Messaggio', type: 'text', readOnly: true}),
    defineField({
      name: 'attachmentsFolder',
      title: 'Allegati',
      description: 'Cartella privata con i moduli caricati. I file non sono mai salvati su Sanity.',
      type: 'url',
      readOnly: true,
    }),
    defineField({name: 'internalNote', title: 'Nota interna', type: 'text', rows: 3}),
    defineField({name: 'language', title: 'Lingua', type: 'string', readOnly: true}),
    defineField({
      name: 'sourcePage',
      title: 'Inviata dalla pagina',
      type: 'string',
      readOnly: true,
    }),
    // The privacy notice version accepted by the sender (piano-infrastruttura §8).
    defineField({
      name: 'privacyNotice',
      title: 'Informativa accettata',
      type: 'object',
      readOnly: true,
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'id', title: 'Documento', type: 'string'}),
        defineField({name: 'rev', title: 'Versione', type: 'string'}),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Più recenti',
      name: 'createdAtDesc',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'name', type: 'type', status: 'status'},
    prepare: ({title, type, status}) => ({
      title: title ?? 'Senza nome',
      subtitle: [titleOf(REQUEST_TYPES, type), titleOf(REQUEST_STATUSES, status)]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})
