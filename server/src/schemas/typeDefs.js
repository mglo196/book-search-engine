"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
// src/schemas/typeDefs.ts
const apollo_server_express_1 = require("apollo-server-express");
exports.typeDefs = (0, apollo_server_express_1.gql) `
  type Book {
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }

  type Query {
    books: [Book]
    savedBooks: [Book]
  }

  type Mutation {
    saveBook(
      title: String!, 
      authors: [String]!, 
      description: String!, 
      image: String, 
      link: String
    ): Book
    deleteBook(id: ID!): Book
  }
`;
