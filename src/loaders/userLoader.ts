import { User } from '@prisma/client';
import DataLoader from 'dataloader';
import { prisma } from '../index';

type BatchUser = (ids: number[]) => Promise<User[]>;

const batchUser: BatchUser = async (ids) => {
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: ids
      }
    }
  });

  const userMap: { [key: string]: User } = {};

  users.forEach((each) => {
    userMap[each.id] = each;
  });
  return ids.map((eachId) => userMap[eachId]);
};

//@ts-ignore
export const userLoader = new DataLoader<number, User>(batchUser);
