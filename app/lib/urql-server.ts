import { cookies } from "next/headers";
import { createClient, cacheExchange, fetchExchange, ssrExchange } from "urql";

export async function createUrqlClient() {
  const ssrCache = ssrExchange({ isClient: false });

  const cookieHeader = cookies().toString();

  const client = createClient({
    url: process.env.NEXT_PUBLIC_GRAPH_API!,
    fetchOptions: {
      credentials: "include",
      headers: cookieHeader ? { cookie: cookieHeader } : {},
    },
    exchanges: [cacheExchange, ssrCache, fetchExchange],
  });

  return { client, ssrCache };
}
