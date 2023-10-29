import express, { NextFunction, Request, Response } from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import cors, { CorsOptions } from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import { readFileSync } from "fs";
import "dotenv/config";
import { resolvers } from './gql/resolvers';
import { getUser } from "./utils";
import authRouter from "./authRoutes";
import { error } from "./middleware/error";

const PORT = Number(process.env.PORT ?? 8000);
const isProd = process.env.NODE_ENV === "prod";

const app = express();
const httpServer = http.createServer(app);

const typeDefs = readFileSync("./src/gql/schema.graphql", { encoding: "utf-8" });
const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

const corsOptions: CorsOptions = {
  origin: true,
  credentials: true,
}

if (isProd) {
  corsOptions.origin = process.env.CLIENT_ORIGIN;
}

app.use(express.json());
app.use(cors<cors.CorsRequest>(corsOptions));
app.use(authRouter);
app.use(error);

(async function() {
  await server.start();
  app.use(
    '/graphql',
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
})();
