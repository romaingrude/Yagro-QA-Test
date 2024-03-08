import { gql } from 'graphql-tag'

export default gql`
  scalar DateTime

  type Insight {
    businessGroup: Group!
    content: String!
    id: ID!
    url: String
    year: Int!
    created: String
    updated: String
    emailedAt: DateTime
    queuedForEmail: Boolean!
  }

  extend type Query {
    getInsights(businessGroupId: ID): [Insight]!
  }
`
