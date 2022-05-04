import { ContextProps } from 'src';

export const Query = {
  posts: async (_: any, __: any, { prisma }: ContextProps) => {
    const getPosts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return getPosts;
  }
};
