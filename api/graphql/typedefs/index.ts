import { gql } from 'graphql-tag'
import analyticsTypeDefs from './analytics'
import authTypeDefs from './auth'
import trackerTypeDefs from './tracker'
import businessTypeDefs from './business'
import productsTypeDefs from './products'
import insightsTypeDefs from './insights'

const rootTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
  enum SortOrder {
    ASC
    DESC
  }

  input PageOptions {
    perPage: Int
    page: Int
    sortByOrder: SortOrder
  }

  type PageInfo {
    pageNumber: Int
    hasNext: Boolean
    hasPrevious: Boolean
    nextPageNumber: Int
    numPages: Int
    perPage: Int
    previousPageNumber: Int
    total: Int
  }
  interface PagedResponse {
    pageInfo: PageInfo
  }
`

export {
  analyticsTypeDefs,
  authTypeDefs,
  businessTypeDefs,
  productsTypeDefs,
  insightsTypeDefs,
  rootTypeDefs,
  trackerTypeDefs,
}
