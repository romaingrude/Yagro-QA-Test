import { buildSubgraphSchema } from '@apollo/subgraph'
import {
  analyticsTypeDefs,
  authTypeDefs,
  businessTypeDefs,
  insightsTypeDefs,
  productsTypeDefs,
  rootTypeDefs,
  trackerTypeDefs,
} from './typedefs'
import {
  analyticsResolvers,
  authResolvers,
  businessResolvers,
  insightsResolvers,
  productsResolvers,
  trackerResolvers,
} from './resolvers'

export const schema = buildSubgraphSchema([
  { typeDefs: rootTypeDefs },
  { resolvers: analyticsResolvers, typeDefs: analyticsTypeDefs },
  { resolvers: authResolvers, typeDefs: authTypeDefs },
  { resolvers: businessResolvers, typeDefs: businessTypeDefs },
  { resolvers: trackerResolvers, typeDefs: trackerTypeDefs },
  { resolvers: productsResolvers, typeDefs: productsTypeDefs },
  { resolvers: insightsResolvers, typeDefs: insightsTypeDefs },
])
