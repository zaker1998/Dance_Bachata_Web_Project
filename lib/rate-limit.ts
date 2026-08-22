import "server-only";
import { headers } from "next/headers";

// Simple in-memory rate limiter scoped to one server process.
//
// IMPORTANT: this only protects against casual abuse from a single instance.
// On serverless (Vercel) each container has its own Map, so determined
// attackers can bypass it by spreading requests across cold starts. For
// production strength swap this for Upstash Ratelimit / Vercel KV.

type Entry = { count: number; reset: number };

interface RateLimitOptions {
  /** Window length in ms. */
  windowMs: number;
  /** Maximum allowed hits per window. */
  max: number;
  /** Hard cap on distinct keys tracked at once. */
  maxKeys?: number;
}

export interface RateLimitResult {
  /** False if the caller should be rejected. */
  allowed: boolean;
  /** Hits left in the current window. */
  remaining: number;
  /** How long until the window resets; 0 when the request was allowed. */
  retryAfterMs: number;
}

export interface RateLimiter {
  /** Records a hit and reports whether it is within the limit. */
  consume: (key: string) => RateLimitResult;
  /** Convenience wrapper: true if the request is allowed. */
  check: (key: string) => boolean;
  /** Drops all tracked keys. Intended for tests. */
  reset: () => void;
}

export function createRateLimiter(opts: RateLimitOptions): RateLimiter {
  const { windowMs, max, maxKeys = 10_000 } = opts;
  const store = new Map<string, Entry>();

  function makeRoom(now: number) {
    if (store.size < maxKeys) return;

    // Expired entries first — they cost nothing to lose.
    for (const [k, v] of store) {
      if (v.reset <= now) store.delete(k);
    }

    // Still full: evict oldest-first (Map iterates in insertion order). This
    // runs on every insert past the cap rather than on a random sample, so a
    // key-spray attack can no longer grow the map without bound.
    while (store.size >= maxKeys) {
      const oldest = store.keys().next();
      if (oldest.done) break;
      store.delete(oldest.value);
    }
  }

  function consume(key: string): RateLimitResult {
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || entry.reset <= now) {
      // Only a genuinely new key can grow the map, so bound it here.
      if (!entry) makeRoom(now);
      store.set(key, { count: 1, reset: now + windowMs });
      return { allowed: true, remaining: max - 1, retryAfterMs: 0 };
    }

    if (entry.count >= max) {
      return { allowed: false, remaining: 0, retryAfterMs: entry.reset - now };
    }

    entry.count += 1;
    return { allowed: true, remaining: max - entry.count, retryAfterMs: 0 };
  }

  return {
    consume,
    check: (key) => consume(key).allowed,
    reset: () => store.clear(),
  };
}

/** Rounds a retry delay up to whole minutes for user-facing copy. */
export function retryAfterMinutes(ms: number): number {
  return Math.max(1, Math.ceil(ms / 60_000));
}

/**
 * Best-effort client IP.
 *
 * `x-forwarded-for` is client-spoofable unless a trusted proxy overwrites it,
 * so prefer the platform-controlled headers when they are present.
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();

  const candidates = [
    h.get("x-vercel-forwarded-for"),
    h.get("x-real-ip"),
    h.get("x-forwarded-for")?.split(",")[0],
  ];

  for (const c of candidates) {
    const ip = c?.trim();
    if (ip) return ip;
  }
  return "unknown";
}
