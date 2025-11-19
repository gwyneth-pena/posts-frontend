import { config } from "@/config.env";
import { cookies } from "next/headers";
import { createClient, cacheExchange, fetchExchange, ssrExchange } from "urql";

export async function createUrqlClient() {
  const ssrCache = ssrExchange({ isClient: false });

  const cookieHeader = await cookies();
  const cookie = cookieHeader?.toString();

  const client = createClient({
    url: config.NEXT_PUBLIC_GRAPH_API!,
    fetchOptions: {
      credentials: "include",
      headers: cookie ? { cookie } : {},
    },
    exchanges: [cacheExchange, ssrCache, fetchExchange],
  });

  return { client, ssrCache };
}
