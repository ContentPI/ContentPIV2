import { describe, expect, it } from 'vitest'
import capitalize from '../capitalize'

describe('capitalize', () => {
  it('should capitalize the first letter of a lowercase string', () => {
    const input = 'hello'
    const output = capitalize(input)
    expect(output).toBe('Hello')
  })

  it('should not modify the string if the first letter is already uppercase', () => {
    const input = 'Hello'
    const output = capitalize(input)
    expect(output).toBe('Hello')
  })

  it('should return an empty string if the input is not a string', () => {
    const input = 42
    const output = capitalize(input)
    expect(output).toBe('')
  })

  it('should return an empty string if the input is an empty string', () => {
    const input = ''
    const output = capitalize(input)
    expect(output).toBe('')
  })
})
