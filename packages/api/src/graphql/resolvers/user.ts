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
}

// Mutations
const createUser = async (
  _: any,
  { input: body }: { input: any },
  { request }: { request: any }
) => {
  const {
    response: { data, error }
  } = await request('/users/create', {
    method: 'POST',
    body
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
}

export default {
  Query: {
    getUsers
  },
  Mutation: {
    createUser
  }
}
