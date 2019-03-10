const { ApolloServer } = require("apollo-server");

const server = new ApolloServer({
  modules: [require("./modules/statement")]
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀  Server ready at ${url} & ${subscriptionsUrl}`);
});
