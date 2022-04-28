import { ApolloServer } from 'apollo-server';
import { typeDefs } from './gql/schema';
import categoriesArr from '../data/categories';
import membersArr from '../data/members';
import productsArr from '../data/products';
import reviewsArr from '../data/reviews';

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      members: () => membersArr,
      member: (parent, { id }, context) => {
        return membersArr.find((each) => each.id === id);
      },
      categories: () => categoriesArr,
      category: (parent, { id }, context) => {
        return categoriesArr.find((each) => each.id === id);
      },
      products: () => productsArr,
      product: (parent, { id }, context) => {
        return productsArr.find((each) => each.id === id);
      },
      reviews: () => reviewsArr,
      review: (parent, { id }, context) => {
        return reviewsArr.find((each) => each.id === id);
      }
    },
    Category: {
      members: ({ id }, args, context) => {
        return membersArr.filter((each) => each.categoryId === id);
      }
    },
    Member: {
      category: ({ categoryId }, args, context) => {
        return categoriesArr.find((each) => each.id === categoryId);
      }
    }
  },
  context: {
    categoriesArr,
    membersArr,
    productsArr,
    reviewsArr
  }
});

server.listen().then(({ url }) => {
  console.log(`Server is listening at ${url}`);
});
