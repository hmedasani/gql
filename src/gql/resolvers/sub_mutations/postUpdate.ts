import { Post, Prisma } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { canUserMutateThisPost, errorPostMsg } from '../../../utils';
import { ContextProps } from 'src';

interface PostArgProps {
  postId: string;
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

export const postUpdate = async (
  _: any,
  { postId, post }: PostArgProps,
  { prisma, userInfo }: ContextProps
): Promise<PostPayloadProps> => {
  if (!userInfo) return errorPostMsg('Forbidden Credentials');

  const { title, content } = post;
  //choose the post to update
  if (!postId) return errorPostMsg('Choose the Post to update!');

  //validate are all fields filled?
  if (!title && !content)
    return errorPostMsg(
      'Title OR content, one must be provided to udpate this Post!'
    );

  //validate is this user authorised to update this post
  const error = await canUserMutateThisPost({
    postId: Number(postId),
    userId: Number(userInfo?.userId),
    prisma
  });

  if (error) return error;

  //what to update
  const toBeUpdatedObj: {
    title?: string;
    content?: string;
  } = {
    title,
    content
  };

  if (!title) delete toBeUpdatedObj?.title;
  if (!content) delete toBeUpdatedObj?.content;

  // Update the post
  const updatedPost = await prisma.post.update({
    where: {
      id: Number(postId)
    },
    data: toBeUpdatedObj
  });

  return {
    userErrors: [],
    post: updatedPost
  };
};
