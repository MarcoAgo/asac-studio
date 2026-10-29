import {defineField, defineType} from 'sanity'

// Form submissions. Created only by the website, always with
// `_id: "richieste.<uuid>"`: an ID with a dot is never served to
// unauthenticated requests, even from a public dataset. `liveEdit` because
// there is nothing to publish: the document is the record.
export const richiestaType = defineType({
  name: 'richiesta',
  title: 'Richiesta',
  type: 'document',
  liveEdit: true,
  fields: [
    defineField({
      name: 'tipo',
      title: 'Tipo',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          {title: 'Contatti', value: 'contatti'},
          {title: 'Diventa socio', value: 'socio'},
          {title: 'Donazione', value: 'donazione'},
        ],
      },
    }),
    defineField({
      name: 'stato',
      title: 'Stato',
      type: 'string',
      initialValue: 'nuova',
      options: {
        layout: 'radio',
        direction: 'horizontal',
        list: [
          {title: 'Nuova', value: 'nuova'},
          {title: 'Presa in carico', value: 'presaInCarico'},
          {title: 'Archiviata', value: 'archiviata'},
        ],
      },
    }),
    defineField({name: 'nome', title: 'Nome e cognome', type: 'string', readOnly: true}),
    defineField({name: 'email', title: 'Email', type: 'string', readOnly: true}),
    defineField({name: 'messaggio', title: 'Messaggio', type: 'text', readOnly: true}),
    defineField({
      name: 'cartellaAllegati',
      title: 'Allegati',
      description: 'Cartella privata con i moduli caricati. I file non sono mai salvati su Sanity.',
      type: 'url',
      readOnly: true,
    }),
    defineField({name: 'notaInterna', title: 'Nota interna', type: 'text', rows: 3}),
  ],
  orderings: [
    {
      title: 'Più recenti',
      name: 'createdAtDesc',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'nome', tipo: 'tipo', stato: 'stato'},
    prepare: ({title, tipo, stato}) => ({
      title: title ?? 'Senza nome',
      subtitle: [tipo, stato].filter(Boolean).join(' · '),
    }),
  },
})
