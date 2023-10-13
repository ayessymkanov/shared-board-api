import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import "dotenv/config";
import { resolvers } from './gql/resolvers';
import { typeDefs } from './gql/schema';

type Context = {
  user?: any;
}

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  introspection: true,
});

startStandaloneServer(server, {
  listen: { port: 8000 },
  context: async ({ req }) => ({}),
}).then(({ url }) => {
  console.log(`Server started at ${url}`);
});