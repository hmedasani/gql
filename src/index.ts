import { ApolloServer } from 'apollo-server';
import { typeDefs } from './gql/schema';
import { Query, Mutation } from './gql/resolvers';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
}

// server
const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation
  },
  context: {
    prisma
  }
});

// server listen
server.listen().then(({ url }) => {
  console.log(`Server ready on ${url}`);
});
