// Basic-Auth primitives shared by the Edge middleware and the admin Server
// Actions. Both layers must agree exactly on how credentials are parsed and
// compared, so this logic lives in one place.
//
// Keep this module free of `server-only` and Node-specific APIs — middleware
// runs on the Edge runtime and cannot import either.

/**
 * Constant-time string comparison.
 *
 * Always walks the longer of the two strings and folds the length difference
 * into the accumulator, so neither the compare time nor the result leaks where
 * the first mismatch occurred.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) {
    // charCodeAt returns NaN past the end; `|| 0` normalizes it. A real NUL
    // char also folds to 0, but the length term above already rules out a
    // false match between strings of different lengths.
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export interface BasicCredentials {
  username: string;
  password: string;
}

/**
 * Parses an `Authorization: Basic <base64>` header, or returns null if the
 * header is absent, malformed, or not Basic.
 */
export function parseBasicAuth(header: string | null): BasicCredentials | null {
  if (!header?.startsWith("Basic ")) return null;

  let decoded: string;
  try {
    // atob yields one latin1 char per byte. We advertise charset="UTF-8" in
    // the WWW-Authenticate realm, so re-decode those bytes as UTF-8 —
    // otherwise a non-ASCII password would never match.
    const binary = atob(header.slice("Basic ".length).trim());
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    decoded = new TextDecoder().decode(bytes);
  } catch {
    return null;
  }

  const sep = decoded.indexOf(":");
  if (sep === -1) return null;

  return { username: decoded.slice(0, sep), password: decoded.slice(sep + 1) };
}

/** The credentials the admin area expects, or null when it is not configured. */
export function expectedAdminCredentials(): BasicCredentials | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  // `||` rather than `??` so a blank env var still falls back to the default.
  return { username: process.env.ADMIN_USERNAME || "admin", password };
}

/** Constant-time credential check. Returns false when `creds` is null. */
export function credentialsMatch(
  creds: BasicCredentials | null,
  expected: BasicCredentials
): boolean {
  if (!creds) return false;
  // Compare both fields unconditionally — `&&` would short-circuit and leak,
  // through timing, whether the username alone was already correct.
  const userOk = timingSafeEqual(creds.username, expected.username);
  const passOk = timingSafeEqual(creds.password, expected.password);
  return userOk && passOk;
}
