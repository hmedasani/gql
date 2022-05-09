import { Post, Prisma } from '@prisma/client';
import { ContextProps } from 'src';

interface PostCreateArgProps {
  post: {
    title: string;
    content: string;
  };
}

interface PostCreatePayload {
  userErrors: {
    message: string;
  }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postCreate = async (
  _: any,
  { post }: PostCreateArgProps,
  { userInfo, prisma }: ContextProps
): Promise<PostCreatePayload> => {
  if (!userInfo) {
    return {
      userErrors: [
        {
          message: 'Please login to create this Post'
        }
      ],
      post: null
    };
  }

  const { title, content } = post;
  if (!title || !content) {
    return {
      userErrors: [
        {
          message: 'You must povide all fields to create a Post'
        }
      ],
      post: null
    };
  }

  const createdPost = await prisma.post.create({
    data: {
      title,
      content,
      authorId: Number(userInfo.userId)
    }
  });

  return {
    userErrors: [],
    post: createdPost
  };
};
