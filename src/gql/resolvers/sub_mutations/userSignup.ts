import validator from 'validator';
import bcryptjs from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { SIGNKEY } from '../../keys';
import { ContextProps } from 'src';
import { errorTokenMsg } from '../../../utils';
interface UserSignupProps {
  sign: {
    email: string;
    password: string;
  };
  name: string;
  bio?: string;
}

interface UserSignPayload {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

export const userSignup = async (
  _: any,
  { sign, name, bio }: UserSignupProps,
  { prisma }: ContextProps
): Promise<UserSignPayload> => {
  const { email, password } = sign;
  //validate are all fields filled?
  if (!email || !password || !name) {
    return errorTokenMsg('All fields are important to Signup!');
  }

  //validate is email has valid format?
  if (!validator.isEmail(email)) {
    return errorTokenMsg('Invalid Email!');
  }

  //varify is this email already registered?
  const existingUser = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (existingUser) {
    return errorTokenMsg('User already exists!.. Please signin!');
  }

  if (!validator.isLength(password, { min: 8 })) {
    return errorTokenMsg('Password should be minimum 8 characters in length');
  }

  if (!validator.isLength(name, { min: 3 })) {
    return errorTokenMsg('Name should be minimum 3 characters in length');
  }

  //hash the password
  const saltRounds = 10;
  const hashedPassword = await bcryptjs.hash(password, saltRounds);

  //signup the user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name
    }
  });

  if (bio) {
    await prisma.profile.create({
      data: {
        bio,
        userId: user.id
      }
    });
  }

  //create token
  const token = await JWT.sign({ userId: user.id }, SIGNKEY, {
    expiresIn: 46000
  });

  return {
    userErrors: [],
    token
  };
};
