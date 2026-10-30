import {activityType} from './documents/activity'
import {eventType} from './documents/event'
import {languageType} from './documents/language'
import {navigationType} from './documents/navigation'
import {newsType} from './documents/news'
import {pageType} from './documents/page'
import {personType} from './documents/person'
import {publicDocumentType} from './documents/publicDocument'
import {redirectType} from './documents/redirect'
import {requestType} from './documents/request'
import {settingsType} from './documents/settings'
import {uiStringsType, uiStringType} from './documents/uiStrings'
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
  requestType,
  navigationType,
  uiStringsType,
  redirectType,
  languageType,
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
  uiStringType,
]

export const schemaTypes = [...documents, ...objects]
