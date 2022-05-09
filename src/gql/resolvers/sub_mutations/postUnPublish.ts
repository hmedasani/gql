import { Post, Prisma } from '@prisma/client';
import { ContextProps } from 'src';
import { canUserMutatePost } from '../../../utils';

interface PostUnPublishArgProps {
  postId: number | null;
}

interface PostUnPublishPayload {
  userErrors: {
    message: string;
  }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postUnPublish = async (
  _: any,
  { postId }: PostUnPublishArgProps,
  { userInfo, prisma }: ContextProps
): Promise<PostUnPublishPayload> => {
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
          message: 'Choose right post to UnPublish!'
        }
      ],
      post: null
    };
  }

  //validate is user exist?
  const loggedInUser = await prisma.user.findUnique({
    where: {
      id: Number(userInfo.userId)
    }
  });

  if (!loggedInUser) {
    return {
      userErrors: [
        {
          message: 'Forbidden credentials!'
        }
      ],
      post: null
    };
  }

  //validate is post exist?
  const findPost = await prisma.post.findUnique({
    where: {
      id: Number(postId)
    }
  });

  if (!findPost) {
    return {
      userErrors: [
        {
          message: 'Chosen post is not available!'
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
    post: prisma.post.update({
      where: {
        id: Number(postId)
      },
      data: {
        published: false
      }
    })
  };
};
