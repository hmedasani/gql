import { Post, prisma, Prisma } from '@prisma/client';
import { Context } from '../../../src';

interface PostProps {
  post: {
    title?: string;
    content?: string;
  };
}

interface PostPayloadProps {
  userErrors: {
    message: string;
  }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const Mutation = {
  postCreate: async (
    parent: any,
    { post }: PostProps,
    { prisma }: Context
  ): Promise<PostPayloadProps> => {
    const { title, content } = post;
    if (!title || !content) {
      return {
        userErrors: [
          {
            message: 'You must provide TITLE, CONTENT to create a post'
          }
        ],
        post: null
      };
    }

    return {
      userErrors: [],
      post: prisma.post.create({
        data: {
          title,
          content,
          authorId: 1
        }
      })
    };
  },
  postUpdate: async (
    _: any,
    { post, postId }: { postId: string; post: PostProps['post'] },
    { prisma }: Context
  ): Promise<PostPayloadProps> => {
    const { title, content } = post;
    if (!title && !content) {
      return {
        userErrors: [
          {
            message: 'Need to have at least one field to update'
          }
        ],
        post: null
      };
    }

    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(postId)
      }
    });
    if (!existingPost) {
      return {
        userErrors: [
          {
            message: 'Post does not exist'
          }
        ],
        post: null
      };
    }

    interface PayloadToUpdateProps {
      title?: string;
      content?: string;
    }

    let payloadToUpdate: PayloadToUpdateProps = {
      title,
      content
    };

    if (!title) delete payloadToUpdate.title;
    if (!content) delete payloadToUpdate.content;

    return {
      userErrors: [],
      post: prisma.post.update({
        data: {
          ...payloadToUpdate
        },
        where: {
          id: Number(postId)
        }
      })
    };
  }
};
