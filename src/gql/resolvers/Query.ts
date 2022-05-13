import { ContextProps } from 'src';

export const Query = {
  posts: async (_: any, __: any, { prisma }: ContextProps) => {
    return await prisma.post.findMany({
      orderBy: {
        createdBy: 'desc'
      }
    });
  }
};
