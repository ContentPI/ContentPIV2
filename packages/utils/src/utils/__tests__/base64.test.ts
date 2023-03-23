import { describe, expect, it } from 'vitest'
import base64 from '../base64'

describe('base64', () => {
  describe('get', () => {
    it('should decode a base64 string to an ASCII string', () => {
      const encodedString = 'SGVsbG8sIHdvcmxkIQ==' // "Hello, world!"
      const decodedString = base64.get(encodedString)
      expect(decodedString).toBe('Hello, world!')
    })

    it('should decode a base64 string containing a JSON object', () => {
      const encodedJson = 'eyJrZXkiOiAidmFsdWUifQ==' // '{"key": "value"}'
      const decodedJson = base64.get(encodedJson)
      expect(decodedJson).toEqual({ key: 'value' })
    })

    it('should return an empty string if the input is not a string', () => {
      const input = 42
      const output = base64.get(input)
      expect(output).toBe('')
    })
  })

  describe('set', () => {
    it('should encode an ASCII string to a base64 string', () => {
      const inputString = 'Hello, world!'
      const encodedString = base64.set(inputString)
      expect(encodedString).toBe('SGVsbG8sIHdvcmxkIQ==')
    })

    it('should encode a JSON object to a base64 string', () => {
      const inputJson = { key: 'value' }
      const encodedJson = base64.set(inputJson)
      expect(encodedJson).toBe('eyJrZXkiOiJ2YWx1ZSJ9')
    })

    it('should return null if the input is not a string or an object', () => {
      const input = 42
      const output = base64.set(input)
      expect(output).toBeNull()
    })
  })
})
