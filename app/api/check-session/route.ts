import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader
      .split("; ")
      .map((c) => {
        const [key, ...vals] = c.split("=");
        return [key, vals.join("=")];
      })
  );

  const sessionId = cookies["session_id"];

  if (!sessionId) {
    return NextResponse.json({ loggedIn: false });
  }

  return NextResponse.json({ loggedIn: true });
}
