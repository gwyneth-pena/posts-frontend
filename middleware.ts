import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createUrqlClient } from "./app/lib/urql-server";
import { USER_ME_QUERY } from "./app/graphql/users.query";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  let loggedIn = false;

  const { client }: any = await createUrqlClient();
  const user = await client
    .query(USER_ME_QUERY, {
      requestPolicy: "cache-and-network",
    })
    .toPromise();

  loggedIn = user?.data?.userMe !== null;

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
