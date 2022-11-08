import gql from 'graphql-tag'

export default gql`
  type ErrorResponse {
    code: String
    message: String!
  }

  type Error {
    error: ErrorResponse
  }
`
