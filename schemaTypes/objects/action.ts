import {LaunchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {titleOf} from '../lists'

export const ACTION_STYLES = [
  {title: 'Pulsante', value: 'button'},
  {title: 'Link sottolineato', value: 'link'},
]

export const actionType = defineType({
  name: 'action',
  title: 'Pulsante o link',
  type: 'object',
  icon: LaunchIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Testo',
      description: 'Dice cosa succede cliccando (es. "Diventa socio", non "Clicca qui").',
      type: 'string',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'link',
      title: 'Collegamento',
      type: 'link',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'style',
      title: 'Aspetto',
      type: 'string',
      initialValue: 'button',
      options: {list: ACTION_STYLES, layout: 'radio', direction: 'horizontal'},
    }),
  ],
  preview: {
    select: {title: 'label', style: 'style'},
    prepare: ({title, style}) => ({
      title,
      subtitle: titleOf(ACTION_STYLES, style),
    }),
  },
})
