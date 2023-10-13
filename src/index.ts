import express from 'express';
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import cookieParser from "cookie-parser";
// import { expressjwt as jwt } from "express-jwt";
import "dotenv/config";
import { resolvers } from './gql/resolvers';
import { typeDefs } from './gql/schema';

const app = express();
const PORT = 8000;

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

const secret = process.env.JWT_SECRET ?? "";

// const auth = jwt({
//   secret,
//   credentialsRequired: false,
//   algorithms: ["HS256"],
// });

app.use(cookieParser());

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});