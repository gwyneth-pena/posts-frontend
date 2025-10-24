import { createClient, cacheExchange, fetchExchange, ssrExchange } from "urql";

export const UrqlClient = createClient({
  url: process.env.NEXT_PUBLIC_GRAPH_API || "",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [cacheExchange, fetchExchange],
});

export const createUrqlClient = (cookie?: string) => {
  const ssrCache = ssrExchange({ isClient: typeof window !== "undefined" });

  const client = createClient({
    url: process.env.NEXT_PUBLIC_GRAPH_API || "",
    fetchOptions: {
      credentials: "include",
      headers: cookie ? { cookie } : {},
    },
    exchanges: [cacheExchange, ssrCache, fetchExchange],
  });

  return { client, ssrCache };
};
