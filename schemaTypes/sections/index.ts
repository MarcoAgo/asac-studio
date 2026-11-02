import {defineArrayMember, defineField} from 'sanity'
import {
  activityGridType,
  documentListType,
  eventCalendarType,
  latestNewsType,
  newsListType,
  peopleType,
  upcomingEventsType,
} from './collections'
import {quickContactsType, requestFormType, staticMapType} from './contact'
import {
  callToActionType,
  factListType,
  faqType,
  highlightsType,
  imageWithTextType,
  journeyType,
  longTextType,
  splitListType,
} from './content'
import {heroType, pageHeaderType} from './headers'
import {bankTransferType, donationUsesType, fivePerThousandType} from './support'

// Grouped as in the "add section" menu.
const SECTION_GROUPS = [
  {name: 'headers', title: 'Intestazioni', types: [pageHeaderType, heroType]},
  {
    name: 'content',
    title: 'Testi',
    types: [
      imageWithTextType,
      highlightsType,
      journeyType,
      factListType,
      splitListType,
      faqType,
      longTextType,
      callToActionType,
    ],
  },
  {
    name: 'collections',
    title: 'Eventi, notizie e persone',
    types: [
      upcomingEventsType,
      eventCalendarType,
      activityGridType,
      latestNewsType,
      newsListType,
      peopleType,
      documentListType,
    ],
  },
  {
    name: 'support',
    title: 'Sostegno',
    types: [fivePerThousandType, bankTransferType, donationUsesType],
  },
  {
    name: 'contact',
    title: 'Contatti e moduli',
    types: [quickContactsType, staticMapType, requestFormType],
  },
]

export const sectionTypes = SECTION_GROUPS.flatMap((group) => group.types)

type SectionValue = {_type: string; hidden?: boolean; isPageHeading?: boolean}

// Sections that render the page H1 (piano-infrastruttura §4: one H1 per page).
const rendersHeading = (section: SectionValue) =>
  section._type === 'pageHeader' ||
  section._type === 'hero' ||
  (section._type === 'quickContacts' && section.isPageHeading === true)

export const sectionsField = defineField({
  name: 'sections',
  title: 'Sezioni',
  description: 'I blocchi della pagina, dall’alto in basso.',
  type: 'array',
  group: 'content',
  of: sectionTypes.map((type) => defineArrayMember({type: type.name})),
  options: {
    insertMenu: {
      filter: true,
      groups: SECTION_GROUPS.map(({name, title, types}) => ({
        name,
        title,
        of: types.map((type) => type.name),
      })),
      views: [{name: 'list'}],
    },
  },
  validation: (rule) =>
    rule.custom((sections: SectionValue[] | undefined) => {
      const visible = (sections ?? []).filter((section) => !section.hidden)
      if (!visible.length) return true
      if (!rendersHeading(visible[0])) {
        return 'La prima sezione deve essere un\'intestazione: "Intestazione pagina", "Apertura della home" o "Contatti rapidi" come titolo principale.'
      }
      if (visible.filter(rendersHeading).length > 1) {
        return 'Una pagina può avere un solo titolo principale: tieni una sola intestazione.'
      }
      return true
    }),
})
