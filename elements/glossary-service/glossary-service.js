const { ApolloServer, gql } = require("apollo-server");
const path = require("path");
const lodashId = require("lodash-id");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

// establish a connection to the database
const dbDestination = path.join(process.cwd(), process.argv[2]);
const adapter = new FileSync(dbDestination);
const db = low(adapter);
db._.mixin(lodashId);

const typeDefs = gql`
  type Term {
    id: ID
    name: String
    definition: String
  }

  type Query {
    helloWorld: String
    term(name: String): Term
    terms: [Term]
  }

  type Mutation {
    updateTerm(name: String, definition: String): Term!
    deleteTerm(name: String): Term!
  }
`;

const resolvers = {
  Query: {
    terms: () => {
      return db.get("terms").value();
    },
    term: (parent, { name, id }) =>
      db
        .get("terms")
        .find({ name })
        .value()
  },
  Mutation: {
    updateTerm: (parent, { name, definition }, context, info) => {
      const collection = db.get("terms");
      const existingTerm = collection.find({ name });
      // update the term
      if (typeof existingTerm.value() !== "undefined") {
        return existingTerm.assign({ definition }).write();
      }
      // add the term
      else {
        return collection.insert({ name, definition }).write();
      }
    },
    deleteTerm: (parent, { name }, context, info) =>
      db
        .get("terms")
        .remove({ name })
        .write()
  }
};

const server = new ApolloServer({ cors: true, typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
