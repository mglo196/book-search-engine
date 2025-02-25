import { ApolloServer, gql } from 'apollo-server-express'; // Importing gql and ApolloServer
import express from 'express'; // Importing express
import mongoose from 'mongoose'; // Importing mongoose
import { Book, IBook } from '../models/Book'; // Importing the Book model and interface

// Connect to MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookdb');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1); // Exit the process if MongoDB connection fails
  }
};

// Define the GraphQL schema using `gql` tag
export const typeDefs = gql`
  type Book {
    _id: ID!
    title: String!
    authors: [String!]!
    description: String!
    image: String!
    link: String!
  }

  type Query {
    books: [Book!]!
    savedBooks: [Book!]!
  }

  type Mutation {
    saveBook(
      title: String!
      authors: [String!]!
      description: String!
      image: String!
      link: String!
    ): Book!
    deleteBook(id: ID!): Book
  }
`;

// Define the resolvers
export const resolvers = {
  Query: {
    // Fetch all books
    books: async (): Promise<IBook[]> => {
      try {
        return await Book.find(); // Fetch books from MongoDB
      } catch (error) {
        throw new Error('Error fetching books');
      }
    },

    // Fetch saved books (add user filtering if needed)
    savedBooks: async (): Promise<IBook[]> => {
      try {
        return await Book.find(); // Fetch saved books from MongoDB
      } catch (error) {
        throw new Error('Error fetching saved books');
      }
    },
  },

  Mutation: {
    // Save a new book
    saveBook: async (
      _: any,
      { title, authors, description, image, link }: {
        title: string;
        authors: string[];
        description: string;
        image: string;
        link: string;
      }
    ): Promise<IBook> => {
      try {
        const newBook = new Book({ title, authors, description, image, link });
        await newBook.save();
        return newBook;
      } catch (error) {
        throw new Error('Error saving the book');
      }
    },

    // Delete a book by ID
    deleteBook: async (
      _: any,
      { id }: { id: string }
    ): Promise<IBook | null> => {
      try {
        const book = await Book.findByIdAndDelete(id);
        return book;
      } catch (error) {
        throw new Error('Error deleting the book');
      }
    },
  },
};

// Create the Apollo Server instance with typeDefs and resolvers
const server = new ApolloServer({
  typeDefs,  // Use the typeDefs here
  resolvers, // Use the resolvers here
});

// Set up the Express app and apply Apollo Server as middleware
const app = express();

// Apply ApolloServer middleware to the express app
server.applyMiddleware({ app });

// Start the Express server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
});

// Ensure that the connection is established before the Apollo Server is created
connectToMongoDB();

