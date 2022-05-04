import validator from 'validator';
import { Prisma, User } from '@prisma/client';
import { ContextProps } from 'src';

interface UserArgProps {
  user: {
    email: string;
    name: string;
    password: string;
    bio: string;
  };
}

interface UserProps {
  userErrors: { message: string }[];
  user: User | Prisma.Prisma__UserClient<User> | null;
}

export const userMutation = {
  userSignUp: async (
    _: any,
    { user }: UserArgProps,
    { prisma }: ContextProps
  ): Promise<UserProps> => {
    const { email, name, password } = user;

    if (!email && !name && !password) {
      return {
        userErrors: [
          {
            message:
              'Please fill the fields of email, name and password to signup'
          }
        ],
        user: null
      };
    }

    if (!validator.isEmail(email)) {
      return {
        userErrors: [
          {
            message: 'Please provide valid email'
          }
        ],
        user: null
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (existingUser) {
      return {
        userErrors: [
          {
            message: 'This User is already registered!'
          }
        ],
        user: null
      };
    }

    const signedupUser = await prisma.user.create({
      data: {
        email,
        name,
        password
      }
    });

    return {
      userErrors: [],
      user: signedupUser
    };
  }
};
