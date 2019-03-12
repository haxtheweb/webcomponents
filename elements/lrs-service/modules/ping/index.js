const { gql } = require("apollo-server");

/**
 * Offer a connection ping to services that want
 * to see if the server is online
 */

/**
 * Define Schema
 */
const typeDefs = gql`
  extend type Query {
    ping: Boolean!
  }
`;

const resolvers = {
  Query: {
    ping: () => true
  }
};

module.exports = {
  typeDefs,
  resolvers
};
