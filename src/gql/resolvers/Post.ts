import { ContextProps } from 'src';

interface PostParentProps {
  authorId: number;
}

export const Post = {
  author: async (
    parent: PostParentProps,
    __: any,
    { prisma }: ContextProps
  ) => {
    return prisma.user.findUnique({
      where: {
        id: Number(parent.authorId)
      }
    });
  }
};
