// src/schemas/typeDefs.ts
import { gql } from 'apollo-server-express';

export const typeDefs = gql`
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
