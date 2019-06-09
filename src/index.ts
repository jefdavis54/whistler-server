import { ApolloServer } from "apollo-server";
import { prisma } from "./generated/prisma-client";
import { resolvers, typeDefs } from "./graphql";

if (Number(process.env.PORT) === NaN) {
  throw new Error("Invalid Environmental Variables");
}

// zJED TODO PROD: Set introspection & playground to false for server initialization object.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: request => ({ prisma, request }),
});

server.listen({ port: process.env.PORT }, () => {
  console.log(`🚀 Server ready at: ${process.env.PORT}`);
});
