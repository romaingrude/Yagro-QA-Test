import { ApolloServer } from '@apollo/server'
import { handlers, startServerAndCreateLambdaHandler } from '@as-integrations/aws-lambda'
import { schema } from './graphql/schema'
import dataSources from './graphql/datasources'

const server = new ApolloServer({
  allowBatchedHttpRequests: true,
  // Specify server options here
  schema,
})

// This final export is important!
export const handler = startServerAndCreateLambdaHandler(server, handlers.createAPIGatewayProxyEventRequestHandler(), {
  context: async () => {
    return {
      dataSources,
    }
  },
})
