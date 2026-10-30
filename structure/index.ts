import {CogIcon, MenuIcon, TranslateIcon} from '@sanity/icons'
import type {ComponentType} from 'react'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import {singletonId} from '../constants'
import {REQUEST_STATUSES} from '../schemaTypes/documents/request'
import {DOCUMENT_CATEGORIES, PERSON_GROUPS} from '../schemaTypes/lists'

// Fixed-ID documents open straight into the editor (see `constants.ts`).
const singleton = (S: StructureBuilder, type: string, title: string, icon: ComponentType) =>
  S.listItem()
    .title(title)
    .id(singletonId(type))
    .icon(icon)
    .schemaType(type)
    .child(S.document().schemaType(type).documentId(singletonId(type)).title(title))

// A type list split by the values of one of its fields, newest first.
const splitBy = (
  S: StructureBuilder,
  type: string,
  title: string,
  field: string,
  options: {title: string; value: string}[],
) =>
  S.listItem()
    .title(title)
    .id(type)
    .schemaType(type)
    .child(
      S.list()
        .title(title)
        .items([
          ...options.map(({title: optionTitle, value}) =>
            S.listItem()
              .title(optionTitle)
              .id(value)
              .schemaType(type)
              .child(
                S.documentTypeList(type)
                  .title(optionTitle)
                  .filter(`_type == $type && ${field} == $value`)
                  .params({type, value})
                  .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
              ),
          ),
          S.divider(),
          S.listItem()
            .title('Tutti')
            .id('all')
            .schemaType(type)
            .child(
              S.documentTypeList(type)
                .title(title)
                .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
            ),
        ]),
    )

// Menu from piano-infrastruttura §4: contents — requests — site-wide settings.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenuti')
    .items([
      S.documentTypeListItem('page').title('Pagine'),
      S.listItem()
        .title('Eventi')
        .id('event')
        .schemaType('event')
        .child(
          S.documentTypeList('event')
            .title('Eventi')
            .defaultOrdering([{field: 'start', direction: 'desc'}]),
        ),
      S.listItem()
        .title('News')
        .id('news')
        .schemaType('news')
        .child(
          S.documentTypeList('news')
            .title('News')
            .defaultOrdering([{field: 'date', direction: 'desc'}]),
        ),
      S.listItem()
        .title('Attività')
        .id('activity')
        .schemaType('activity')
        .child(
          S.documentTypeList('activity')
            .title('Attività')
            .defaultOrdering([{field: 'order', direction: 'asc'}]),
        ),
      splitBy(S, 'person', 'Persone', 'group', PERSON_GROUPS),
      splitBy(S, 'publicDocument', 'Documenti', 'category', DOCUMENT_CATEGORIES),
      S.divider(),
      splitBy(S, 'request', 'Richieste', 'status', REQUEST_STATUSES),
      S.divider(),
      singleton(S, 'navigation', 'Navigazione', MenuIcon),
      singleton(S, 'uiStrings', "Testi dell'interfaccia", TranslateIcon),
      singleton(S, 'settings', 'Impostazioni', CogIcon),
      S.documentTypeListItem('redirect').title('Redirect'),
      S.documentTypeListItem('language').title('Lingue'),
    ])
