import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { USER_ME_QUERY } from "./app/graphql/users.query";
import { cacheExchange, createClient, fetchExchange } from "urql";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }
  const url = new URL("/api/check-session", request.url); // builds full absolute URL
  const res = await fetch(url.toString(), {
    credentials: "include",
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  let loggedIn = false;
  const cookieHeader = request.headers.get("cookie") || "";
  const client = createClient({
    url: process.env.NEXT_PUBLIC_GRAPH_API!,
    fetchOptions: {
      credentials: "include",
      headers: {
        cookie: cookieHeader,
      },
    },
    exchanges: [cacheExchange, fetchExchange],
  });
  const user = await client
    .query(USER_ME_QUERY, {
      requestPolicy: "cache-and-network",
    })
    .toPromise();

  loggedIn = user?.data?.userMe !== null;
  console.log(loggedIn, user, cookieHeader, request.headers);
  if (
    (loggedIn && pathname.toUpperCase()?.startsWith("/LOGIN")) ||
    (loggedIn && pathname.toUpperCase()?.startsWith("/REGISTER")) ||
    (loggedIn && pathname.toUpperCase()?.startsWith("/FORGOT-PASSWORD"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  } else if (
    !loggedIn &&
    pathname.toUpperCase().startsWith("/POSTS") &&
    pathname.toUpperCase().includes("/EDIT")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  } else if (
    !loggedIn &&
    pathname.toUpperCase().startsWith("/POSTS") &&
    pathname.toUpperCase().includes("/EDIT")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  } else if (
    !loggedIn &&
    pathname.toUpperCase()?.startsWith("/POSTS") &&
    pathname.toUpperCase()?.includes("/CREATE")
  ) {
    return NextResponse.redirect(
      new URL("/login?next=%2Fposts%2Fcreate", request.url)
    );
  }

  return NextResponse.next();
}
