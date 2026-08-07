import "server-only";
import { headers } from "next/headers";

function timingSafeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

/**
 * Re-verifies the Basic Auth credentials inside admin server actions.
 *
 * The middleware only guards requests whose *URL* is under /admin, but a
 * server action can be invoked by POSTing its action ID to any route, which
 * would bypass the middleware entirely. Legitimate admin actions are posted
 * to /admin/bookings, so the browser attaches the same Authorization header.
 */
export async function verifyAdminRequest(): Promise<boolean> {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const expectedUsername = process.env.ADMIN_USERNAME ?? "admin";
  if (!expectedPassword) return false;

  const authHeader = (await headers()).get("authorization");
  if (!authHeader?.startsWith("Basic ")) return false;

  let decoded: string;
  try {
    decoded = atob(authHeader.slice("Basic ".length).trim());
  } catch {
    return false;
  }

  const sep = decoded.indexOf(":");
  if (sep === -1) return false;

  const userOk = timingSafeEqual(decoded.slice(0, sep), expectedUsername);
  const passOk = timingSafeEqual(decoded.slice(sep + 1), expectedPassword);
  return userOk && passOk;
}
