import {
  BookIcon,
  HelpCircleIcon,
  OlistIcon,
  RocketIcon,
  SparklesIcon,
  SplitHorizontalIcon,
  ThListIcon,
} from '@sanity/icons'
import {defineArrayMember, defineField} from 'sanity'
import {parentOf} from '../fields'
import {
  actionsField,
  defineSection,
  introField,
  requiredTitleField,
  titleField,
} from './defineSection'

// Prototype: `.split` chapters (Attività, scheda evento, "Online" in
// Sostienici), `.mission` and the home `.about`.
export const imageWithTextType = defineSection({
  name: 'imageWithText',
  title: 'Testo e immagine',
  description: "Un capitolo di testo, con un'immagine accanto se serve.",
  icon: SplitHorizontalIcon,
  fields: [
    titleField(),
    defineField({
      name: 'statement',
      title: 'Frase in evidenza',
      description: 'Facoltativa: una frase grande sotto il titolo.',
      type: 'text',
      rows: 3,
    }),
    defineField({name: 'text', title: 'Testo', type: 'richText'}),
    defineField({name: 'image', title: 'Immagine', type: 'figure'}),
    defineField({
      name: 'imagePosition',
      title: "Posizione dell'immagine",
      description: 'Alterna destra e sinistra tra capitoli consecutivi.',
      type: 'string',
      initialValue: 'right',
      options: {
        list: [
          {title: 'A destra', value: 'right'},
          {title: 'A sinistra', value: 'left'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      hidden: ({parent}) => !parent?.image?.asset,
    }),
    defineField({
      name: 'facts',
      title: 'Righe di dati',
      description: 'Es. "Per chi", "Come partecipare".',
      type: 'array',
      of: [defineArrayMember({type: 'factRow'})],
    }),
    defineField({
      name: 'showFigures',
      title: "Mostra i numeri dell'associazione",
      description: 'Anno di fondazione, volontari, screening: dalle Impostazioni.',
      type: 'boolean',
      initialValue: false,
    }),
    actionsField(2),
  ],
})

// Prototype: `dl.facts` (Trasparenza, "Come arrivare", scheda evento).
export const factListType = defineSection({
  name: 'factList',
  title: 'Righe di dati',
  description: 'Coppie etichetta e valore, es. i dati identificativi.',
  icon: ThListIcon,
  fields: [
    titleField(),
    introField,
    defineField({
      name: 'useLegalData',
      title: 'Mostra i dati identificativi dalle Impostazioni',
      description: 'Denominazione, codice fiscale, sede legale, RUNTS, PEC ed email.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'rows',
      title: 'Righe',
      type: 'array',
      of: [defineArrayMember({type: 'factRow'})],
      validation: (rule) =>
        rule.custom((rows, context) =>
          rows?.length || parentOf<{useLegalData?: boolean}>(context).useLegalData
            ? true
            : 'Aggiungi almeno una riga, oppure mostra i dati identificativi.',
        ),
    }),
    actionsField(2),
  ],
})

// Prototype: `ul.ends` (quote associative).
export const splitListType = defineSection({
  name: 'splitList',
  title: 'Righe a due capi',
  description: 'Una voce a sinistra e un valore a destra, es. le quote.',
  icon: OlistIcon,
  fields: [
    titleField(),
    introField,
    defineField({
      name: 'rows',
      title: 'Righe',
      type: 'array',
      of: [defineArrayMember({type: 'splitRow'})],
      validation: (rule) => rule.required().min(1),
    }),
  ],
})

// Prototype: `.faq` details.
export const faqType = defineSection({
  name: 'faq',
  title: 'Domande frequenti',
  icon: HelpCircleIcon,
  fields: [
    titleField('Domande frequenti'),
    defineField({
      name: 'items',
      title: 'Domande',
      type: 'array',
      of: [defineArrayMember({type: 'faqItem'})],
      validation: (rule) => rule.required().min(1),
    }),
  ],
})

// Prototype: `ol.route` (Diventa socio, home, "La nostra storia").
export const journeyType = defineSection({
  name: 'journey',
  title: 'Percorso a tappe',
  description: 'Passaggi in ordine, es. come diventare socio o la storia.',
  icon: OlistIcon,
  fields: [
    titleField(),
    introField,
    defineField({name: 'action', title: 'Pulsante sotto il testo', type: 'action'}),
    defineField({
      name: 'steps',
      title: 'Tappe',
      type: 'array',
      of: [defineArrayMember({type: 'step'})],
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: 'membershipFormInFirstStep',
      title: 'Modulo di richiesta socio nella prima tappa',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})

// Prototype: `ul.claims` ("Perché associarsi").
export const highlightsType = defineSection({
  name: 'highlights',
  title: 'Punti in evidenza',
  description: 'Da due a sei punti brevi, es. i motivi per associarsi.',
  icon: SparklesIcon,
  fields: [
    titleField(),
    defineField({
      name: 'items',
      title: 'Punti',
      type: 'array',
      of: [defineArrayMember({type: 'highlight'})],
      validation: (rule) => rule.required().min(2).max(6),
    }),
  ],
})

// Prototype: privacy.html reading mode, with the index built from the H2s.
export const longTextType = defineSection({
  name: 'longText',
  title: 'Testo lungo con indice',
  description: "Per testi lunghi come l'informativa privacy.",
  icon: BookIcon,
  previewField: 'body.0.children.0.text',
  fields: [
    defineField({
      name: 'body',
      title: 'Testo',
      description: 'Ogni "Titolo di capitolo" diventa una voce dell\'indice.',
      type: 'articleText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'showToc',
      title: "Mostra l'indice",
      type: 'boolean',
      initialValue: true,
    }),
  ],
})

// Prototype: `.cta-band`.
export const callToActionType = defineSection({
  name: 'callToAction',
  title: "Invito all'azione",
  description: 'Una frase forte e un pulsante, di solito in fondo alla pagina.',
  icon: RocketIcon,
  fields: [
    requiredTitleField,
    defineField({name: 'text', title: 'Testo', type: 'text', rows: 2}),
    actionsField(2, 1),
  ],
})
