import { afterEach, describe, expect, it, vi } from 'vitest'
import { getGraphQlError, fetchQuery } from '../graphql'

describe('getGraphQlError', () => {
  it('should return a formatted GraphQL error object', () => {
    const error = new Error('GraphQL error: Test error message')
    const expectedResult = {
      error: true,
      message: 'Test error message'
    }

    const result = getGraphQlError(error)

    expect(result).toEqual(expectedResult)
  })
})

describe('fetchQuery', () => {
  const mockApolloClient = {
    query: vi.fn()
  }

  const mockQuery = 'test query'
  const mockVariables = { key: 'value' }

  afterEach(() => {
    mockApolloClient.query.mockReset()
  })

  it('should return null if skip is true', async () => {
    const result = await fetchQuery({
      apolloClient: mockApolloClient,
      query: mockQuery,
      variables: mockVariables,
      skip: true
    })

    expect(result).toBeNull()
    expect(mockApolloClient.query).not.toHaveBeenCalled()
  })

  it('should call apolloClient.query with provided query and variables', async () => {
    const mockData = { data: 'test data' }
    mockApolloClient.query.mockResolvedValue({ data: mockData })

    const result = await fetchQuery({
      apolloClient: mockApolloClient,
      query: mockQuery,
      variables: mockVariables,
      skip: false
    })

    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: mockQuery,
      variables: mockVariables
    })

    expect(result).toEqual(mockData)
  })
})
