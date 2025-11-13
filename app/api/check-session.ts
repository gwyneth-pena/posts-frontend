import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";

  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map((c) => c.trim().split("="))
      .map(([key, ...vals]) => [key, vals.join("=")])
  );

  const sessionId = cookies["session_id"];

  const loggedIn = Boolean(sessionId);

  return NextResponse.json({ loggedIn });
}
