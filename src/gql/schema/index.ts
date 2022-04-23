import { gql } from 'apollo-server';

// schema as typedefs
export const typeDefs = gql`
  type Query {
    hello: String!
  }
`;
