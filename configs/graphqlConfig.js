import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// Initialize Apollo Client
export const graphQLClient = new ApolloClient({
    uri: 'https://bitebook-app.onrender.com/graphql',
    cache: new InMemoryCache({
        typePolicies: {
          Recipe: {
            keyFields: ['uid'], // This tells Apollo how to uniquely identify Recipe objects
          },
        },
      }),
});