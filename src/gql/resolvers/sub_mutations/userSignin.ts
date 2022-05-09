import validator from 'validator';
import JWT from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { SIGNKEY } from '../../keys';
import { ContextProps } from 'src';

interface SigninArgProps {
  user: {
    email: string;
    password: string;
  };
}
interface SigninPayload {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

export const userSignin = async (
  _: any,
  { user }: SigninArgProps,
  { prisma }: ContextProps
): Promise<SigninPayload> => {
  const { email, password } = user;

  //verify are all fields provided?
  if (!email || !password) {
    return {
      userErrors: [
        {
          message: 'Please provide fields email, password to Signin'
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

  const existingUser = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!existingUser) {
    return {
      userErrors: [
        {
          message: 'Invalid Credentials!'
        }
      ],
      token: null
    };
  }

  //validate Password
  const isPasswordMatched = await bcryptjs.compare(
    password,
    existingUser.password
  );

  //validate the email
  if (!isPasswordMatched) {
    return {
      userErrors: [
        {
          message: 'Invalid Credentials!'
        }
      ],
      token: null
    };
  }

  //create a token
  const token = await JWT.sign({ userId: existingUser.id }, SIGNKEY, {
    expiresIn: 46000
  });

  return {
    userErrors: [],
    token
  };
};
