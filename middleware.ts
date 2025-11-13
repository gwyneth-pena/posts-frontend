import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  let loggedIn = request.cookies.get("loggedIn")?.value;
  if (loggedIn && loggedIn?.toLowerCase() !== "true") {
    loggedIn = "true";
  }

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
