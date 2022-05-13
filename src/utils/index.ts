import JWT from 'jsonwebtoken';
import { SIGNKEY } from '../gql/keys';
export * from './canUserMutateThisPost';
export * from './verifyPassword';

export const errorTokenMsg = (message: string) => {
  return {
    userErrors: [
      {
        message
      }
    ],
    token: null
  };
};

export const errorPostMsg = (message: string) => {
  return {
    userErrors: [
      {
        message
      }
    ],
    post: null
  };
};

export const getUserFromStr = async (str: string) => {
  try {
    return JWT.verify(str, SIGNKEY) as {
      userId: number;
    };
  } catch (err) {
    return null;
  }
};
