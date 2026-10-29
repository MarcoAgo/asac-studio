import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenuti')
    .items([
      S.documentTypeListItem('pagina').title('Pagine'),
      S.divider(),
      S.listItem()
        .title('Richieste')
        .schemaType('richiesta')
        .child(
          S.documentTypeList('richiesta')
            .title('Richieste')
            .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
        ),
      S.divider(),
      S.listItem()
        .title('Impostazioni')
        .id('settings')
        .schemaType('settings')
        .child(S.document().schemaType('settings').documentId('settings').title('Impostazioni')),
    ])
