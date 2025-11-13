"use client";

import { createContext, ReactNode, useContext } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "./theme";
import { Provider, useQuery } from "urql";
import { UrqlClient } from "./lib/urql-client";
import { USER_ME_QUERY } from "./graphql/users.query";

export function ChakraProviderWrapper({ children }: { children: ReactNode }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}

export function UrqlProvider({ children }: { children: React.ReactNode }) {
  return <Provider value={UrqlClient}>{children}</Provider>;
}

const UserContext = createContext<any>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [{ data }] = useQuery({
    query: USER_ME_QUERY,
    requestPolicy: "network-only",
  });

  const user = data?.userMe ?? null;

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
