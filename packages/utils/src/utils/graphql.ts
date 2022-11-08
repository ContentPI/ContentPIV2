interface Error {
  error: boolean
  message: string
}

export function getGraphQlError(error: any): Error {
  return {
    error: true,
    message: error.toString().replace('Error: GraphQL error: ', '')
  }
}

type UseQueryParams = {
  apolloClient: any
  query: any
  skip?: boolean
  variables?: any
}

export async function fetchQuery<T>({
  apolloClient,
  query,
  variables = {},
  skip = false
}: UseQueryParams): Promise<T | null> {
  if (skip) {
    return null
  }

  const { data } = await apolloClient.query({
    query,
    variables
  })

  return data
}
