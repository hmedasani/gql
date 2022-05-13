import { postCreate } from './sub_mutations/postCreate';
import { postUpdate } from './sub_mutations/postUpdate';
import { postDelete } from './sub_mutations/postDelete';
import { userSignin } from './sub_mutations/userSignin';
import { userSignup } from './sub_mutations/userSignup';

export const Mutation = {
  userSignup,
  userSignin,
  postCreate,
  postUpdate,
  postDelete
};
