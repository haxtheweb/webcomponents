const { gql, PubSub } = require("apollo-server");
const pubsub = new PubSub();
const { prisma } = require("../../generated/prisma-client");
const GraphQLJSON = require("graphql-type-json");

const STATEMENT_CREATED = "STATMENT_CREATED";

/**
 * Define Schema
 */
const typeDefs = gql`
  scalar JSON

  extend type Query {
    statements: [Statement!]
    data: JSON!
  }

  extend type Mutation {
    createStatement(data: JSON!): Statement!
  }

  extend type Subscription {
    statementCreated: String!
  }

  type Statement {
    id: ID!
    data: JSON!
  }
`;

const resolvers = {
  JSON: GraphQLJSON,

  Query: {
    statements: async () => await prisma.statements()
  },

  Mutation: {
    createStatement: async (_, { data }) => {
      const statement = await prisma.createStatement({ data });
      pubsub.publish(STATEMENT_CREATED, {
        statmentCreated: JSON.stringify(statement)
      });
    }
  },

  Subscription: {
    statmentCreated: {
      subscribe: () => pubsub.asyncIterator(STATEMENT_CREATED)
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
};
