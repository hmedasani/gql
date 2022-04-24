import { prisma } from '@prisma/client';
import { Context } from '../../../src';

export const Query = {
  posts: (_: any, __: any, { prisma }: Context) => {
    return prisma.post.findMany({
      orderBy: [
        {
          createdAt: 'desc'
        }
      ]
    });
  }
};
