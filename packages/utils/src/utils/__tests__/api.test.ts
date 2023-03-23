import { describe, expect, it } from 'vitest'
import { responseHandler } from '../api'

describe('responseHandler', () => {
  it('should return an error object if error is provided', () => {
    const input = {
      error: 'Error message',
      status: 400,
      query: 'exampleQuery'
    }

    const output = responseHandler(input)

    expect(output.system.error).toBe(true)
    expect(output.system.status).toBe(input.status)
    expect(output.system.query).toBe(input.query)
    expect(output.response.error).toBe(input.error)
  })

  it('should return a success object if no error is provided', () => {
    const input = {
      data: 'Sample data',
      status: 200,
      query: 'exampleQuery'
    }

    const output = responseHandler(input)

    expect(output.system.error).toBe(false)
    expect(output.system.status).toBe(input.status)
    expect(output.system.query).toBe(input.query)
    expect(output.response.data).toBe(input.data)
  })

  it('should return the correct cache value, status, and query', () => {
    const input = {
      data: 'Sample data',
      cache: true,
      status: 201,
      query: 'exampleQuery'
    }

    const output = responseHandler(input)

    expect(output.system.cache).toBe(input.cache)
    expect(output.system.status).toBe(input.status)
    expect(output.system.query).toBe(input.query)
  })
})
