import {ArrowRightIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {API_VERSION} from '../../constants'

const PATH_PATTERN = /^\/[^\s?#]*$/

export const redirectType = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  icon: ArrowRightIcon,
  description: 'Manda chi apre un vecchio indirizzo alla pagina giusta.',
  fields: [
    defineField({
      name: 'from',
      title: 'Da',
      description: 'Il vecchio percorso, es. /it/chi-siamo.',
      type: 'string',
      validation: (rule) =>
        rule
          .required()
          .regex(PATH_PATTERN, {name: 'percorso che inizia con "/"'})
          .custom(async (from, context) => {
            if (!from || !context.document) return true
            const id = context.document._id.replace(/^drafts\./, '')
            const taken = await context
              .getClient({apiVersion: API_VERSION})
              .fetch<boolean>(
                `defined(*[_type == "redirect" && from == $from && !(_id in [$id, $draft])][0]._id)`,
                {from, id, draft: `drafts.${id}`},
              )
            return taken ? 'Esiste già un redirect da questo percorso.' : true
          }),
    }),
    defineField({
      name: 'to',
      title: 'A',
      description: 'Il nuovo percorso (es. /it/associazione) o un indirizzo completo https://…',
      type: 'string',
      validation: (rule) =>
        rule.required().custom((to, context) => {
          if (!to) return true
          if (!PATH_PATTERN.test(to) && !/^https:\/\/\S+$/.test(to)) {
            return 'Un percorso che inizia con "/" o un indirizzo https://'
          }
          return to === context.document?.from ? 'Deve essere diverso da "Da".' : true
        }),
    }),
    defineField({
      name: 'permanent',
      title: 'Permanente',
      description: 'Sì (301) se il vecchio indirizzo non tornerà più; no (302) se è temporaneo.',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {from: 'from', to: 'to', permanent: 'permanent'},
    prepare: ({from, to, permanent}) => ({
      title: `${from ?? '?'} → ${to ?? '?'}`,
      subtitle: permanent === false ? '302 temporaneo' : '301 permanente',
    }),
  },
})
