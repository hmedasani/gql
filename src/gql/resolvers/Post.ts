import { ContextProps } from 'src';
import { userLoader } from '../../loaders/userLoader';

interface PostParentProps {
  authorId: number;
}

export const Post = {
  author: async (
    parent: PostParentProps,
    __: any,
    { prisma }: ContextProps
  ) => {
    return userLoader.load(parent.authorId);
    // return prisma.user.findUnique({
    //   where: {
    //     id: parent.authorId
    //   }
    // });
  }
};
