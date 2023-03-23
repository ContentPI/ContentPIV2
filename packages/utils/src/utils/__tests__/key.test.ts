import { describe, expect, it } from 'vitest'
import keys from '../keys'

describe('keys', () => {
  it('should return an empty array if input is not an object', () => {
    const nonObjectValues = [undefined, null, true, 42, 'string', Symbol('test'), [], () => {}]

    nonObjectValues.forEach((value) => {
      expect(keys(value)).toEqual([])
    })
  })

  it('should return an array of keys when input is an object', () => {
    const inputObj = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3'
    }

    const expectedResult = ['key1', 'key2', 'key3']
    const result = keys(inputObj)

    expect(result).toEqual(expectedResult)
  })
})
