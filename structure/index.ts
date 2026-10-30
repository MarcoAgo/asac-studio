import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenuti')
    .items([
      S.documentTypeListItem('page').title('Pagine'),
      S.divider(),
      S.listItem()
        .title('Richieste')
        .schemaType('request')
        .child(
          S.documentTypeList('request')
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
