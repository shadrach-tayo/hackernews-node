const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");

// // prisma code
// async function main() {
//   // create a new link
//   const newLink = await prisma.createLink({
//     url: "www.prisma.io",
//     description: "Prisma replaces traditional ORMs"
//   });
//   console.log(`Created new link: ${newLink.url} (ID: ${newLink.id})`);

//   // Read all links from the database and print to the console
//   const allLinks = await prisma.links();
//   console.log(allLinks);
// }

// main().catch(e => console.log(e));

let links = [];
// 2
const resolvers = {
  Query: {
    info: () => `This is the API of the Hackenews Clone`,
    feed: (root, args, context, info) => {
      return context.prisma.links();
    },
    link(parent, args) {
      const result = links.filter(l => l.id === args.id)[0];
      return result;
    }
  },

  Mutation: {
    post: (root, args, context) => {
      return context.prisma.createLink({
        url: args.url,
        description: args.description
      });
    },

    updateLink: (parent, args, context) => {
      const link = context.prisma.updateLink({
        url: args.url,
        description: args.description
      });
      return link;
    },

    deleteLink(_, args) {
      let deletedLink;
      links = links.filter(l => {
        if (l.id === args.id) deleteLink = l;
        return l.id !== args.id;
      });
      return deleteLink;
    }
  }
};

// 3
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: { prisma }
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
