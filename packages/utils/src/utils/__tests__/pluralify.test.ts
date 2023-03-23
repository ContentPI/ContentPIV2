import { describe, expect, it } from 'vitest'
import pluralify from '../pluralify'

describe('pluralify', () => {
  it('should return the singular form when count is 1', () => {
    const singular = 'apple'
    const plural = 'apples'
    const count = 1
    const expectedResult = 'apple'
    const result = pluralify(singular, plural, count)
    expect(result).toEqual(expectedResult)
  })

  it('should return the plural form when count is not 1', () => {
    const singular = 'apple'
    const plural = 'apples'
    const count = 3
    const expectedResult = 'apples'
    const result = pluralify(singular, plural, count)
    expect(result).toEqual(expectedResult)
  })

  it('should return the plural form when count is 0', () => {
    const singular = 'apple'
    const plural = 'apples'
    const count = 0
    const expectedResult = 'apples'
    const result = pluralify(singular, plural, count)
    expect(result).toEqual(expectedResult)
  })
})
