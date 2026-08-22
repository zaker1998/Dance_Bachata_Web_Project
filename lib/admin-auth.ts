import "server-only";
import { headers } from "next/headers";
import {
  credentialsMatch,
  expectedAdminCredentials,
  parseBasicAuth,
} from "@/lib/basic-auth";

/**
 * Re-verifies Basic Auth inside admin Server Actions (defense in depth).
 *
 * The middleware only guards requests whose *URL* is under /admin, but a
 * Server Action can be invoked by POSTing its action ID to any route, which
 * would bypass the middleware entirely. Legitimate admin actions are posted
 * from /admin/bookings, so the browser attaches the same Authorization header.
 *
 * Throws rather than returning a boolean so a forgotten check at a call site
 * fails closed instead of silently granting access.
 */
export async function assertAdmin(): Promise<void> {
  const expected = expectedAdminCredentials();
  const creds = parseBasicAuth((await headers()).get("authorization"));

  if (!expected || !credentialsMatch(creds, expected)) {
    throw new Error("Unauthorized");
  }
}
