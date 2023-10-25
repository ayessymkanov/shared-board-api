import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import { readFileSync } from "fs";
import "dotenv/config";
import { resolvers } from './gql/resolvers';
import { getUser } from "./utils";

const PORT = Number(process.env.PORT ?? 8000);
const app = express();
const httpServer = http.createServer(app);

const typeDefs = readFileSync("./src/gql/schema.graphql", { encoding: "utf-8" });
const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

await server.start();

app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];
      const user = getUser(token);
      return { user };
    }
  })
);

await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
console.log(`Server is listening at http://localhost:${PORT}`);

// startStandaloneServer(server, {
//   listen: { port: PORT },
//   context: async ({ req }) => {
//     // @ts-ignore
//     if (WHITE_LIST_OPERATIONS.includes(req.body.operationName)) {
//       return {};
//     }
//     const authHeader = req.headers.authorization;
//     const token = authHeader?.split(' ')[1];
//     const user = getUser(token);
//     return { user };
//   }
// }).then(({ url }) => {
//   console.log(`Server started at ${url}`);
// });
