import type {SlugIsUniqueValidator, SlugValidationContext} from 'sanity'
import {API_VERSION, DEFAULT_LANGUAGE} from '../constants'

// "Chi siamo / Trasparenza" → "chi-siamo/trasparenza": accents dropped,
// slashes kept so a page slug can be a full path.
export const slugifyPath = (input: string) =>
  input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9/]+/g, '-')
    .replace(/-*\/-*/g, '/')
    .replace(/\/+/g, '/')
    .replace(/^[-/]+|[-/]+$/g, '')
    .slice(0, 96)

export const slugify = (input: string) => slugifyPath(input).replace(/\//g, '-')

// Unique among documents of the same type and language.
export const isUniqueInLanguage: SlugIsUniqueValidator = async (slug, context) => {
  const {document, getClient} = context as SlugValidationContext
  if (!document) return true
  const id = document._id.replace(/^drafts\./, '')
  const language = (document.language as string | undefined) ?? DEFAULT_LANGUAGE
  return !(await getClient({apiVersion: API_VERSION}).fetch<boolean>(
    `defined(*[_type == $type && slug.current == $slug && coalesce(language, $default) == $language && !(_id in [$id, $draft])][0]._id)`,
    {type: document._type, slug, language, default: DEFAULT_LANGUAGE, id, draft: `drafts.${id}`},
  ))
}
