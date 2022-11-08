export type Locale =
  | 'ar'
  | 'en'
  | 'es'
  | 'fr'
  | 'jp'
  | 'de-de'
  | 'en-gb'
  | 'en-us'
  | 'es-mx'
  | 'fr-fr'
  | 'it-it'
  | 'ja-jp'
  | 'ko-kr'
  | 'pt-br'
  | 'pt-pt'
  | 'ru-ru'
  | 'zh-cn'
  | string

export const currentLocales: any = {
  ar: {
    dir: 'rtl',
    lang: 'ar',
    name: 'العربية'
  },
  en: {
    lang: 'en',
    name: 'English'
  },
  es: {
    lang: 'es',
    name: 'Español'
  },
  fr: {
    lang: 'fr',
    name: 'Français'
  },
  it: {
    lang: 'it',
    name: 'Italiano'
  },
  jp: {
    lang: 'jp',
    name: '日本語'
  },
  'de-de': {
    lang: 'de-de',
    name: 'Deutsch'
  },
  'en-gb': {
    lang: 'en-gb',
    name: 'English (UK)'
  },
  'en-us': {
    lang: 'en-us',
    name: 'English (US)'
  },
  'es-mx': {
    lang: 'es-mx',
    name: 'Español (MX)'
  },
  'fr-fr': {
    lang: 'fr-fr',
    name: 'Français'
  },
  'it-it': {
    lang: 'it-it',
    name: 'Italiano'
  },
  'ja-jp': {
    lang: 'ja-jp',
    name: '日本語'
  },
  'ko-kr': {
    lang: 'ko-kr',
    name: '한국어'
  },
  'pt-br': {
    lang: 'pt-br',
    name: 'Português (BR)'
  },
  'pt-pt': {
    lang: 'pt-pt',
    name: 'Português (PT)'
  },
  'ru-ru': {
    lang: 'ru-ru',
    name: 'Русский'
  },
  'zh-cn': {
    lang: 'zh-cn',
    name: '中文（简体）'
  }
}

type I18nAttrs = {
  path: string
  locales: Locale[]
  defaultLocale: Locale
  pages: string[]
  localeRedirections?: Record<string, Locale>
  forceRedirection?: boolean
}

export const availableLocales = (join = true) => {
  const listOfLocales = Object.keys(currentLocales)

  if (join) {
    return listOfLocales.join('|')
  }

  return listOfLocales
}

export const isValidLanguage = (locale: Locale) => !!currentLocales[locale && locale.toLowerCase()]

const isValidLocale = (locale: Locale, locales: Locale[]) =>
  !!(
    locales.includes(locale && locale.toLowerCase()) ||
    currentLocales[locale && locale.toLowerCase()]
  )
const isValidPage = (page: string, pages: string[]) => !!pages.includes(page && page.toLowerCase())

// Getting the segments [0] = locale [1] = page
const getPathSegments = (path: string) => {
  const segments = path.split('/').filter((v: string) => v)

  return {
    segments,
    segmentsCount: segments.length
  }
}
export const getCurrentPage = (path: string, pages: string[], returnValidPage = false) => {
  const { segments } = getPathSegments(path)

  const [firstPage] = segments[0] ? segments[0].split('?') : ['']
  const [secondPage] = segments[1] ? segments[1].split('?') : ['']

  const page = isValidPage(firstPage, pages)
    ? firstPage
    : isValidPage(secondPage, pages)
    ? secondPage
    : firstPage ?? ''

  const validPage = isValidPage(page, pages) ? page : '/'

  return returnValidPage ? validPage : page
}

export const getCurrentLocale = (path: string, locales: Locale[], returnOriginal = false) => {
  const { segments } = getPathSegments(path)
  const locale = isValidLocale(segments[0] as Locale, locales) ? segments[0] : ''

  return returnOriginal ? segments[0] : locale
}

export const i18n = ({
  path,
  locales = [],
  defaultLocale,
  pages = [],
  localeRedirections = {},
  forceRedirection = false
}: I18nAttrs) => {
  // Root
  if (!path) {
    return {
      locale: defaultLocale,
      page: 'index',
      mustRedirect: forceRedirection
    }
  }

  const { segmentsCount } = getPathSegments(path)

  // If is valid locale we add it
  const locale = getCurrentLocale(path, locales)
  const lowerLocale = locale.toLowerCase()

  // Getting the page
  const page = getCurrentPage(path, pages)

  // Validations for valid locales and valid pages
  const equals = locale === page
  const invalidLocale = (equals && !locale) || !locale
  const invalidPage = !equals && !isValidPage(page, pages)
  const validLocale = !invalidLocale
  const validPage = !equals && isValidPage(page, pages)

  // Locale Redirections
  if (localeRedirections[lowerLocale]) {
    return {
      locale: localeRedirections[lowerLocale],
      page: validPage ? page : '',
      mustRedirect: forceRedirection
    }
  }

  // This is for single pages with no locale (/login)
  if (segmentsCount === 1 && invalidLocale && validPage) {
    return {
      locale: defaultLocale,
      page,
      mustRedirect: forceRedirection
    }
  }

  return {
    locale: validLocale ? lowerLocale : defaultLocale,
    page: validPage ? page : '',
    mustRedirect: forceRedirection && (invalidLocale || invalidPage || locale !== lowerLocale)
  }
}

export const getUserLanguage = (acceptLanguage: string, locales: Locale[]) => {
  const languages = acceptLanguage.split(';')[0]
  const userLanguage = languages.split(',')[0] || ''

  const validLocale = isValidLocale(userLanguage, locales)
  return validLocale ? userLanguage.toLowerCase() : currentLocales['en-us'].lang.toLowerCase()
}
