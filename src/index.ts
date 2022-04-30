import { ApolloServer } from 'apollo-server';
import { typeDefs } from './gql/schema';
import { Query } from './gql/resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query
  }
});

server.listen().then(({ url }) => {
  console.log(`Server is listening at ${url}`);
});
