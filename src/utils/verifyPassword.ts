import { ContextProps } from '../index';
import { errorTokenMsg } from './index';
import bcryptjs from 'bcryptjs';
interface CanUserMutateThisPostProps {
  userId: number;
  password: string;
  prisma: ContextProps['prisma'];
}

export const verifyPassword = async ({
  userId,
  password,
  prisma
}: CanUserMutateThisPostProps) => {
  //validate is postId and userId provided
  if (!userId && !password) return errorTokenMsg('Invalid Credentials!');

  //validate is userId exists
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!existingUser) return errorTokenMsg('User does not exist');

  //validate is postId exists
  const isMatch = await bcryptjs.compare(password, existingUser.password);
  if (!isMatch) return errorTokenMsg('Invalid Credentials!');
};
