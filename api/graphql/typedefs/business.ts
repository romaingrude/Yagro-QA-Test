import { gql } from 'graphql-tag'

export default gql`
  type Group {
    id: ID
    name: String
    mainContact: String
    uuid: String
  }

  type User {
    email: String!
    password: String!
    partnerId: String
    roles: [UserRole]
  }

  enum UserRole {
    YAGRO_ENG_ADMIN
    YAGRO_ADMIN
    USER
  }

  extend type Query {
    getGroups: [Group]
  }
`
