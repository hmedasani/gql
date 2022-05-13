import { Post, Prisma } from '@prisma/client';
import { errorPostMsg } from '../../../utils';
import { ContextProps } from 'src';

interface PostArgProps {
  post: {
    title: string;
    content: string;
  };
}

interface PostPayloadProps {
  userErrors: {
    message: string;
  }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postCreate = async (
  _: any,
  { post }: PostArgProps,
  { prisma, userInfo }: ContextProps
): Promise<PostPayloadProps> => {
  if (!userInfo) return errorPostMsg('Please Login to create the Post!');

  const { title, content } = post;
  //validate are all fields filled?
  if (!title || !content)
    return errorPostMsg('All fields are important to Create a Post!');

  //create the post
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
