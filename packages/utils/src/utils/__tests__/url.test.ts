import { describe, expect, it } from 'vitest'
import { getParams, getCurrentLocale, buildUrl, getUrlWithoutLocale } from '../url'

describe('getParams', () => {
  it('returns an array of URL path segments', () => {
    expect(getParams('/example/path/123')).toEqual(['example', 'path', '123'])
  })

  it('removes the query string from the URL', () => {
    expect(getParams('/example/path?query=string')).toEqual(['example', 'path'])
  })

  it('removes the trailing slash from the URL', () => {
    expect(getParams('/example/path/')).toEqual(['example', 'path'])
  })

  it('returns the segment at the specified index when index is provided', () => {
    expect(getParams('/example/path/123', 2)).toEqual('123')
  })
})

describe('getCurrentLocale', () => {
  it('returns the first path segment when it is a valid language code', () => {
    expect(getCurrentLocale('/en-us/example')).toEqual('en-us')
  })

  it('returns the default language when the first path segment is not a valid language code', () => {
    expect(getCurrentLocale('/example', 'en-us')).toEqual('en-us')
  })

  it('returns the default language when the URL is empty', () => {
    expect(getCurrentLocale('', 'en-us')).toEqual('en-us')
  })
})

describe('buildUrl', () => {
  it('returns empty string for empty array', () => {
    expect(buildUrl([])).toBe('')
  })

  it('removes empty strings from array', () => {
    expect(buildUrl(['', 'foo', '', 'bar'])).toBe('foo/bar')
  })

  it('joins array with slashes', () => {
    expect(buildUrl(['foo', 'bar'])).toBe('foo/bar')
  })
})

describe('getUrlWithoutLocale', () => {
  it('removes language from start of URL', () => {
    expect(getUrlWithoutLocale('/en/foo/bar')).toBe('/foo/bar')
  })

  it('does not remove anything if URL has no language', () => {
    expect(getUrlWithoutLocale('/foo/bar')).toBe('/foo/bar')
  })
})
