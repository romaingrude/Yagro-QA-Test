import { gql } from 'graphql-tag'

export default gql`
  type LoginResponse {
    auth_token: String!
    refresh_token: String!
    user: User
    group: Group
  }

  input LoginInput {
    email: String!
    password: String!
  }

  extend type Mutation {
    loginUser(input: LoginInput!): LoginResponse
  }
`
