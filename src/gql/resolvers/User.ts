import { ContextProps } from 'src';

interface ParentProps {
  id: number;
}

export const User = {
  posts: async (
    parent: ParentProps,
    __: any,
    { prisma, userInfo }: ContextProps
  ) => {
    const isOwnProfile = parent.id === userInfo?.userId;
    if (isOwnProfile) {
      return prisma.post.findMany({
        where: {
          authorId: Number(parent.id)
        },
        orderBy: {
          createdBy: 'desc'
        }
      });
    } else {
      return prisma.post.findMany({
        where: {
          authorId: Number(parent.id),
          published: true
        },
        orderBy: {
          createdBy: 'desc'
        }
      });
    }
  }
};
