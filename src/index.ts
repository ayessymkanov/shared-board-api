import express from 'express';
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from './gql/resolvers';
import { typeDefs } from './gql/schema';

const app = express();
const PORT = 8000;

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});