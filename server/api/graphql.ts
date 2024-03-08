import { ApolloServer } from '@apollo/server'
import { startServerAndCreateH3Handler } from '@as-integrations/h3'
import dataSources from '~~/api/graphql/datasources'
import { schema } from '~~/api/graphql/schema'
import type { DataSources } from '~~/api/graphql/datasources'

interface ContextValue {
  dataSources: DataSources
  token: string
}

const apollo = new ApolloServer<ContextValue>({
  allowBatchedHttpRequests: true,
  // Specify server options here
  schema,
})

export default startServerAndCreateH3Handler(apollo, {
  context: () => {
    return {
      dataSources,
    }
  },
})
