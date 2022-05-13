import { Post, Prisma } from '@prisma/client';
import { canUserMutateThisPost, errorPostMsg } from '../../../utils';
import { ContextProps } from 'src';

interface PostArgProps {
  postId: string;
}

interface PostPayloadProps {
  userErrors: {
    message: string;
  }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postDelete = async (
  _: any,
  { postId }: PostArgProps,
  { prisma, userInfo }: ContextProps
): Promise<PostPayloadProps> => {
  if (!userInfo) return errorPostMsg('Forbidden Credentials');

  //choose the post to Delete
  if (!postId) return errorPostMsg('Choose the Post to Delete!');

  //validate is this user authorised to Delete this post
  const error = await canUserMutateThisPost({
    postId: Number(postId),
    userId: Number(userInfo?.userId),
    prisma
  });

  if (error) return error;

  // Delete the post
  const deletedPost = await prisma.post.delete({
    where: {
      id: Number(postId)
    }
  });

  return {
    userErrors: [],
    post: deletedPost
  };
};
