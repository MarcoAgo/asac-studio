import {CalendarIcon, DocumentsIcon, HeartIcon, ThLargeIcon, UsersIcon} from '@sanity/icons'
import {defineArrayMember, defineField} from 'sanity'
import {parentOf} from '../fields'
import {DOCUMENT_CATEGORIES, EVENT_CATEGORIES, NEWS_TAGS, PERSON_GROUPS} from '../lists'
import {actionsField, countField, defineSection, introField, titleField} from './defineSection'

// Dynamic sections: only parameters here, the data comes from the collections.

// Prototype: home `.events` (ECG trace + lineup).
export const upcomingEventsType = defineSection({
  name: 'upcomingEvents',
  title: 'Prossimi eventi',
  description: 'I prossimi eventi dal calendario. Se non ce ne sono, mostra le attività.',
  icon: CalendarIcon,
  fields: [
    titleField('Prossimi eventi'),
    countField('Quanti eventi', 3, 6),
    defineField({
      name: 'category',
      title: 'Solo questa categoria',
      description: 'Lascia vuoto per mostrare tutti gli eventi.',
      type: 'string',
      options: {list: EVENT_CATEGORIES},
    }),
    defineField({name: 'allEventsLink', title: 'Link al calendario', type: 'action'}),
  ],
})

// Prototype: eventi.html (filters, archive, ECG trace, table).
export const eventCalendarType = defineSection({
  name: 'eventCalendar',
  title: 'Calendario eventi',
  description: 'Tutti gli eventi, con i filtri per categoria e l’archivio.',
  icon: CalendarIcon,
  fields: [
    titleField(),
    defineField({
      name: 'showFilters',
      title: 'Mostra i filtri per categoria',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showArchive',
      title: "Mostra l'archivio degli eventi passati",
      type: 'boolean',
      initialValue: true,
    }),
  ],
})

type ActivityGridValue = {variant?: string}

// Prototype: home `.activities` (tabs) and the attivita.html chapters.
export const activityGridType = defineSection({
  name: 'activityGrid',
  title: 'Attività',
  description: 'Le attività permanenti, in schede (home) o una per capitolo (pagina Attività).',
  icon: HeartIcon,
  fields: [
    titleField('Le nostre attività'),
    defineField({
      name: 'variant',
      title: 'Aspetto',
      type: 'string',
      initialValue: 'tabs',
      options: {
        list: [
          {title: 'Schede (fino a 4)', value: 'tabs'},
          {title: 'Un capitolo per attività', value: 'chapters'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'activities',
      title: 'Quali attività',
      description: 'Lascia vuoto per mostrarle tutte, nel loro ordine.',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'activity'}]})],
      validation: (rule) =>
        rule
          .unique()
          .custom((activities, context) =>
            parentOf<ActivityGridValue>(context).variant === 'tabs' && (activities?.length ?? 0) > 4
              ? 'Nelle schede ci stanno al massimo 4 attività.'
              : true,
          ),
    }),
    actionsField(2),
  ],
})

// Prototype: home `.news-list`.
export const latestNewsType = defineSection({
  name: 'latestNews',
  title: 'Ultime notizie',
  icon: ThLargeIcon,
  fields: [
    titleField('Ultime notizie'),
    countField('Quante notizie', 3, 6),
    defineField({
      name: 'tag',
      title: 'Solo questo argomento',
      description: 'Lascia vuoto per mostrare tutte le notizie.',
      type: 'string',
      options: {list: NEWS_TAGS},
    }),
    defineField({name: 'allNewsLink', title: 'Link a tutte le notizie', type: 'action'}),
  ],
})

// Prototype: news.html (newsletter feature, topic chips, cards).
export const newsListType = defineSection({
  name: 'newsList',
  title: 'Elenco notizie',
  description: 'Tutte le notizie, dalla più recente, divise in pagine.',
  icon: ThLargeIcon,
  fields: [
    titleField('Tutte le notizie'),
    defineField({
      name: 'showNewsletter',
      title: 'Metti in evidenza il notiziario più recente',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showFilters',
      title: 'Mostra i filtri per argomento',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'pageSize',
      title: 'Notizie per pagina',
      type: 'number',
      initialValue: 12,
      validation: (rule) => rule.required().integer().min(6).max(48),
    }),
  ],
})

// Prototype: associazione `.people`.
export const peopleType = defineSection({
  name: 'people',
  title: 'Persone',
  description: 'Il consiglio direttivo o il comitato scientifico, dalle schede Persone.',
  icon: UsersIcon,
  fields: [
    titleField(),
    introField,
    defineField({
      name: 'group',
      title: 'Gruppo',
      type: 'string',
      options: {list: PERSON_GROUPS, layout: 'radio'},
      validation: (rule) => rule.required(),
    }),
  ],
})

type DocumentListValue = {mode?: string}

// Prototype: `.doclist` and the Trasparenza `.docgroup`s.
export const documentListType = defineSection({
  name: 'documentList',
  title: 'Elenco documenti',
  description: 'File da scaricare: tutti quelli di alcune categorie, oppure scelti uno per uno.',
  icon: DocumentsIcon,
  fields: [
    titleField(),
    introField,
    defineField({
      name: 'mode',
      title: 'Quali documenti',
      type: 'string',
      initialValue: 'automatic',
      options: {
        list: [
          {title: 'Tutti, raggruppati per categoria e anno', value: 'automatic'},
          {title: 'Scelti uno per uno', value: 'selected'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'categories',
      title: 'Categorie',
      description: 'Lascia vuoto per mostrarle tutte.',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {list: DOCUMENT_CATEGORIES},
      hidden: ({parent}) => parent?.mode !== 'automatic',
    }),
    defineField({
      name: 'items',
      title: 'Documenti e link',
      description: 'Un documento, un file o una pagina per riga.',
      type: 'array',
      of: [defineArrayMember({type: 'action'})],
      hidden: ({parent}) => parent?.mode !== 'selected',
      validation: (rule) =>
        rule.custom((items, context) =>
          parentOf<DocumentListValue>(context).mode === 'selected' && !items?.length
            ? 'Aggiungi almeno un documento.'
            : true,
        ),
    }),
  ],
})
