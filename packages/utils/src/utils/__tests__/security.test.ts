import { describe, expect, it } from 'vitest'
import security from '../security'

describe('security', () => {
  describe('encrypt', () => {
    it('should return a sha1 hash of the input string', () => {
      const input = 'test'
      const expectedResult = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'
      const result = security.encrypt(input)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('generateCode', () => {
    it('should return a random string of length 10', () => {
      const result = security.generateCode()
      expect(result).toHaveLength(10)
    })

    it('should return a unique string for each call', () => {
      const result1 = security.generateCode()
      const result2 = security.generateCode()
      expect(result1).not.toEqual(result2)
    })
  })

  describe('uuid', () => {
    it('should return a valid UUID v4', () => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      const result = security.uuid()
      expect(result).toMatch(uuidRegex)
    })
  })

  describe('getRandomCode', () => {
    it('should return a random string of the specified length', () => {
      const length = 6
      const result = security.getRandomCode(length)
      expect(result).toHaveLength(length)
    })

    it('should return a unique string for each call', () => {
      const length = 6
      const result1 = security.getRandomCode(length)
      const result2 = security.getRandomCode(length)
      expect(result1).not.toEqual(result2)
    })
  })
})
