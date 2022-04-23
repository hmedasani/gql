import { ApolloServer } from 'apollo-server';
import { typeDefs } from './gql/schema';
import { Query } from './gql/resolvers';

// server
const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query
  }
});

// server listen
server.listen().then(({ url }) => {
  console.log(`Server ready on ${url}`);
});
