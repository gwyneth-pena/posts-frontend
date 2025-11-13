import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("session_id")?.value;
  const { pathname } = request.nextUrl;

  if (
    (sessionId && pathname.toUpperCase()?.startsWith("/LOGIN")) ||
    (sessionId && pathname.toUpperCase()?.startsWith("/REGISTER")) ||
    (sessionId && pathname.toUpperCase()?.startsWith("/FORGOT-PASSWORD"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  } else if (
    !sessionId &&
    pathname.toUpperCase().startsWith("/POSTS") &&
    pathname.toUpperCase().includes("/EDIT")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  } else if (
    !sessionId &&
    pathname.toUpperCase().startsWith("/POSTS") &&
    pathname.toUpperCase().includes("/EDIT")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  } else if (
    !sessionId &&
    pathname.toUpperCase()?.startsWith("/POSTS") &&
    pathname.toUpperCase()?.includes("/CREATE")
  ) {
    return NextResponse.redirect(
      new URL("/login?next=%2Fposts%2Fcreate", request.url)
    );
  }
  return NextResponse.next();
}
