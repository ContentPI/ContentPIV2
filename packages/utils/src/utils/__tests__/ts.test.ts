import { describe, expect, it } from 'vitest'
import ts from '../ts'

describe('#hasKey', () => {
  const obj = {
    foo: 'bar'
  }

  it('should return true if an object has a key', () => {
    expect(ts.hasKey(obj, 'foo')).toBe(true)
  })

  it('should return false if an object does not has a key', () => {
    expect(ts.hasKey(obj, 'bar')).toBe(false)
  })
})
