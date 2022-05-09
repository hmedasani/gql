import { Post, Prisma } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { ContextProps } from 'src';
import { canUserMutatePost } from '../../../utils';

interface PostUpdateArgProps {
  postId: number | null;
  post: {
    title: string;
    content: string;
  };
}

interface PostUpdatePayload {
  userErrors: {
    message: string;
  }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postUpdate = async (
  _: any,
  { postId, post }: PostUpdateArgProps,
  { userInfo, prisma }: ContextProps
): Promise<PostUpdatePayload> => {
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
          message: 'Choose right post to Update!'
        }
      ],
      post: null
    };
  }
  //validate is title and content provided?
  const { title, content } = post;
  if (!title && !content) {
    return {
      userErrors: [
        {
          message: 'You must povide title or content field to Update this Post'
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

  //create new object with title and content
  let postObj: { title?: string; content?: string } = {
    title,
    content
  };

  if (!title) delete postObj.title;
  if (!content) delete postObj.content;

  //return
  return {
    userErrors: [],
    post: prisma.post.update({
      where: {
        id: Number(postId)
      },
      data: postObj
    })
  };
};
