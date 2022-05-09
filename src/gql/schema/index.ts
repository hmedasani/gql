import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    posts: [Post!]!
  }

  type Mutation {
    userSignup(user: UserInput!): UserPayloadSign!
    userSignin(user: UserInputSignin!): UserPayloadSign!
    postCreate(post: PostInput!): PostPayload!
    postUpdate(postId: ID!, post: PostInput!): PostPayload!
    postDelete(postId: ID!): PostPayload!
    postPublish(postId: ID!): PostPayload!
    postUnPublish(postId: ID!): PostPayload!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    createdAt: String!
    author: User!
  }

  type User {
    id: ID!
    email: String!
    name: String!
    createdAt: String!
    posts: [Post!]!
    profile: Profile
  }

  type Profile {
    id: ID!
    bio: String!
    createdAt: String!
    user: User!
  }

  input UserInput {
    sign: UserInputSignin!
    name: String!
    bio: String
  }

  input UserInputSignin {
    email: String!
    password: String!
  }

  type UserError {
    message: String!
  }

  type UserPayloadSign {
    userErrors: [UserError!]!
    token: String
  }

  input PostInput {
    title: String
    content: String
  }

  type PostPayload {
    userErrors: [UserError!]!
    post: Post
  }
`;
