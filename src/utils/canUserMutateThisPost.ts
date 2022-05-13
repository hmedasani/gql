import { ContextProps } from '../index';
import { errorPostMsg } from './index';
interface CanUserMutateThisPostProps {
  postId: number;
  userId: number;
  prisma: ContextProps['prisma'];
}

export const canUserMutateThisPost = async ({
  postId,
  userId,
  prisma
}: CanUserMutateThisPostProps) => {
  //validate is postId and userId provided
  if (!postId && !userId) return errorPostMsg('Restricted Action.');

  //validate is userId exists
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!existingUser) return errorPostMsg('User does not exist');

  //validate is postId exists
  const existingPost = await prisma.post.findUnique({
    where: {
      id: postId
    }
  });
  if (!existingPost) return errorPostMsg('Post does not exist');

  //validate is this user can mutate this post?
  if (existingPost?.authorId !== existingUser?.id)
    return errorPostMsg('You are restricted to act on this post');
};
