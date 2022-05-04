import validator from 'validator';
import bcrypt, { genSalt } from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { JWT_SIGNATURE } from '../../keys';
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
  token: string | null;
  // user: User | Prisma.Prisma__UserClient<User> | null;
}

export const userMutation = {
  userSignUp: async (
    _: any,
    { user }: UserArgProps,
    { prisma }: ContextProps
  ): Promise<UserProps> => {
    const { email, name, password, bio } = user;

    if (!email && !name && !password && !bio) {
      return {
        userErrors: [
          {
            message:
              'Please fill the fields of email, name, password & bio to signup'
          }
        ],
        token: null
        // user: null
      };
    }

    if (!validator.isEmail(email)) {
      return {
        userErrors: [
          {
            message: 'Please provide valid email'
          }
        ],
        token: null
        // user: null
      };
    }

    if (!validator.isLength(password, { min: 8 })) {
      return {
        userErrors: [
          {
            message: 'Please provide minimum 8 characters for Password!'
          }
        ],
        token: null
        // user: null
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
        token: null
        // user: null
      };
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    const signedupUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    });

    await prisma.profile.create({
      data: {
        bio,
        userId: signedupUser.id
      }
    });

    //JWT:
    const token = await JWT.sign(
      {
        userId: signedupUser.id
      },
      JWT_SIGNATURE,
      {
        expiresIn: 43200
      }
    );

    return {
      userErrors: [],
      token
      // user: signedupUser
    };
  }
};
