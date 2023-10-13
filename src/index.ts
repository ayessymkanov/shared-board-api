import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import "dotenv/config";
import jsonwebtoken from "jsonwebtoken";
import { resolvers } from './gql/resolvers';
import { typeDefs } from './gql/schema';

type Context = {
  user?: any;
}

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

const WHITE_LIST_OPERATIONS = ["Signup", "Login"];

const getUser = async (token?: string) => {
  try {
    if (!token) {
      return null;
    }
    const user = await jsonwebtoken.verify(token, process.env.JWT_SECRET as string, { algorithms: ['HS256']});
    return user;
  } catch (err) {
    return null
  }
}

startStandaloneServer(server, {
  listen: { port: 8000 },
  context: async ({ req }) => {
    // @ts-ignore
    if (WHITE_LIST_OPERATIONS.includes(req.body.operationName)) {
      return {};
    }
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    const user = await getUser(token);
    return { user };
  }
}).then(({ url }) => {
  console.log(`Server started at ${url}`);
});