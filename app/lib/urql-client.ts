"use client";

import { createClient, cacheExchange, fetchExchange } from "urql";

export const UrqlClient = createClient({
  url: "/graphql",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [cacheExchange, fetchExchange],
});
