const { gql, PubSub } = require("apollo-server");
const pubsub = new PubSub();
const { prisma } = require("../../generated/prisma-client");
const GraphQLJSON = require("graphql-type-json");

const STATEMENT_CREATED = "STATMENT_CREATED";

/**
 * Define Schema
 */
const typeDefs = gql`
  scalar Json

  extend type Query {
    statements: [Statement!]
    data: Json!
  }

  extend type Mutation {
    createStatement(data: Json!): Statement!
  }

  extend type Subscription {
    statement: Statement!
  }

  type Statement {
    id: ID!
    data: Json!
  }
`;

const resolvers = {
  Json: GraphQLJSON,

  Query: {
    statements: async () => await prisma.statements()
  },

  Mutation: {
    createStatement: async (_, { data }) =>
      await prisma.createStatement({ data })
  },

  Subscription: {
    statement: {
      /**
       * @todo
       * Keeps returning null
       */
      subscribe: async () => await prisma.$subscribe.statement().node()
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
};
