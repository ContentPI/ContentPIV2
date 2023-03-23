import { describe, expect, it } from 'vitest'
import slug from '../slug'

describe('slug', () => {
  it('should convert a string to a URL-safe slug', () => {
    const input = 'Test String with Spécial Ch@racters'
    const expectedResult = 'test-string-with-special-chracters'
    const result = slug(input)
    expect(result).toEqual(expectedResult)
  })

  it('should return an empty string for an empty input', () => {
    const input = ''
    const expectedResult = ''
    const result = slug(input)
    expect(result).toEqual(expectedResult)
  })

  it('should return a lowercase slug', () => {
    const input = 'TEST STRING'
    const expectedResult = 'test-string'
    const result = slug(input)
    expect(result).toEqual(expectedResult)
  })
})
