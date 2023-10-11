import express from 'express';
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from './gql/resolvers';
import { typeDefs } from './gql/schema';

const app = express();

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(8000, () => {
  console.log('server listening on port 8000');
});