import { ContextProps } from 'src';

export const Query = {
  posts: async (_: any, __: any, { prisma }: ContextProps) => {
    return prisma.post.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
};
