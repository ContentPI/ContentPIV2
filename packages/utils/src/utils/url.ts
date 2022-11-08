import is from './is'

export function getLocation(req?: any): any {
  return typeof window !== 'undefined' ? window.location : { pathname: req && req.url }
}

export function getCurrentUrl(): string {
  return getLocation().pathname || ''
}

export function getParams(url: string, index = 0): string | string[] {
  if (!url) {
    url = getLocation().pathname
  }

  if (is.String(url)) {
    if (url.indexOf('?') > -1) {
      url = url.substring(0, url.indexOf('?'))
    }

    const params = url.split('/')
    params.shift()

    if (params[params.length - 1] === '') {
      params.pop()
    }

    if (index) {
      if (is.Language(params[0])) {
        index += 1
      }

      if (is.Defined(params[index])) {
        return params[index]
      }
    }

    return params
  }

  return ''
}

export const getCurrentLocale = (url?: string, defaultLanguage = 'en-us') => {
  const params = getParams(url || '')
  return params && is.Language(params[0]) ? params[0] : defaultLanguage
}

export function redirectTo(url = '/', includeLanguage?: any): void {
  if (is.Browser()) {
    const { pathname } = window.location
    const locale = getCurrentLocale()
    let slash = '/'

    if (url === '_self') {
      if (is.Language(includeLanguage)) {
        const segments = pathname.split(slash).filter((v) => v)

        if (is.Language(segments[0])) {
          segments[0] = includeLanguage
        }

        window.location.href = `${slash}${segments.join('/')}`
      } else {
        window.location.href = pathname
      }
    } else if (includeLanguage) {
      if (url[0] === '/') {
        slash = ''
      }

      window.location.href = `/${locale}${slash}${url}`
    } else {
      window.location.href = url
    }
  }
}

export function getRedirectToUrl() {
  return is.Browser() ? window.location.search.replace('?redirectTo=', '') : ''
}

export function buildUrl(params: string[]) {
  return params.filter((v) => v).join('/')
}

export function getUrlWithoutLocale(url: string) {
  const segments = url.split('/').filter(Boolean)

  if (is.Language(segments[0])) {
    segments.shift()
  }

  return `/${segments.join('/')}`
}
