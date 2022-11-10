// Queries
const getUsers = async (_: any, _args: any, { request }: { request: any }) => {
  const {
    response: { data, error }
  } = await request('/users')

  if (data.length > 0) {
    return {
      __typename: 'UserResponse',
      users: data
    }
  }

  return {
    __typename: 'Error',
    error
  }

  return data
}

// Mutations
const createUser = async (_: any, { input }: { input: any }, { request }: { request: any }) => {
  const {
    response: { data, error }
  } = await request('/users/create', {
    method: 'POST',
    body: JSON.stringify(input)
  })

  if (data) {
    return {
      __typename: 'UserResponse',
      users: [data]
    }
  }

  return {
    __typename: 'Error',
    error
  }

  return data
}

export default {
  Query: {
    getUsers
  },
  Mutation: {
    createUser
  }
}
