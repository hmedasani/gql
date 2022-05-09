import { Post, Prisma } from '@prisma/client';
import { ContextProps } from 'src';
import { canUserMutatePost } from '../../../utils';

interface PostDeleteArgProps {
  postId: string;
}

interface PostDeletePayload {
  userErrors: {
    message: string;
  }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postDelete = async (
  _: any,
  { postId }: PostDeleteArgProps,
  { userInfo, prisma }: ContextProps
): Promise<PostDeletePayload> => {
  //validate is user loggedin?
  if (!userInfo) {
    return {
      userErrors: [
        {
          message: 'Please login!'
        }
      ],
      post: null
    };
  }

  //validate is postId provided?
  if (!postId) {
    return {
      userErrors: [
        {
          message: 'Choose right post to Delete!'
        }
      ],
      post: null
    };
  }

  //validate is this post available?
  const findPost = await prisma.post.findUnique({
    where: {
      id: Number(postId)
    }
  });

  if (!findPost) {
    return {
      userErrors: [
        {
          message: 'Choose right post to Delete!'
        }
      ],
      post: null
    };
  }

  const error = await canUserMutatePost({
    userId: Number(userInfo?.userId),
    postId: Number(postId),
    prisma
  });

  if (error) return error;

  //return
  return {
    userErrors: [],
    post: prisma.post.delete({
      where: {
        id: Number(postId)
      }
    })
  };
};
