"use client";

import { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "./theme";
import { Provider } from "urql";
import { UrqlClient } from "./lib/urql-client";

export function ChakraProviderWrapper({ children }: { children: ReactNode }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}

export function UrqlProvider({ children }: { children: React.ReactNode }) {
  return <Provider value={UrqlClient}>{children}</Provider>;
}
