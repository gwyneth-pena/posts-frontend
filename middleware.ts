import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("session_id");
  const { pathname } = request.nextUrl;

  if (
    (sessionId && pathname.toUpperCase()?.startsWith("/LOGIN")) ||
    (sessionId && pathname.toUpperCase()?.startsWith("/REGISTER")) ||
    (sessionId && pathname.toUpperCase()?.startsWith("/FORGOT-PASSWORD"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}
