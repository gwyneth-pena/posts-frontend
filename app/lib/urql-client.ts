"use client";

import { createClient, cacheExchange, fetchExchange } from "urql";

export const UrqlClient = createClient({
  url: process.env.NEXT_PUBLIC_GRAPH_API || "",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [cacheExchange, fetchExchange],
});
