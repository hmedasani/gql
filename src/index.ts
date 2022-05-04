import { ApolloServer } from 'apollo-server';
import { typeDefs } from './gql/schema';
import { Query, Mutation } from './gql/resolvers';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export interface ContextProps {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
}

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

server.listen().then(({ url }) => {
  console.log(`Server is listening at ${url}`);
});
