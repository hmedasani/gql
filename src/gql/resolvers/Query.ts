import { ContextProps } from 'src';
import { errorTokenMsg } from '../../utils';

export const Query = {
  me: async (parent: any, __: any, { prisma, userInfo }: ContextProps) => {
    //if user not logged in?
    if (!userInfo) return errorTokenMsg('Forbidden Credentials');

    //if user logged in?
    return prisma.user.findUnique({
      where: {
        id: Number(userInfo.userId)
      }
    });
  },
  posts: async (parent: any, __: any, { prisma }: ContextProps) => {
    return await prisma.post.findMany({
      where: {
        published: true
      },
      orderBy: {
        createdBy: 'desc'
      }
    });
  },
  profile: async (
    _: any,
    { userId }: { userId: string },
    { prisma }: ContextProps
  ) => {
    //if user not logged in?
    // if (!userInfo) return errorTokenMsg('Forbidden Credentials');
    return prisma.profile.findUnique({
      where: {
        userId: Number(userId)
      }
    });
  }
};
