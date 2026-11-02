/**
 * Kitchen sink for QA and axe tests (piano-infrastruttura §4): sample
 * documents and a page that uses every section, in the `development` dataset
 * only. Uploads no assets, so no images or PDFs: sample content only.
 *
 *   npx sanity exec seed/kitchen-sink.ts --with-user-token -- \
 *     --dataset development [--strings ../asac-website/app/i18n/it/_common.json]
 *
 * Re-running replaces the same documents (fixed IDs).
 */
import {randomUUID} from 'node:crypto'
import {existsSync, readFileSync} from 'node:fs'
import {getCliClient} from 'sanity/cli'
import {API_VERSION, DATASETS, DEFAULT_LANGUAGE, singletonId} from '../constants'

const arg = (name: string) => {
  const index = process.argv.indexOf(`--${name}`)
  return index === -1 ? undefined : process.argv[index + 1]
}

const dataset = arg('dataset')
if (dataset !== DATASETS.DEVELOPMENT) {
  throw new Error(`Refusing to seed "${dataset ?? '(none)'}": pass --dataset development.`)
}
const stringsPath = arg('strings') ?? '../asac-website/app/i18n/it/_common.json'

const client = getCliClient({apiVersion: API_VERSION}).withConfig({dataset})

// --- helpers ---------------------------------------------------------------

const key = () => randomUUID().slice(0, 12)
const keyed = <T extends object>(items: T[]) => items.map((item) => ({_key: key(), ...item}))
const ref = (id: string) => ({_type: 'reference', _ref: id})

const paragraphs = (...texts: string[]) =>
  texts.map((text) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: key(), text, marks: []}],
  }))

const heading = (style: 'h2' | 'h3', text: string) => ({...paragraphs(text)[0], style})

const toPage = (id: string, label: string, style = 'button', anchor?: string) => ({
  _type: 'action',
  label,
  style,
  link: {_type: 'link', type: 'internal', internal: ref(id), ...(anchor && {anchor})},
})

const external = (url: string, label: string, style = 'button') => ({
  _type: 'action',
  label,
  style,
  link: {_type: 'link', type: 'external', external: url},
})

const fact = (label: string, value: string) => ({_type: 'factRow', label, value})

const daysFromNow = (days: number, hour = 9) => {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() + days)
  date.setUTCHours(hour - 1, 0, 0, 0)
  return date.toISOString()
}

const language = {language: DEFAULT_LANGUAGE}

// i18next JSON → flat entries ("nav.join"), as read by the website.
const flatten = (value: unknown, prefix = ''): {key: string; text: string}[] =>
  value && typeof value === 'object'
    ? Object.entries(value).flatMap(([name, child]) =>
        flatten(child, prefix ? `${prefix}.${name}` : name),
      )
    : [{key: prefix, text: String(value)}]

// --- documents -------------------------------------------------------------

const PAGES = {
  home: 'page-home',
  kitchenSink: 'page-kitchen-sink',
  contacts: 'page-contacts',
  membership: 'page-membership',
  privacy: 'page-privacy',
}

const activities = [
  ['walk', 'Camminate', 'In gruppo, al passo di tutti.', 'Tutti', 'Ritrovo alla partenza'],
  ['square', 'In piazza', 'Giornate di prevenzione nelle piazze.', 'Tutti', 'Passa al gazebo'],
  ['meeting', 'Incontri', 'Serate con cardiologi e specialisti.', 'Tutti', 'Ingresso libero'],
  ['sport', 'Eventi sportivi', 'Corse e gare non competitive.', 'Tutti', 'Iscrizione sul posto'],
].map(([category, title, text, audience, howToTakePart], index) => ({
  _id: `seed-activity-${category}`,
  _type: 'activity',
  title,
  slug: {_type: 'slug', current: category},
  description: paragraphs(text),
  audience,
  howToTakePart,
  category,
  order: index + 1,
}))

const events = [
  [-30, 'walk', 'Camminata d’autunno (passata)', 'Parco delle Colombare'],
  [10, 'walk', 'Camminata della salute', 'Lungadige San Giorgio'],
  [24, 'sport', 'Corsa per il cuore', 'Parco delle Mura'],
  [40, 'meeting', 'Il cuore in inverno', 'Sede'],
  [60, 'square', 'Il cuore in piazza', 'Piazza delle Erbe'],
].map(([days, category, title, location], index) => ({
  _id: `seed-event-${index + 1}`,
  _type: 'event',
  ...language,
  title,
  slug: {_type: 'slug', current: `evento-di-esempio-${index + 1}`},
  category,
  start: daysFromNow(days as number),
  end: daysFromNow(days as number, 11),
  location,
  description: paragraphs('Evento di esempio per il kitchen sink.'),
  free: true,
  howToTakePart: paragraphs('Non serve iscriversi: ti aspettiamo alla partenza.'),
  featured: index === 1,
}))

const news = [
  ['events', 'La giornata del cuore in piazza, com’è andata'],
  ['prevention', 'Screening per i più piccoli: le nuove date'],
  ['newsletter', 'Il notiziario d’autunno'],
].map(([tag, title], index) => ({
  _id: `seed-news-${index + 1}`,
  _type: 'news',
  ...language,
  title,
  slug: {_type: 'slug', current: `notizia-di-esempio-${index + 1}`},
  date: daysFromNow(-7 * (index + 1)).slice(0, 10),
  tags: [tag],
  excerpt: 'Notizia di esempio per il kitchen sink.',
  body: [
    ...paragraphs('Primo paragrafo di esempio.'),
    heading('h2', 'Un capitolo'),
    ...paragraphs('Secondo paragrafo di esempio.'),
  ],
}))

const people = [
  ['board', 'Nome Cognome', 'Presidente'],
  ['board', 'Nome Cognome', 'Tesoriere'],
  ['scientificCommittee', 'Nome Cognome', 'Cardiologo'],
].map(([group, name, role], index) => ({
  _id: `seed-person-${index + 1}`,
  _type: 'person',
  name,
  role,
  group,
  order: index + 1,
}))

const writeToUs = toPage(PAGES.contacts, 'Scrivici', 'link', 'scrivici')
const join = toPage(PAGES.membership, 'Diventa socio')

// Every section except `hero`, which renders an H1 too: it lives on the home.
const kitchenSinkSections = [
  {
    _type: 'pageHeader',
    title: 'Kitchen sink',
    subtitle: 'Tutte le sezioni del page builder, per i controlli di qualità e accessibilità.',
    backLink: toPage(PAGES.home, 'Home', 'link'),
    actions: keyed([join]),
    variant: 'default',
  },
  {
    _type: 'imageWithText',
    title: 'Testo e immagine',
    statement: 'Una frase in evidenza.',
    text: paragraphs('Un paragrafo di testo.'),
    facts: keyed([fact('Per chi', 'Tutti'), fact('Come partecipare', 'Senza iscrizione')]),
    showFigures: true,
    actions: keyed([writeToUs]),
    background: 'stone',
  },
  {
    _type: 'highlights',
    title: 'Perché associarsi',
    items: keyed(
      ['Sostieni la prevenzione', 'Hai voce', 'Non sei solo'].map((title) => ({
        _type: 'highlight',
        title,
        text: 'Testo di esempio.',
      })),
    ),
    background: 'vein',
    curvedEdge: true,
  },
  {
    _type: 'journey',
    title: 'Come si fa',
    intro: 'Quattro passaggi.',
    steps: keyed(
      ['Compila la richiesta', 'Ti richiamiamo', 'Versi la quota', 'Partecipa'].map((title) => ({
        _type: 'step',
        title,
        text: 'Testo di esempio.',
        note: 'Da subito',
      })),
    ),
    membershipFormInFirstStep: true,
  },
  {
    _type: 'factList',
    title: 'Chi siamo, per la legge',
    useLegalData: true,
    background: 'stone',
  },
  {
    _type: 'splitList',
    title: 'La quota',
    rows: keyed([
      {_type: 'splitRow', item: 'Socio ordinario', detail: 'Per tutti', value: '€ 00'},
      {_type: 'splitRow', item: 'Socio sostenitore', value: 'da € 00'},
    ]),
    background: 'artery',
  },
  {
    _type: 'faq',
    title: 'Domande frequenti',
    items: keyed([
      {_type: 'faqItem', question: 'Chi può diventare socio?', answer: paragraphs('Chiunque.')},
      {_type: 'faqItem', question: 'Quanto costa?', answer: paragraphs('Lo decide l’assemblea.')},
    ]),
  },
  {
    _type: 'longText',
    body: [
      heading('h2', 'Chi tratta i dati'),
      ...paragraphs('Testo di esempio.'),
      heading('h2', 'Quali dati'),
      ...paragraphs('Testo di esempio.'),
    ],
    showToc: true,
  },
  {_type: 'upcomingEvents', title: 'Prossimi eventi', count: 3},
  {_type: 'eventCalendar', title: 'Calendario', showFilters: true, showArchive: true},
  {_type: 'activityGrid', title: 'Le nostre attività', variant: 'tabs', background: 'artery'},
  {_type: 'activityGrid', title: 'Cosa facciamo', variant: 'chapters'},
  {_type: 'latestNews', title: 'Ultime notizie', count: 3},
  {
    _type: 'newsList',
    title: 'Tutte le notizie',
    showNewsletter: true,
    showFilters: true,
    pageSize: 12,
  },
  {_type: 'people', title: 'Il consiglio direttivo', group: 'board', background: 'stone'},
  {_type: 'documentList', title: 'Documenti', mode: 'automatic'},
  {
    _type: 'documentList',
    title: 'Moduli',
    mode: 'selected',
    items: keyed([external('https://example.org/modulo.pdf', 'Modulo di esempio', 'link')]),
  },
  {_type: 'fivePerThousand', title: 'Il 5×1000', variant: 'section', background: 'artery'},
  {_type: 'fivePerThousand', title: 'Fai circolare il bene', variant: 'banner'},
  {_type: 'bankTransfer', title: 'Con un bonifico', account: 1, background: 'vein'},
  {
    _type: 'donationUses',
    title: 'Cosa finanzia la tua donazione',
    items: keyed([
      {
        _type: 'donationUse',
        item: 'Una giornata in piazza',
        detail: 'Gazebo e materiale',
        amount: 300,
      },
      {_type: 'donationUse', item: 'Un defibrillatore', amount: 1200, fromAmount: true},
    ]),
    background: 'stone',
  },
  {
    _type: 'quickContacts',
    title: 'Contatti',
    showEmail: true,
    writeToUsLink: writeToUs,
    background: 'vein',
  },
  {_type: 'staticMap', title: 'Come arrivare', directions: keyed([fact('A piedi', '10 minuti')])},
  {
    _type: 'requestForm',
    formType: 'contact',
    title: 'Scrivici',
    note: 'Per un’emergenza chiama il 112: questo modulo non è un servizio sanitario.',
    successMessage: 'Grazie, ti rispondiamo entro qualche giorno.',
    anchor: 'scrivici',
  },
  {
    _type: 'requestForm',
    formType: 'membership',
    title: 'Fai richiesta',
    successMessage: 'Grazie, ti richiamiamo entro pochi giorni.',
  },
  {
    _type: 'callToAction',
    title: 'Un cuore solo non basta.',
    text: 'Associarti sostiene le attività dell’anno.',
    actions: keyed([join]),
    background: 'artery',
    curvedEdge: true,
  },
]

const page = (id: string, title: string, slug: string, sections: object[]) => ({
  _id: id,
  _type: 'page',
  ...language,
  title,
  slug: {_type: 'slug', current: slug},
  sections: keyed(sections),
})

const header = (title: string) => ({_type: 'pageHeader', title, variant: 'compact'})

const pages = [
  page(PAGES.home, 'Home', 'home', [
    {
      _type: 'hero',
      title: 'Il bene\ncircola.',
      subtitle: 'Contenuto di esempio.',
      actions: keyed([join]),
    },
    {_type: 'upcomingEvents', title: 'Prossimi eventi', count: 3},
    {_type: 'quickContacts', title: 'Contatti', background: 'vein', curvedEdge: true},
  ]),
  page(PAGES.kitchenSink, 'Kitchen sink', 'kitchen-sink', kitchenSinkSections),
  page(PAGES.contacts, 'Contatti', 'contatti', [
    {_type: 'quickContacts', title: 'Contatti', isPageHeading: true, showEmail: true},
  ]),
  page(PAGES.membership, 'Diventa socio', 'diventa-socio', [header('Diventa socio')]),
  page(PAGES.privacy, 'Privacy e cookie', 'privacy', [header('Privacy e cookie')]),
]

const settings = {
  _id: singletonId('settings'),
  _type: 'settings',
  legalName: 'Associazione Amici del Cuore Scaligera ODV (esempio)',
  taxCode: '00000000000',
  runtsNumber: '000000',
  runtsSection: 'Organizzazioni di volontariato',
  registeredOffice: {
    _type: 'address',
    street: 'Via Esempio 1',
    postalCode: '37100',
    city: 'Verona',
    province: 'VR',
  },
  office: {
    _type: 'address',
    street: 'Via Esempio 1',
    postalCode: '37100',
    city: 'Verona',
    province: 'VR',
  },
  phone: '045 000 0000',
  email: 'info@example.org',
  pec: 'pec@example.org',
  openingHours: keyed([{_type: 'openingHours', days: 'Martedì e giovedì', hours: '9:30–12:00'}]),
  openingHoursNote: 'Ad agosto chiuso.',
  mapUrl: 'https://www.openstreetmap.org/#map=15/45.4384/10.9916',
  bankAccounts: keyed([
    {
      _type: 'bankAccount',
      iban: 'IT60X0542811101000000123456',
      holder: 'Associazione Amici del Cuore Scaligera ODV',
      paymentReference: 'Donazione liberale, nome e codice fiscale',
    },
  ]),
  fivePerThousandText:
    'Non ti costa nulla: firma nel riquadro degli enti del Terzo settore e scrivi il nostro codice fiscale.',
  foundedYear: 1990,
  volunteerCount: 0,
  screeningCount: 0,
  homePage: ref(PAGES.home),
  seoTitleTemplate: '%s · Amici del Cuore Scaligera',
}

const navigation = {
  _id: singletonId('navigation'),
  _type: 'navigation',
  ...language,
  menu: keyed(
    [
      [PAGES.kitchenSink, 'Kitchen sink'],
      [PAGES.contacts, 'Contatti'],
    ].map(([id, label]) => ({
      _type: 'menuItem',
      label,
      link: {_type: 'link', type: 'internal', internal: ref(id)},
    })),
  ),
  primaryAction: join,
  footerText: 'Associazione di volontari per la prevenzione cardiovascolare a Verona.',
  footerLinks: keyed([
    {_type: 'menuItem', label: 'Privacy', link: toPage(PAGES.privacy, '').link},
    {_type: 'menuItem', label: 'Contatti', link: toPage(PAGES.contacts, '').link},
  ]),
  footerAction: join,
  credits:
    'Modello 3D: “Human heart, realistic anatomical model” di Abdur Razzak Sawon, CC BY 4.0.',
}

const strings = existsSync(stringsPath)
  ? flatten(JSON.parse(readFileSync(stringsPath, 'utf8')))
  : (console.warn(`No strings at ${stringsPath}: uiStrings left empty.`), [])

const uiStrings = {
  _id: singletonId('uiStrings'),
  _type: 'uiStrings',
  ...language,
  common: keyed(strings.map((entry) => ({_type: 'uiString', ...entry}))),
}

const others = [
  {
    _id: 'language-it',
    _type: 'language',
    code: 'it',
    name: 'Italiano',
    active: true,
    isDefault: true,
  },
  {
    _id: 'seed-redirect-1',
    _type: 'redirect',
    from: '/it/chi-siamo',
    to: '/it/kitchen-sink',
    permanent: true,
  },
]

const documents: {_id: string; _type: string; [field: string]: unknown}[] = [
  ...activities,
  ...events,
  ...news,
  ...people,
  ...pages,
  settings,
  navigation,
  uiStrings,
  ...others,
]

const transaction = documents.reduce((tx, doc) => tx.createOrReplace(doc), client.transaction())
const result = await transaction.commit()
console.log(`Seeded ${result.results.length} documents into "${dataset}".`)
