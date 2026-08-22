import { NextRequest, NextResponse } from "next/server";
import {
  credentialsMatch,
  expectedAdminCredentials,
  parseBasicAuth,
} from "@/lib/basic-auth";

const REALM = 'Basic realm="Bachata Vienna Admin", charset="UTF-8"';

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": REALM },
  });
}

export function middleware(req: NextRequest) {
  const expected = expectedAdminCredentials();
  if (!expected) {
    console.error("ADMIN_PASSWORD not set — refusing admin access.");
    return new NextResponse("Admin is not configured.", { status: 500 });
  }

  const creds = parseBasicAuth(req.headers.get("authorization"));
  if (!credentialsMatch(creds, expected)) return unauthorized();

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
