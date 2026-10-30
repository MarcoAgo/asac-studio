export const PROJECT_ID = '6yl64atc'

// One Studio, two workspaces: the switcher in the top bar picks the dataset.
export const DATASETS = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
} as const

// For the client calls made by custom validations.
export const API_VERSION = '2025-02-19'

// v1 publishes Italian only; routable documents carry a `language` field so a
// translation plugin can be added later without migrating content.
export const LANGUAGES = [{id: 'it', title: 'Italiano'}] as const
export const DEFAULT_LANGUAGE = 'it'

// Documents with a fixed ID, never created or deleted by hand: `settings` is
// one per dataset, the per-language ones are `<type>-<lang>` (root IDs, so
// they are served without a token; see `singletonId`).
export const SINGLETON_TYPES = new Set(['settings', 'navigation', 'uiStrings'])
export const PER_LANGUAGE_SINGLETON_TYPES = new Set(['navigation', 'uiStrings'])

export const singletonId = (type: string, language: string = DEFAULT_LANGUAGE) =>
  PER_LANGUAGE_SINGLETON_TYPES.has(type) ? `${type}-${language}` : type

// Created only by the website (form submissions), never from the Studio.
export const SITE_CREATED_TYPES = new Set(['request'])

export const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])
