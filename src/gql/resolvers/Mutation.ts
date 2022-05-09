import { userSignup } from './sub_mutations/userSignup';
import { userSignin } from './sub_mutations/userSignin';
import { postCreate } from './sub_mutations/postCreate';
import { postUpdate } from './sub_mutations/postUpdate';
import { postDelete } from './sub_mutations/postDelete';
import { postPublish } from './sub_mutations/postPublish';
import { postUnPublish } from './sub_mutations/postUnPublish';

export const Mutation = {
  userSignup,
  userSignin,
  postCreate,
  postUpdate,
  postDelete,
  postPublish,
  postUnPublish
};
