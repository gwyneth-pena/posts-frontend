import { console } from "inspector";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  console.log(cookieHeader);
  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map((c) => c.trim().split("="))
      .map(([key, ...vals]) => [key, vals.join("=")])
  );

  console.log(cookies);
  const sessionId = cookies["session_id"];

  const loggedIn = Boolean(sessionId);
  console.log(loggedIn);
  return NextResponse.json({ loggedIn });
}
