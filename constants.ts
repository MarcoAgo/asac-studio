export const PROJECT_ID = '6yl64atc'

// One Studio, two workspaces: the switcher in the top bar picks the dataset.
export const DATASETS = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
} as const

// Documents with a fixed ID: one per dataset, never created or deleted by hand.
export const SINGLETON_TYPES = new Set(['settings'])

// Created only by the website (form submissions), never from the Studio.
export const SITE_CREATED_TYPES = new Set(['richiesta'])

export const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])
