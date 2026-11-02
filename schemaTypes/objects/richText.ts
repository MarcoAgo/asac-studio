import {defineArrayMember, defineType} from 'sanity'

// Two deliberately narrow profiles (piano-infrastruttura §4): no colours and
// no H1, because heading levels are decided by the code.
const marks = {
  decorators: [
    {title: 'Grassetto', value: 'strong'},
    {title: 'Corsivo', value: 'em'},
  ],
  annotations: [defineArrayMember({name: 'link', title: 'Collegamento', type: 'link'})],
}

export const richTextType = defineType({
  name: 'richText',
  title: 'Testo',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{title: 'Paragrafo', value: 'normal'}],
      lists: [],
      marks,
    }),
  ],
})

export const articleTextType = defineType({
  name: 'articleText',
  title: "Testo dell'articolo",
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Paragrafo', value: 'normal'},
        {title: 'Titolo di capitolo', value: 'h2'},
        {title: 'Sottotitolo', value: 'h3'},
        {title: 'Citazione', value: 'blockquote'},
      ],
      lists: [
        {title: 'Elenco puntato', value: 'bullet'},
        {title: 'Elenco numerato', value: 'number'},
      ],
      marks,
    }),
    defineArrayMember({type: 'figure'}),
  ],
})
