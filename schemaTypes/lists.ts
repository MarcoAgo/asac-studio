// Option lists shared by several types. Values are code identifiers (English),
// titles are what the editors see.

// Still to be confirmed by the association (piano-infrastruttura §17.8): change
// them here only.
export const EVENT_CATEGORIES = [
  {title: 'Camminata', value: 'walk'},
  {title: 'Evento sportivo', value: 'sport'},
  {title: 'In piazza', value: 'square'},
  {title: 'Incontro', value: 'meeting'},
]

export const NEWS_TAGS = [
  {title: 'Eventi', value: 'events'},
  {title: 'Prevenzione', value: 'prevention'},
  {title: 'Associazione', value: 'association'},
  {title: 'Notiziario', value: 'newsletter'},
]

export const PERSON_GROUPS = [
  {title: 'Consiglio direttivo', value: 'board'},
  {title: 'Comitato scientifico', value: 'scientificCommittee'},
]

export const DOCUMENT_CATEGORIES = [
  {title: 'Statuto e atti', value: 'statute'},
  {title: 'Bilancio', value: 'financialStatement'},
  {title: 'Rendiconto 5×1000', value: 'fivePerThousandReport'},
  {title: 'Contributi pubblici', value: 'publicFunding'},
  {title: 'Modulistica', value: 'forms'},
]

// Categories whose documents have no reference year.
export const UNDATED_DOCUMENT_CATEGORIES = new Set(['statute', 'forms'])

export const SECTION_BACKGROUNDS = [
  {title: 'Osso (chiaro)', value: 'bone'},
  {title: 'Pietra (grigio)', value: 'stone'},
  {title: 'Vena (blu)', value: 'vein'},
  {title: 'Arteria (rosso)', value: 'artery'},
]

export const FORM_TYPES = [
  {title: 'Contatti', value: 'contact'},
  {title: 'Diventa socio', value: 'membership'},
]

export const titleOf = (list: {title: string; value: string}[], value?: string) =>
  list.find((item) => item.value === value)?.title
