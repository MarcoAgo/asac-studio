import {defineField, defineType} from 'sanity'

// Singleton, fixed `_id: "settings"` (see `structure/` and `constants.ts`).
export const settingsType = defineType({
  name: 'settings',
  title: 'Impostazioni',
  type: 'document',
  fields: [
    defineField({
      name: 'denominazione',
      title: 'Denominazione',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'codiceFiscale',
      title: 'Codice fiscale',
      type: 'string',
      validation: (rule) => rule.regex(/^\d{11}$/, {name: 'codice fiscale di un ente (11 cifre)'}),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Impostazioni'}),
  },
})
