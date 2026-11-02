import {EarthGlobeIcon} from '@sanity/icons'
import {defineField, defineType, type ValidationContext} from 'sanity'
import {API_VERSION} from '../../constants'

// Is another language document already using this value?
const taken = async (field: 'code' | 'isDefault', value: unknown, context: ValidationContext) => {
  if (!context.document) return false
  const id = context.document._id.replace(/^drafts\./, '')
  return context
    .getClient({apiVersion: API_VERSION})
    .fetch<boolean>(
      `defined(*[_type == "language" && ${field} == $value && !(_id in [$id, $draft])][0]._id)`,
      {value, id, draft: `drafts.${id}`},
    )
}

// Data only in v1: the supported languages are a constant (`constants.ts`).
export const languageType = defineType({
  name: 'language',
  title: 'Lingua',
  type: 'document',
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: 'code',
      title: 'Codice',
      description: 'Due lettere minuscole, es. "it".',
      type: 'string',
      validation: (rule) =>
        rule
          .required()
          .regex(/^[a-z]{2}$/, {name: 'due lettere minuscole'})
          .custom(async (code, context) =>
            code && (await taken('code', code, context)) ? 'Lingua già presente.' : true,
          ),
    }),
    defineField({
      name: 'name',
      title: 'Nome',
      description: 'Es. "Italiano".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'active', title: 'Attiva sul sito', type: 'boolean', initialValue: false}),
    defineField({
      name: 'isDefault',
      title: 'Lingua predefinita',
      type: 'boolean',
      initialValue: false,
      validation: (rule) =>
        rule.custom(async (isDefault, context) =>
          isDefault && (await taken('isDefault', true, context))
            ? "C'è già un'altra lingua predefinita."
            : true,
        ),
    }),
  ],
  preview: {
    select: {title: 'name', code: 'code', active: 'active', isDefault: 'isDefault'},
    prepare: ({title, code, active, isDefault}) => ({
      title,
      subtitle: [code, active ? 'attiva' : 'non attiva', isDefault && 'predefinita']
        .filter(Boolean)
        .join(' · '),
    }),
  },
})
