import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    posts: [Post!]!
  }

  type Mutation {
    postCreate(post: PostInput!): PostPayload!
    postUpdate(postId: String!, post: PostInput!): PostPayload!
    postDelete(postId: String!): PostPayload!
    userSignUp(user: UserInput!): UserPayload!
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

  # PAYLOADS:
  # =====================
  type PostPayload {
    userErrors: [UserError!]!
    post: Post
  }

  type UserPayload {
    userErrors: [UserError!]!
    user: User
  }

  type UserError {
    message: String!
  }

  # INPUTS:
  # =====================
  input PostInput {
    title: String
    content: String
  }

  input UserInput {
    email: String!
    name: String!
    password: String!
    bio: String
  }
`;
