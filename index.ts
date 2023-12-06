import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { gql } from 'graphql-tag';
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

(async function(){
  const typeDefs = gql`
    type Product {
      id: String
      upc: String
      location: String
    }

    type Query {
      getAllProducts: [Product]

    }

    type Mutation {
      createProduct(upc: String, location: String): Product
    }
  `
  interface createProductInput {
    upc: string
    location: string
  }

  const resolvers = {
    Mutation: {
      createProduct: async (_parent: any, args : createProductInput) => {
        const post = prisma.product.create({
          data: {
            upc: args.upc,
            location: args.location
          }
        });

        return post;
      }
    },

    Query: {
      getAllProducts : async () => {
        return prisma.product.findMany()
      }
    }
  }

  const server = new ApolloServer({
    introspection: true,
    typeDefs,
    resolvers
  });

  const { url } = await startStandaloneServer(server, {
    listen: {port: 4000}
  });

  console.log("Server is ready at " + url)
}())