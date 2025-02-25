"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Import Request and Response types from Express
const apollo_server_express_1 = require("apollo-server-express");
const graphql_tag_1 = require("graphql-tag");
const node_path_1 = __importDefault(require("node:path"));
const connection_js_1 = __importDefault(require("./config/connection.js"));
const index_js_1 = __importDefault(require("./routes/index.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Setup Express application
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// JWT authentication function to extract user from token
const authenticateUser = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, 'your-secret-key'); // Replace 'your-secret-key' with your secret key
    }
    catch (err) {
        return null; // If the token is invalid, return null
    }
};
// Define your typeDefs (GraphQL Schema)
const typeDefs = (0, graphql_tag_1.gql) `
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
const server = new apollo_server_express_1.ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers.authorization || ''; // Get the token from the Authorization header
        const user = authenticateUser(token); // Authenticate the user using the token
        return { user }; // Pass the authenticated user to GraphQL resolvers
    },
});
// Apply Apollo Server middleware to your Express app
server.applyMiddleware({ app });
// Middleware for Express
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(node_path_1.default.join(__dirname, '../client/build')));
}
app.use(index_js_1.default); // Handle routing (you can keep your routes logic here)
// Start the Express server and connect to the database
connection_js_1.default.once('open', () => {
    app.listen(PORT, () => {
        console.log(`🌍 Now listening on localhost:${PORT}`);
        console.log(`🚀 GraphQL endpoint ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
});
