const { ApolloServer } = require("apollo-server");

const server = new ApolloServer({
  cors: true,
  modules: [require("./modules/ping"), require("./modules/statement")]
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀  Server ready at ${url} & ${subscriptionsUrl}`);
});
