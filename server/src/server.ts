import express, { Application, Request } from 'express'; // Import Request and Response types from Express
import { ApolloServer } from 'apollo-server-express';
import { gql } from 'graphql-tag';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';
import jwt from 'jsonwebtoken';

// Setup Express application
const app: Application = express();
const PORT = process.env.PORT || 3001;

// JWT authentication function to extract user from token
const authenticateUser = (token: string) => {
  try {
    return jwt.verify(token, 'your-secret-key'); // Replace 'your-secret-key' with your secret key
  } catch (err) {
    return null; // If the token is invalid, return null
  }
};

// Define your typeDefs (GraphQL Schema)
const typeDefs = gql`
  type Query {
    hello: String
    # Add more queries here if needed
  }

  type Mutation {
    # Define your mutations here if needed
  }
`;

// Define your resolvers (Functions for handling GraphQL queries and mutations)
const resolvers = {
  Query: {
    hello: () => 'Hello, World!',
    // Other resolvers can be added here
  },
  Mutation: {
    // Define mutation resolvers here
  }
};

// Create Apollo Server with context that includes JWT authentication
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }: { req: Request }) => { // Explicitly typing `req` as `Request`
    const token = req.headers.authorization || ''; // Get the token from the Authorization header
    const user = authenticateUser(token); // Authenticate the user using the token

    return { user }; // Pass the authenticated user to GraphQL resolvers
  },
});

// Apply Apollo Server middleware to your Express app
server.applyMiddleware({ app });

// Middleware for Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes); // Handle routing (you can keep your routes logic here)

// Start the Express server and connect to the database
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`🚀 GraphQL endpoint ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
