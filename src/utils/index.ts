import JWT from 'jsonwebtoken';
import { ContextProps } from 'src';
import { SIGNKEY } from '../gql/keys';
export const getTokenFromHeaders = (token: string) => {
  try {
    return JWT.verify(token, SIGNKEY) as {
      userId: number;
    };
  } catch (err) {
    return null;
  }
};

interface CanUserMutatePostProps {
  userId: number;
  postId: number;
  prisma: ContextProps['prisma'];
}

export const canUserMutatePost = async ({
  userId,
  postId,
  prisma
}: CanUserMutatePostProps) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  if (!user) {
    return {
      userErrors: [
        {
          message: 'User does not exist!'
        }
      ],
      post: null
    };
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId
    }
  });

  if (post?.authorId !== user.id) {
    return {
      userErrors: [
        {
          message: 'This is not belongs to you! Try another.'
        }
      ],
      post: null
    };
  }
};
