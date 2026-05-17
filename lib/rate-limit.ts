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
  /** Maximum number of distinct keys to track (LRU-ish cap). */
  maxKeys?: number;
}

export interface RateLimiter {
  /** Returns true if the request is allowed, false if it should be rejected. */
  check: (key: string) => boolean;
}

export function createRateLimiter(opts: RateLimitOptions): RateLimiter {
  const { windowMs, max, maxKeys = 10_000 } = opts;
  const store = new Map<string, Entry>();

  function sweep(now: number) {
    // Drop expired entries; bound the map size as a sanity check.
    for (const [k, v] of store) {
      if (v.reset < now) store.delete(k);
    }
    if (store.size > maxKeys) {
      // Map iteration order is insertion order — drop the oldest.
      const drop = store.size - maxKeys;
      let i = 0;
      for (const k of store.keys()) {
        if (i++ >= drop) break;
        store.delete(k);
      }
    }
  }

  return {
    check(key: string) {
      const now = Date.now();
      // Sweep occasionally; cheap enough at this volume.
      if (store.size > 64 && Math.random() < 0.05) sweep(now);

      const entry = store.get(key);
      if (!entry || entry.reset < now) {
        store.set(key, { count: 1, reset: now + windowMs });
        return true;
      }
      if (entry.count >= max) return false;
      entry.count += 1;
      return true;
    },
  };
}

/** Best-effort client IP from forwarded headers. */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for") ?? "";
  return fwd.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}
