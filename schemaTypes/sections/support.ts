import {BillIcon, CreditCardIcon, HeartFilledIcon} from '@sanity/icons'
import {defineArrayMember, defineField} from 'sanity'
import {actionsField, defineSection, introField, titleField} from './defineSection'

// Tax code, IBANs and texts come from the settings: never typed twice.

// Prototype: home `.support` tiles and sostienici #cinquepermille.
export const fivePerThousandType = defineSection({
  name: 'fivePerThousand',
  title: '5×1000',
  description: 'Il codice fiscale grande e copiabile con un tocco.',
  icon: HeartFilledIcon,
  fields: [
    titleField('Il 5×1000'),
    defineField({
      name: 'text',
      title: 'Testo',
      description: 'Se vuoto si usa il testo del 5×1000 delle Impostazioni.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'note',
      title: 'Nota',
      description: 'Es. "Vale anche per il 730 precompilato".',
      type: 'string',
    }),
    defineField({
      name: 'variant',
      title: 'Aspetto',
      type: 'string',
      initialValue: 'section',
      options: {
        list: [
          {title: 'Banner con foto (home)', value: 'banner'},
          {title: 'Capitolo (pagina Sostienici)', value: 'section'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'image',
      title: 'Immagine',
      type: 'figure',
      hidden: ({parent}) => parent?.variant !== 'banner',
    }),
    actionsField(2),
  ],
})

// Prototype: sostienici #bonifico (IBAN copy box + facts).
export const bankTransferType = defineSection({
  name: 'bankTransfer',
  title: 'Dona con bonifico',
  description: "L'IBAN copiabile con un tocco, dalle Impostazioni.",
  icon: CreditCardIcon,
  fields: [
    titleField('Con un bonifico'),
    defineField({name: 'text', title: 'Testo', type: 'text', rows: 3}),
    defineField({
      name: 'account',
      title: 'Quale conto',
      description: 'La posizione del conto nelle Impostazioni: 1 è il primo.',
      type: 'number',
      initialValue: 1,
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'facts',
      title: 'Righe di dati',
      description: 'Se vuote si mostrano intestatario e causale del conto.',
      type: 'array',
      of: [defineArrayMember({type: 'factRow'})],
    }),
  ],
})

// Prototype: sostienici "Cosa finanzia la tua donazione" (`ul.ends`).
export const donationUsesType = defineSection({
  name: 'donationUses',
  title: 'Cosa finanzia la tua donazione',
  description: 'Esempi concreti con il costo, es. "Un defibrillatore: € 1.200".',
  icon: BillIcon,
  fields: [
    titleField('Cosa finanzia la tua donazione'),
    introField,
    defineField({
      name: 'items',
      title: 'Voci',
      type: 'array',
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          name: 'donationUse',
          title: 'Voce',
          type: 'object',
          fields: [
            defineField({
              name: 'item',
              title: 'Cosa',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'detail', title: 'Dettaglio', type: 'string'}),
            defineField({
              name: 'amount',
              title: 'Costo in euro',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'fromAmount',
              title: 'È un costo minimo ("da € …")',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {title: 'item', amount: 'amount', fromAmount: 'fromAmount'},
            prepare: ({title, amount, fromAmount}) => ({
              title,
              subtitle:
                amount === undefined
                  ? undefined
                  : `${fromAmount ? 'da ' : ''}€ ${Number(amount).toLocaleString('it-IT')}`,
            }),
          },
        }),
      ],
    }),
  ],
})
