import { Post, Prisma } from '@prisma/client';
import { ContextProps } from 'src';

interface PostArgProps {
  post: {
    title: string;
    content: string;
  };
}

interface PostProps {
  userErrors: { message: string }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postMutation = {
  postCreate: async (
    _: any,
    { post }: PostArgProps,
    { prisma }: ContextProps
  ): Promise<PostProps> => {
    const { title, content } = post;

    if (!title && !content) {
      return {
        userErrors: [
          {
            message: 'You must provide a title and content to create a Post'
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
    { postId, post }: { postId: string; post: PostArgProps['post'] },
    { prisma }: ContextProps
  ): Promise<PostProps> => {
    const { title, content } = post;
    //check is chosen postId exist?
    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(postId)
      }
    });

    if (!existingPost) {
      return {
        userErrors: [
          {
            message: 'Chosen post does not exist!'
          }
        ],
        post: null
      };
    }

    let data: { title?: string; content?: string } = {
      title,
      content
    };

    if (!title) delete data.title;
    if (!content) delete data.content;

    const updatedPost = await prisma.post.update({
      where: {
        id: Number(postId)
      },
      data
    });

    return {
      userErrors: [],
      post: updatedPost
    };
  },
  postDelete: async (
    _: any,
    { postId }: { postId: string },
    { prisma }: ContextProps
  ): Promise<PostProps> => {
    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(postId)
      }
    });

    if (!existingPost) {
      return {
        userErrors: [
          {
            message: 'Chosen post does not exist!'
          }
        ],
        post: null
      };
    }

    await prisma.post.delete({
      where: {
        id: Number(postId)
      }
    });

    return {
      userErrors: [],
      post: existingPost
    };
  }
};
