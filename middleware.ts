import { NextRequest, NextResponse } from "next/server";

const REALM = 'Basic realm="Bachata Vienna Admin", charset="UTF-8"';

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": REALM },
  });
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still loop over the longer string to avoid length-based timing leak.
    const len = Math.max(a.length, b.length);
    let diff = a.length ^ b.length;
    for (let i = 0; i < len; i++) {
      diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
    }
    return diff === 0;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function middleware(req: NextRequest) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const expectedUsername = process.env.ADMIN_USERNAME ?? "admin";

  if (!expectedPassword) {
    console.error("ADMIN_PASSWORD not set — refusing admin access.");
    return new NextResponse("Admin is not configured.", { status: 500 });
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) return unauthorized();

  let decoded: string;
  try {
    decoded = atob(authHeader.slice("Basic ".length).trim());
  } catch {
    return unauthorized();
  }

  const sep = decoded.indexOf(":");
  if (sep === -1) return unauthorized();

  const username = decoded.slice(0, sep);
  const password = decoded.slice(sep + 1);

  const userOk = timingSafeEqual(username, expectedUsername);
  const passOk = timingSafeEqual(password, expectedPassword);

  if (!(userOk && passOk)) return unauthorized();

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
