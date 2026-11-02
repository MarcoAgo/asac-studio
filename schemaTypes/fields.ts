import {defineField, type FieldDefinition, type ValidationContext} from 'sanity'
import {DEFAULT_LANGUAGE} from '../constants'
import {SECTION_BACKGROUNDS} from './lists'

export const ANCHOR_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

// Read by the parent object in conditional validations.
export const parentOf = <T>(context: ValidationContext) => (context.parent ?? {}) as T

// Custom validator: the field is required only when the sibling values say so.
export const requiredWhen =
  <T>(isRequired: (parent: T) => boolean, message: string) =>
  (value: unknown, context: ValidationContext) =>
    isRequired(parentOf<T>(context)) && !value ? message : true

// Hidden for now: one language only. A translation plugin can take it over.
export const languageField = defineField({
  name: 'language',
  title: 'Lingua',
  type: 'string',
  initialValue: DEFAULT_LANGUAGE,
  readOnly: true,
  hidden: true,
})

export const seoField = defineField({
  name: 'seo',
  title: 'SEO',
  type: 'seo',
  group: 'seo',
})

export const orderField = defineField({
  name: 'order',
  title: 'Ordine',
  description: 'I numeri più bassi vengono mostrati per primi.',
  type: 'number',
  validation: (rule) => rule.integer().min(0),
})

export const appearanceFieldset = {
  name: 'appearance',
  title: 'Aspetto e posizione',
  options: {collapsible: true, collapsed: true},
}

// Options shared by every page builder section (piano-infrastruttura §4).
export const sectionFields: FieldDefinition[] = [
  defineField({
    name: 'background',
    title: 'Colore di sfondo',
    type: 'string',
    fieldset: 'appearance',
    initialValue: 'bone',
    options: {list: SECTION_BACKGROUNDS, layout: 'radio', direction: 'horizontal'},
  }),
  defineField({
    name: 'curvedEdge',
    title: 'Bordo curvo',
    description: 'Un accento: al massimo una o due sezioni per pagina, sui passaggi importanti.',
    type: 'boolean',
    fieldset: 'appearance',
    initialValue: false,
  }),
  defineField({
    name: 'anchor',
    title: 'Ancora',
    description:
      'Facoltativa. Permette di linkare direttamente questa sezione (es. "moduli" → /pagina#moduli). Solo lettere minuscole, numeri e trattini.',
    type: 'string',
    fieldset: 'appearance',
    validation: (rule) =>
      rule.regex(ANCHOR_PATTERN, {name: 'lettere minuscole, numeri e trattini'}),
  }),
  defineField({
    name: 'hidden',
    title: 'Nascondi questa sezione',
    description: 'La sezione resta salvata ma non compare sul sito.',
    type: 'boolean',
    fieldset: 'appearance',
    initialValue: false,
  }),
]
