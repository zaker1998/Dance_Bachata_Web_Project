import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mock = vi.hoisted(() => ({ headers: new Headers() }));
vi.mock("next/headers", () => ({ headers: async () => mock.headers }));

import {
  createRateLimiter,
  getClientIp,
  retryAfterMinutes,
} from "@/lib/rate-limit";

describe("createRateLimiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-22T10:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("allows exactly `max` hits, then blocks", () => {
    const limiter = createRateLimiter({ windowMs: 60_000, max: 3 });
    expect(limiter.check("ip")).toBe(true);
    expect(limiter.check("ip")).toBe(true);
    expect(limiter.check("ip")).toBe(true);
    expect(limiter.check("ip")).toBe(false);
  });

  it("reports remaining hits and a retry delay once blocked", () => {
    const limiter = createRateLimiter({ windowMs: 60_000, max: 2 });
    expect(limiter.consume("ip")).toMatchObject({ allowed: true, remaining: 1 });
    expect(limiter.consume("ip")).toMatchObject({ allowed: true, remaining: 0 });

    const blocked = limiter.consume("ip");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
    expect(blocked.retryAfterMs).toBeLessThanOrEqual(60_000);
  });

  it("tracks keys independently", () => {
    const limiter = createRateLimiter({ windowMs: 60_000, max: 1 });
    expect(limiter.check("a")).toBe(true);
    expect(limiter.check("a")).toBe(false);
    expect(limiter.check("b")).toBe(true);
  });

  it("starts a fresh window once the old one expires", () => {
    const limiter = createRateLimiter({ windowMs: 60_000, max: 1 });
    expect(limiter.check("ip")).toBe(true);
    expect(limiter.check("ip")).toBe(false);

    vi.advanceTimersByTime(60_001);
    expect(limiter.check("ip")).toBe(true);
  });

  it("never tracks more than maxKeys, even under a key-spray", () => {
    // The previous implementation only enforced the cap inside a 5%-chance
    // sweep, so a spray of distinct keys could grow the map without bound.
    const limiter = createRateLimiter({ windowMs: 60_000, max: 5, maxKeys: 10 });
    for (let i = 0; i < 500; i++) limiter.check(`ip-${i}`);

    // The oldest keys were evicted, so an early key gets a brand-new window
    // (proving it is no longer tracked) while recent keys are still counted.
    expect(limiter.consume("ip-0").remaining).toBe(4);
    expect(limiter.consume("ip-499").remaining).toBe(3);
  });

  it("clears all state on reset", () => {
    const limiter = createRateLimiter({ windowMs: 60_000, max: 1 });
    limiter.check("ip");
    expect(limiter.check("ip")).toBe(false);
    limiter.reset();
    expect(limiter.check("ip")).toBe(true);
  });
});

describe("retryAfterMinutes", () => {
  it("rounds up and never returns less than one minute", () => {
    expect(retryAfterMinutes(0)).toBe(1);
    expect(retryAfterMinutes(1)).toBe(1);
    expect(retryAfterMinutes(60_000)).toBe(1);
    expect(retryAfterMinutes(60_001)).toBe(2);
    expect(retryAfterMinutes(10 * 60_000)).toBe(10);
  });
});

describe("getClientIp", () => {
  afterEach(() => {
    mock.headers = new Headers();
  });

  it("prefers the platform header over the spoofable one", async () => {
    mock.headers = new Headers({
      "x-vercel-forwarded-for": "9.9.9.9",
      "x-forwarded-for": "1.2.3.4",
    });
    expect(await getClientIp()).toBe("9.9.9.9");
  });

  it("takes the first entry of x-forwarded-for as a last resort", async () => {
    mock.headers = new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
    expect(await getClientIp()).toBe("1.2.3.4");
  });

  it("falls through blank header values", async () => {
    mock.headers = new Headers({ "x-forwarded-for": "  ", "x-real-ip": "7.7.7.7" });
    expect(await getClientIp()).toBe("7.7.7.7");
  });

  it("falls back to 'unknown' when nothing identifies the caller", async () => {
    expect(await getClientIp()).toBe("unknown");
  });
});
