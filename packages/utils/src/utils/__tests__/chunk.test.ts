import { describe, expect, it } from 'vitest'
import chunk from '../chunk'

describe('chunk', () => {
  it('should divide an array into chunks of the given size', () => {
    const input = [1, 2, 3, 4, 5]
    const output = chunk(input, 2)
    expect(output).toEqual([[1, 2], [3, 4], [5]])
  })

  it('should divide an array into chunks of size 1 by default', () => {
    const input = [1, 2, 3, 4, 5]
    const output = chunk(input)
    expect(output).toEqual([[1], [2], [3], [4], [5]])
  })

  it('should return an empty array if the input array is empty', () => {
    const input: any = []
    const output = chunk(input, 2)
    expect(output).toEqual([[]])
  })

  it('should return an array containing the entire input array if the chunk size is greater than the input array length', () => {
    const input = [1, 2, 3, 4, 5]
    const output = chunk(input, 10)
    expect(output).toEqual([input])
  })
})
