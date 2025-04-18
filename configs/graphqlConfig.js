import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// Initialize Apollo Client
export const graphQLClient = new ApolloClient({
    uri: 'http://localhost:8000/graphql',
    cache: new InMemoryCache({
        typePolicies: {
          Recipe: {
            keyFields: ['uid'], // This tells Apollo how to uniquely identify Recipe objects
          },
        },
      }),
});