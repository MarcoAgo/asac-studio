import {itITLocale} from '@sanity/locale-it-it'
import {visionTool} from '@sanity/vision'
import {defineConfig, type DocumentActionComponent, type Template} from 'sanity'
import {structureTool} from 'sanity/structure'
import {
  DATASETS,
  PROJECT_ID,
  SINGLETON_ACTIONS,
  SINGLETON_TYPES,
  SITE_CREATED_TYPES,
} from './constants'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

const filterActions = (
  actions: DocumentActionComponent[],
  schemaType: string,
): DocumentActionComponent[] => {
  if (SINGLETON_TYPES.has(schemaType)) {
    return actions.filter(({action}) => action && SINGLETON_ACTIONS.has(action))
  }
  if (SITE_CREATED_TYPES.has(schemaType)) {
    return actions.filter(({action}) => action !== 'duplicate')
  }
  return actions
}

const baseConfig = {
  projectId: PROJECT_ID,
  plugins: [structureTool({structure}), visionTool(), itITLocale()],
  schema: {
    types: schemaTypes,
    // Singletons and form submissions never appear in the "create new" menus.
    templates: (templates: Template[]) =>
      templates.filter(
        ({schemaType}) => !SINGLETON_TYPES.has(schemaType) && !SITE_CREATED_TYPES.has(schemaType),
      ),
  },
  document: {
    actions: (actions: DocumentActionComponent[], {schemaType}: {schemaType: string}) =>
      filterActions(actions, schemaType),
  },
}

export default defineConfig([
  {
    ...baseConfig,
    name: DATASETS.PRODUCTION,
    title: 'Amici del Cuore Scaligera',
    basePath: '/production',
    dataset: DATASETS.PRODUCTION,
  },
  {
    ...baseConfig,
    name: DATASETS.DEVELOPMENT,
    title: 'Amici del Cuore Scaligera · sviluppo',
    subtitle: 'Dataset di prova',
    basePath: '/development',
    dataset: DATASETS.DEVELOPMENT,
  },
])
