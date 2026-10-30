import {activityType} from './documents/activity'
import {eventType} from './documents/event'
import {newsType} from './documents/news'
import {pageType} from './documents/page'
import {personType} from './documents/person'
import {publicDocumentType} from './documents/publicDocument'
import {richiestaType} from './documents/richiesta'
import {settingsType} from './documents/settings'
import {actionType} from './objects/action'
import {addressType, bankAccountType, openingHoursType, socialLinkType} from './objects/contact'
import {figureType} from './objects/figure'
import {linkType} from './objects/link'
import {articleTextType, richTextType} from './objects/richText'
import {
  factRowType,
  faqItemType,
  highlightType,
  menuItemType,
  splitRowType,
  stepType,
} from './objects/rows'
import {seoType} from './objects/seo'

const documents = [
  settingsType,
  pageType,
  eventType,
  newsType,
  activityType,
  personType,
  publicDocumentType,
  richiestaType,
]

const objects = [
  figureType,
  seoType,
  linkType,
  actionType,
  richTextType,
  articleTextType,
  factRowType,
  splitRowType,
  stepType,
  faqItemType,
  highlightType,
  menuItemType,
  addressType,
  openingHoursType,
  bankAccountType,
  socialLinkType,
]

export const schemaTypes = [...documents, ...objects]
