import {TranslateIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType, type ArrayRule} from 'sanity'
import {languageField} from '../fields'

type UiString = {key?: string}

// One entry per i18next key, flattened with dots (e.g. "nav.join"). Keys are
// imported from the website's JSON files, so editors change only the text and
// new keys need no schema change.
export const uiStringType = defineType({
  name: 'uiString',
  title: 'Testo',
  type: 'object',
  fields: [
    defineField({name: 'key', title: 'Chiave', type: 'string', readOnly: true}),
    defineField({
      name: 'text',
      title: 'Testo',
      description: 'Lascia invariate le parti tra doppie graffe, es. {{year}}.',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {select: {title: 'text', subtitle: 'key'}},
})

const uniqueKeys = (rule: ArrayRule<UiString[]>) =>
  rule.custom((entries) => {
    const keys = (entries ?? []).map((entry) => entry.key)
    return new Set(keys).size === keys.length ? true : 'Ci sono chiavi ripetute.'
  })

// Entries are added by the import from the website, never by hand.
const namespaceField = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    description,
    type: 'array',
    of: [defineArrayMember({type: 'uiString'})],
    options: {disableActions: ['add', 'addBefore', 'addAfter', 'duplicate', 'remove', 'copy']},
    validation: uniqueKeys,
  })

// One per language, fixed `_id: "uiStrings-<lang>"`. One field per i18next
// namespace of the website (`app/i18n/<lang>/_<namespace>.json`).
export const uiStringsType = defineType({
  name: 'uiStrings',
  title: "Testi dell'interfaccia",
  type: 'document',
  icon: TranslateIcon,
  fields: [
    namespaceField(
      'common',
      'Testi comuni',
      'Intestazione, menu, piè di pagina e messaggi di errore.',
    ),
    languageField,
  ],
  preview: {
    select: {language: 'language'},
    prepare: ({language}) => ({title: "Testi dell'interfaccia", subtitle: language}),
  },
})
