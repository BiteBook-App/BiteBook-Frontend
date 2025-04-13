import { Slot, Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AuthProvider } from "@/configs/authProvider";
import { ApolloProvider } from '@apollo/client';
import {graphQLClient} from "@/configs/graphqlConfig";

export default function RootLayout() {
  return (
      <ApolloProvider client={graphQLClient}>
          <AuthProvider>
              <Slot />
          </AuthProvider>
      </ApolloProvider>
  );
}
