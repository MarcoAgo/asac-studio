import {defineCliConfig} from 'sanity/cli'
import {DATASETS, PROJECT_ID} from './constants'

export default defineCliConfig({
  api: {
    projectId: PROJECT_ID,
    dataset: DATASETS.PRODUCTION,
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
  // The website lives in a sibling repo (`../asac-website`): typegen reads its
  // GROQ queries and writes the types straight into it.
  typegen: {
    path: '../asac-website/app/api/sanity/**/*.ts',
    schema: 'schema.json',
    generates: '../asac-website/app/_types/sanity.types.ts',
    overloadClientMethods: false,
  },
})
