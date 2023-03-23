import { describe, expect, it, vi } from 'vitest'
import forEach from '../forEach'

describe('forEach', () => {
  it('should iterate over array elements and execute the callback', () => {
    const mockArray = [1, 2, 3]
    const mockCallback = vi.fn()
    forEach(mockArray, mockCallback)

    expect(mockCallback).toHaveBeenCalledTimes(3)
    expect(mockCallback).toHaveBeenNthCalledWith(1, 1, 0, mockArray)
    expect(mockCallback).toHaveBeenNthCalledWith(2, 2, 1, mockArray)
    expect(mockCallback).toHaveBeenNthCalledWith(3, 3, 2, mockArray)
  })

  it('should iterate over object keys and execute the callback', () => {
    const mockObject = { a: 1, b: 2, c: 3 }
    const mockCallback = vi.fn()
    forEach(mockObject, mockCallback)

    const objectKeys = Object.keys(mockObject)
    expect(mockCallback).toHaveBeenCalledTimes(3)
    objectKeys.forEach((key, index) => {
      expect(mockCallback).toHaveBeenNthCalledWith(index + 1, key, index, objectKeys)
    })
  })

  it('should return false if items are not defined', () => {
    const mockCallback = vi.fn()
    const result = forEach(undefined, mockCallback)

    expect(mockCallback).not.toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('should return false if items are neither an array nor an object', () => {
    const mockCallback = vi.fn()
    const result = forEach('string', mockCallback)

    expect(mockCallback).not.toHaveBeenCalled()
    expect(result).toBe(false)
  })
})
