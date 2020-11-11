const { ApolloServer } = require("apollo-server");
const { prisma } = require("../prisma/generated/prisma-client");
const datamodelInfo = require("../prisma/generated/nexus-prisma");
const { prismaObjectType, makePrismaSchema } = require("nexus-prisma");
const path = require("path");

// Expose the full "Query" building block
const Query = prismaObjectType({
  name: "Query",
  // Expose all generated `Todo`-queries
  definition: (t) => t.prismaFields(["*"]),
});

// Customize the "Mutation" building block
const Mutation = prismaObjectType({
  name: "Mutation",
  definition: (t) => t.prismaFields(["*"]),
});

const schema = makePrismaSchema({
  types: [Query, Mutation],
  prisma: {
    datamodelInfo,
    client: prisma,
  },
  outputs: {
    schema: path.join(__dirname, "./generated/schema.graphql"),
  },
  nonNullDefaults: {
    input: true,
    output: true,
  },
});

const server = new ApolloServer({
  cors: true,
  schema,
  context: {
    prisma,
  },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀  Server ready at ${url} & ${subscriptionsUrl}`);
});
