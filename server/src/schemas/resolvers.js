"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express"); // Importing gql and ApolloServer
const express_1 = __importDefault(require("express")); // Importing express
const mongoose_1 = __importDefault(require("mongoose")); // Importing mongoose
const Book_1 = require("../models/Book"); // Importing the Book model and interface
// Connect to MongoDB
const connectToMongoDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookdb');
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1); // Exit the process if MongoDB connection fails
    }
};
// Define the GraphQL schema using `gql` tag
exports.typeDefs = (0, apollo_server_express_1.gql) `
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
exports.resolvers = {
    Query: {
        // Fetch all books
        books: async () => {
            try {
                return await Book_1.Book.find(); // Fetch books from MongoDB
            }
            catch (error) {
                throw new Error('Error fetching books');
            }
        },
        // Fetch saved books (add user filtering if needed)
        savedBooks: async () => {
            try {
                return await Book_1.Book.find(); // Fetch saved books from MongoDB
            }
            catch (error) {
                throw new Error('Error fetching saved books');
            }
        },
    },
    Mutation: {
        // Save a new book
        saveBook: async (_, { title, authors, description, image, link }) => {
            try {
                const newBook = new Book_1.Book({ title, authors, description, image, link });
                await newBook.save();
                return newBook;
            }
            catch (error) {
                throw new Error('Error saving the book');
            }
        },
        // Delete a book by ID
        deleteBook: async (_, { id }) => {
            try {
                const book = await Book_1.Book.findByIdAndDelete(id);
                return book;
            }
            catch (error) {
                throw new Error('Error deleting the book');
            }
        },
    },
};
// Create the Apollo Server instance with typeDefs and resolvers
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: exports.typeDefs, // Use the typeDefs here
    resolvers: // Use the typeDefs here
    exports.resolvers, // Use the resolvers here
});
// Set up the Express app and apply Apollo Server as middleware
const app = (0, express_1.default)();
// Apply ApolloServer middleware to the express app
server.applyMiddleware({ app });
// Start the Express server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
});
// Ensure that the connection is established before the Apollo Server is created
connectToMongoDB();
