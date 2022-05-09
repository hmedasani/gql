import validator from 'validator';
import JWT from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { SIGNKEY } from '../../keys';
import { ContextProps } from 'src';

interface SignupArgProps {
  user: {
    sign: {
      email: string;
      password: string;
    };
    name: string;
    bio?: string;
  };
}
interface SignupPayload {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

export const userSignup = async (
  _: any,
  { user }: SignupArgProps,
  { prisma }: ContextProps
): Promise<SignupPayload> => {
  const { sign, name, bio } = user;
  const { email, password } = sign;

  //verify are all fields provided?
  if (!email || !name || !password) {
    return {
      userErrors: [
        {
          message: 'Please provide fields email, name and password to Signup'
        }
      ],
      token: null
    };
  }

  //validate the email
  if (!validator.isEmail(email)) {
    return {
      userErrors: [
        {
          message: 'Invalid Email!'
        }
      ],
      token: null
    };
  }

  //validate the email
  if (!validator.isLength(name, { min: 3 })) {
    return {
      userErrors: [
        {
          message: 'Name must have minimum 3 characters.'
        }
      ],
      token: null
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
          message: 'User already exist'
        }
      ],
      token: null
    };
  }

  //validate the password
  if (!validator.isLength(password, { min: 8 })) {
    return {
      userErrors: [
        {
          message: 'Password must have minimum 8 characters.'
        }
      ],
      token: null
    };
  }

  //convert password into a hashed type
  const hashedPassword = await bcryptjs.hash(password, 10);

  //creating user
  const createdUser = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword
    }
  });

  //create a token
  const token = await JWT.sign({ userId: createdUser.id }, SIGNKEY, {
    expiresIn: 46000
  });

  //create profile
  if (bio) {
    await prisma.profile.create({
      data: {
        userId: createdUser.id,
        bio
      }
    });
  }

  return {
    userErrors: [],
    token
  };
};
