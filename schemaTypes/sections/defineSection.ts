import type {ComponentType} from 'react'
import {defineArrayMember, defineField, defineType, type FieldDefinition} from 'sanity'
import {appearanceFieldset, sectionFields} from '../fields'

type SectionConfig = {
  name: string
  title: string
  description?: string
  icon: ComponentType
  fields: FieldDefinition[]
  // Field shown as the item title in the sections list.
  previewField?: string
}

// A page builder section: one React component per `_type` on the website
// (piano-infrastruttura §4). Appearance options are appended to every section.
export const defineSection = ({
  name,
  title,
  description,
  icon,
  fields,
  previewField = 'title',
}: SectionConfig) =>
  defineType({
    name,
    title,
    description,
    type: 'object',
    icon,
    fieldsets: [appearanceFieldset],
    fields: [...fields, ...sectionFields],
    preview: {
      select: {heading: previewField, hidden: 'hidden'},
      prepare: ({heading, hidden}) => ({
        title: typeof heading === 'string' && heading ? heading : title,
        subtitle: [title, hidden && 'nascosta'].filter(Boolean).join(' · '),
      }),
    },
  })

// Fields that recur across sections. Heading levels are decided by the code:
// the editor only writes the text.
export const titleField = (initialValue?: string) =>
  defineField({name: 'title', title: 'Titolo', type: 'string', initialValue})

export const requiredTitleField = defineField({
  name: 'title',
  title: 'Titolo',
  type: 'string',
  validation: (rule) => rule.required(),
})

export const introField = defineField({
  name: 'intro',
  title: 'Testo introduttivo',
  description: 'Una o due righe sotto il titolo.',
  type: 'text',
  rows: 2,
})

export const actionsField = (max: number, min = 0) =>
  defineField({
    name: 'actions',
    title: max === 1 ? 'Pulsante o link' : 'Pulsanti e link',
    type: 'array',
    of: [defineArrayMember({type: 'action'})],
    validation: (rule) => (min ? rule.min(min).max(max) : rule.max(max)),
  })

export const countField = (title: string, initialValue: number, max: number) =>
  defineField({
    name: 'count',
    title,
    type: 'number',
    initialValue,
    validation: (rule) => rule.required().integer().min(1).max(max),
  })
