import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    members: [Member!]!
    member(id: ID!): Member
    categories: [Category!]!
    category(id: ID!): Category
    products: [Product!]!
    product(id: ID!): Product
    reviews: [Review!]!
    review(id: ID!): Review
  }

  type Member {
    id: ID!
    name: String!
    education: Int!
    height: Float!
    dob: String!
    profession: String!
    isPhd: Boolean!
    categoryId: String!
    category: Category
  }

  type Category {
    id: ID!
    name: String!
    members: [Member!]
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    quantity: Int!
    price: Float!
    image: String!
    onSale: Boolean!
  }

  type Review {
    id: ID!
    date: String!
    title: String!
    comment: String!
    rating: Float!
    productId: String!
  }
`;
