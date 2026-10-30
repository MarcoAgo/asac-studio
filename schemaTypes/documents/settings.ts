import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

const PHONE_PATTERN = /^\+?[\d\s./-]{6,20}$/

// Singleton, fixed `_id: "settings"` (see `structure/` and `constants.ts`).
// Footer, legal data and SEO defaults all come from here, never hardcoded.
export const settingsType = defineType({
  name: 'settings',
  title: 'Impostazioni',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'identity', title: 'Dati legali', default: true},
    {name: 'contacts', title: 'Contatti'},
    {name: 'support', title: 'Donazioni'},
    {name: 'figures', title: 'Numeri'},
    {name: 'site', title: 'Sito e SEO'},
  ],
  fields: [
    // Identity (setup-progetto §5: mandatory in every public communication)
    defineField({
      name: 'legalName',
      title: 'Denominazione completa',
      description: 'Con la sigla ODV o APS, obbligatoria per legge.',
      type: 'string',
      group: 'identity',
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            !value || /\b(ODV|APS)\b/.test(value)
              ? true
              : {message: 'Manca la sigla ODV o APS.', level: 'warning'},
          ),
    }),
    defineField({
      name: 'taxCode',
      title: 'Codice fiscale',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.regex(/^\d{11}$/, {name: 'codice fiscale di un ente (11 cifre)'}),
    }),
    defineField({
      name: 'vatNumber',
      title: 'Partita IVA',
      description: 'Solo se presente.',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.regex(/^\d{11}$/, {name: 'partita IVA (11 cifre)'}),
    }),
    defineField({
      name: 'runtsNumber',
      title: 'Numero di iscrizione al RUNTS',
      type: 'string',
      group: 'identity',
    }),
    defineField({
      name: 'runtsSection',
      title: 'Sezione del RUNTS',
      description: 'Es. "Organizzazioni di volontariato".',
      type: 'string',
      group: 'identity',
    }),
    defineField({
      name: 'registeredOffice',
      title: 'Sede legale',
      type: 'address',
      group: 'identity',
    }),
    defineField({name: 'logo', title: 'Logo', type: 'figure', group: 'identity'}),

    // Contacts
    defineField({
      name: 'office',
      title: 'Sede aperta al pubblico',
      description: 'Se coincide con la sede legale, ripeti lo stesso indirizzo.',
      type: 'address',
      group: 'contacts',
    }),
    defineField({
      name: 'phone',
      title: 'Telefono',
      type: 'string',
      group: 'contacts',
      validation: (rule) => rule.regex(PHONE_PATTERN, {name: 'numero di telefono'}),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'contacts',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'pec',
      title: 'PEC',
      type: 'string',
      group: 'contacts',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'openingHours',
      title: 'Orari di apertura',
      type: 'array',
      group: 'contacts',
      of: [defineArrayMember({type: 'openingHours'})],
    }),
    defineField({
      name: 'openingHoursNote',
      title: 'Note sugli orari',
      description: 'Es. "Ad agosto chiuso".',
      type: 'string',
      group: 'contacts',
    }),
    defineField({
      name: 'mapUrl',
      title: 'Link alla mappa della sede',
      type: 'url',
      group: 'contacts',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'mapImage',
      title: 'Mappa statica della sede',
      description: "Un'immagine della mappa: niente mappe interattive (userebbero cookie).",
      type: 'figure',
      group: 'contacts',
    }),
    defineField({
      name: 'social',
      title: 'Profili social',
      type: 'array',
      group: 'contacts',
      of: [defineArrayMember({type: 'socialLink'})],
    }),

    // Donations
    defineField({
      name: 'bankAccounts',
      title: 'Conti per le donazioni',
      description: 'Il primo è quello mostrato di default.',
      type: 'array',
      group: 'support',
      of: [defineArrayMember({type: 'bankAccount'})],
    }),
    defineField({
      name: 'fivePerThousandText',
      title: 'Testo del 5×1000',
      description: 'Due righe su come si fa. Usato dove la sezione 5×1000 non ha un testo suo.',
      type: 'text',
      rows: 3,
      group: 'support',
    }),
    defineField({
      name: 'paypalUrl',
      title: 'Link PayPal per le donazioni',
      type: 'url',
      group: 'support',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'satispayUrl',
      title: 'Link Satispay per le donazioni',
      type: 'url',
      group: 'support',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),

    // Figures shown on the home and association pages
    defineField({
      name: 'foundedYear',
      title: 'Anno di fondazione',
      type: 'number',
      group: 'figures',
      validation: (rule) => rule.integer().min(1900).max(new Date().getFullYear()),
    }),
    defineField({
      name: 'volunteerCount',
      title: 'Volontari',
      type: 'number',
      group: 'figures',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'screeningCount',
      title: 'Screening fatti',
      type: 'number',
      group: 'figures',
      validation: (rule) => rule.integer().min(0),
    }),

    // Site and SEO defaults
    defineField({
      name: 'homePage',
      title: 'Pagina iniziale',
      description: 'La pagina mostrata su /it/.',
      type: 'reference',
      to: [{type: 'page'}],
      group: 'site',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seoTitleTemplate',
      title: 'Modello del titolo per Google',
      description: '"%s" viene sostituito dal titolo della pagina.',
      type: 'string',
      group: 'site',
      initialValue: '%s · Amici del Cuore Scaligera',
      validation: (rule) =>
        rule.custom((value) => (!value || value.includes('%s') ? true : 'Deve contenere "%s".')),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Descrizione predefinita per Google',
      type: 'text',
      rows: 3,
      group: 'site',
      validation: (rule) => rule.max(160).warning('Oltre i 160 caratteri Google la taglia.'),
    }),
    defineField({
      name: 'seoImage',
      title: 'Immagine predefinita per la condivisione',
      description: 'Formato consigliato 1200×630.',
      type: 'image',
      group: 'site',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Impostazioni'}),
  },
})
