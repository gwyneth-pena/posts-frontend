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

  let loggedIn = false;

  try {
    const apiRes = await fetch(`${request.nextUrl.origin}/api/check-session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    if (apiRes.ok) {
      const contentType = apiRes.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await apiRes.json();
        loggedIn = Boolean(data?.loggedIn);
      }
    }
  } catch (err) {
    console.error("Middleware error checking session:", err);
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
