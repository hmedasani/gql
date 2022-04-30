import { ContextProps } from 'src';

export const Query = {
  posts: (_: any, __: any, { prisma }: ContextProps) =>
    prisma.post.findMany({
      orderBy: [
        {
          createdAt: 'desc'
        }
      ]
    })
};
