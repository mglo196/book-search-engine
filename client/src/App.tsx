import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'; // Import Apollo Client and necessary tools

import Navbar from './components/Navbar';

// Create Apollo Client instance
const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql', // Replace with your GraphQL server URL
  cache: new InMemoryCache(),
});

function App() {
  return (
    // Wrap your application with ApolloProvider to provide Apollo Client to all components
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;

