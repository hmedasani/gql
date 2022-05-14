import { ApolloServer } from 'apollo-server';
import { typeDefs } from './gql/schema';
import { Mutation, Query, Profile, Post, User } from './gql/resolvers';
import { Prisma, PrismaClient } from '@prisma/client';
import { getUserFromStr } from './utils';

export const prisma = new PrismaClient();
export interface ContextProps {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  userInfo: { userId: number } | null;
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Profile,
    Post,
    User
  },
  context: async ({ req }: any): Promise<ContextProps> => {
    const userInfo = await getUserFromStr(req.headers.authorization);
    return {
      prisma,
      userInfo
    };
  }
});

server.listen().then(({ url }) => {
  console.log(`Server is listening at ${url}`);
});
