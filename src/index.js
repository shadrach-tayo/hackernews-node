const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");

// Resolvers
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");

// Resolvers
const resolvers = {
  Query,
  Mutation,
  User,
  Link
};

// 3
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: request => ({ ...request, prisma })
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
