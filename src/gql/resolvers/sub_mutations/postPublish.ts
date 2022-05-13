import { Post, Prisma } from '@prisma/client';
import { canUserMutateThisPost, errorPostMsg } from '../../../utils';
import { ContextProps } from 'src';

interface PostArgProps {
  postId: string;
  publish: boolean;
}

interface PostPayloadProps {
  userErrors: {
    message: string;
  }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postPublish = async (
  _: any,
  { postId, publish }: PostArgProps,
  { prisma, userInfo }: ContextProps
): Promise<PostPayloadProps> => {
  if (!userInfo) return errorPostMsg('Forbidden Credentials');

  //choose the post to Publish
  if (!postId && !publish)
    return errorPostMsg('All fields to be provided to Publish this Post!');

  //validate is this user authorised to Publish this post
  const error = await canUserMutateThisPost({
    postId: Number(postId),
    userId: Number(userInfo?.userId),
    prisma
  });

  if (error) return error;

  // Publish the post
  const publishedPost = await prisma.post.update({
    where: {
      id: Number(postId)
    },
    data: {
      published: publish
    }
  });

  return {
    userErrors: [],
    post: publishedPost
  };
};
