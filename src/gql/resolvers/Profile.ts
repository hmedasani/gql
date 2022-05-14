import { ContextProps } from 'src';
import { errorTokenMsg } from '../../utils';

interface ProfileParentProps {
  id: number;
  bio: string;
  userId: number;
}

export const Profile = {
  user: async (
    parent: ProfileParentProps,
    __: any,
    { prisma }: ContextProps
  ) => {
    return prisma.user.findUnique({
      where: {
        id: Number(parent.userId)
      }
    });
  }
};
