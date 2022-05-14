import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    me: User
    posts: [Post!]!
    profile(userId: ID!): Profile
  }

  type Mutation {
    userSignup(
      sign: InputUserSignin!
      name: String!
      bio: String!
    ): UserPayload!
    userSignin(sign: InputUserSignin!): UserPayload!
    postCreate(post: InputPost!): PostPayload!
    postUpdate(postId: String!, post: InputPost!): PostPayload!
    postDelete(postId: String!): PostPayload!
    postPublish(postId: String!, publish: Boolean!): PostPayload!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    createdBy: String!
    author: User!
  }

  type User {
    id: ID!
    email: String!
    name: String!
    posts: [Post!]!
  }

  type Profile {
    id: ID!
    bio: String!
    user: User!
  }

  input InputUserSignin {
    email: String!
    password: String!
  }

  type UserError {
    message: String!
  }

  type UserPayload {
    userErrors: [UserError!]!
    token: String
  }

  input InputPost {
    title: String
    content: String
  }

  type PostPayload {
    userErrors: [UserError!]!
    post: Post
  }
`;
