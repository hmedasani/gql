import { postMutation } from './sub_mutations/post';
import { userMutation } from './sub_mutations/user';

export const Mutation = {
  ...postMutation,
  ...userMutation
};
