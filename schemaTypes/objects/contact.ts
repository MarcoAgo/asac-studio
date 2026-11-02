import {defineField, defineType} from 'sanity'

// Objects used by `settings`: address, opening hours, bank accounts, socials.

export const addressType = defineType({
  name: 'address',
  title: 'Indirizzo',
  type: 'object',
  fields: [
    defineField({
      name: 'street',
      title: 'Via e numero',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'postalCode',
      title: 'CAP',
      type: 'string',
      validation: (rule) => rule.regex(/^\d{5}$/, {name: 'CAP (5 cifre)'}),
    }),
    defineField({
      name: 'city',
      title: 'Comune',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'province',
      title: 'Provincia',
      description: 'Sigla, es. VR.',
      type: 'string',
      validation: (rule) => rule.regex(/^[A-Z]{2}$/, {name: 'sigla di due lettere maiuscole'}),
    }),
  ],
})

export const openingHoursType = defineType({
  name: 'openingHours',
  title: 'Fascia oraria',
  type: 'object',
  fields: [
    defineField({
      name: 'days',
      title: 'Giorni',
      description: 'Es. "Martedì e giovedì".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hours',
      title: 'Orario',
      description: 'Es. "9:30–12:00".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {select: {title: 'days', subtitle: 'hours'}},
})

export const bankAccountType = defineType({
  name: 'bankAccount',
  title: 'Conto corrente',
  type: 'object',
  fields: [
    defineField({
      name: 'iban',
      title: 'IBAN',
      description: 'Senza spazi o con spazi ogni quattro caratteri.',
      type: 'string',
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            !value || /^IT\d{2}[A-Z]\d{10}[A-Z0-9]{12}$/.test(value.replace(/\s/g, ''))
              ? true
              : 'IBAN italiano non valido (27 caratteri, inizia con IT).',
          ),
    }),
    defineField({
      name: 'holder',
      title: 'Intestato a',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'bank', title: 'Banca', type: 'string'}),
    defineField({
      name: 'paymentReference',
      title: 'Causale suggerita',
      description: 'Es. "Donazione liberale, nome e codice fiscale".',
      type: 'string',
    }),
  ],
  preview: {select: {title: 'iban', subtitle: 'bank'}},
})

export const SOCIAL_PLATFORMS = [
  {title: 'Facebook', value: 'facebook'},
  {title: 'Instagram', value: 'instagram'},
  {title: 'YouTube', value: 'youtube'},
  {title: 'Altro', value: 'other'},
]

export const socialLinkType = defineType({
  name: 'socialLink',
  title: 'Profilo social',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Piattaforma',
      type: 'string',
      options: {list: SOCIAL_PLATFORMS},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Indirizzo del profilo',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['https']}),
    }),
  ],
  preview: {select: {title: 'platform', subtitle: 'url'}},
})
