import validator from 'validator';
import JWT from 'jsonwebtoken';
import { SIGNKEY } from '../../keys';
import { ContextProps } from 'src';
import { errorTokenMsg, verifyPassword } from '../../../utils';
interface UserSigninProps {
  sign: {
    email: string;
    password: string;
  };
}

interface UserSignPayload {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

export const userSignin = async (
  _: any,
  { sign }: UserSigninProps,
  { prisma }: ContextProps
): Promise<UserSignPayload> => {
  const { email, password } = sign;
  //validate are all fields filled?
  if (!email || !password) {
    return errorTokenMsg('All fields are important to Signin!');
  }

  //validate is email has valid format?
  if (!validator.isEmail(email)) {
    return errorTokenMsg('Invalid Credentials!');
  }

  //varify is this email already registered?
  const existingUser = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!existingUser) {
    return errorTokenMsg('User does not exists.  Please Signup!');
  }

  //verify password
  const error = await verifyPassword({
    userId: Number(existingUser.id),
    password,
    prisma
  });

  if (error) return error;

  //create token
  const token = await JWT.sign({ userId: existingUser.id }, SIGNKEY, {
    expiresIn: 46000
  });

  return {
    userErrors: [],
    token
  };
};
