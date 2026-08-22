import { describe, expect, it, afterEach } from "vitest";
import {
  credentialsMatch,
  expectedAdminCredentials,
  parseBasicAuth,
  timingSafeEqual,
} from "@/lib/basic-auth";

const encode = (user: string, pass: string) =>
  "Basic " + Buffer.from(`${user}:${pass}`, "utf8").toString("base64");

describe("timingSafeEqual", () => {
  it("matches identical strings", () => {
    expect(timingSafeEqual("hunter2", "hunter2")).toBe(true);
    expect(timingSafeEqual("", "")).toBe(true);
  });

  it("rejects differing strings", () => {
    expect(timingSafeEqual("hunter2", "hunter3")).toBe(false);
    expect(timingSafeEqual("abc", "abd")).toBe(false);
  });

  it("rejects strings of differing length", () => {
    expect(timingSafeEqual("abc", "abcd")).toBe(false);
    expect(timingSafeEqual("", "a")).toBe(false);
    // A NUL char folds to the same 0 as an out-of-range index, so the length
    // term is what has to rule this out.
    expect(timingSafeEqual("abc", "abc\0")).toBe(false);
  });
});

describe("parseBasicAuth", () => {
  it("extracts username and password", () => {
    expect(parseBasicAuth(encode("admin", "s3cret"))).toEqual({
      username: "admin",
      password: "s3cret",
    });
  });

  it("keeps colons in the password", () => {
    expect(parseBasicAuth(encode("admin", "a:b:c"))?.password).toBe("a:b:c");
  });

  it("round-trips non-ASCII passwords as UTF-8", () => {
    // atob yields latin1 bytes; without the UTF-8 re-decode this would come
    // back as mojibake and never match the configured password.
    expect(parseBasicAuth(encode("admin", "paßwörd–ü"))?.password).toBe("paßwörd–ü");
  });

  it("returns null for absent, non-Basic, or malformed headers", () => {
    expect(parseBasicAuth(null)).toBeNull();
    expect(parseBasicAuth("Bearer abc")).toBeNull();
    expect(parseBasicAuth("Basic !!!not-base64!!!")).toBeNull();
    // Valid base64 but no ":" separator.
    expect(parseBasicAuth("Basic " + Buffer.from("nocolon").toString("base64"))).toBeNull();
  });
});

describe("credentialsMatch", () => {
  const expected = { username: "admin", password: "s3cret" };

  it("accepts exactly correct credentials", () => {
    expect(credentialsMatch({ username: "admin", password: "s3cret" }, expected)).toBe(true);
  });

  it("rejects a wrong password, wrong username, or null", () => {
    expect(credentialsMatch({ username: "admin", password: "nope" }, expected)).toBe(false);
    expect(credentialsMatch({ username: "root", password: "s3cret" }, expected)).toBe(false);
    expect(credentialsMatch(null, expected)).toBe(false);
  });
});

describe("expectedAdminCredentials", () => {
  const saved = { ...process.env };
  afterEach(() => {
    process.env = { ...saved };
  });

  it("returns null when no password is configured — admin fails closed", () => {
    delete process.env.ADMIN_PASSWORD;
    expect(expectedAdminCredentials()).toBeNull();
  });

  it("defaults the username, including when the env var is blank", () => {
    process.env.ADMIN_PASSWORD = "s3cret12";
    delete process.env.ADMIN_USERNAME;
    expect(expectedAdminCredentials()).toEqual({ username: "admin", password: "s3cret12" });

    process.env.ADMIN_USERNAME = "";
    expect(expectedAdminCredentials()?.username).toBe("admin");
  });

  it("honours a configured username", () => {
    process.env.ADMIN_PASSWORD = "s3cret12";
    process.env.ADMIN_USERNAME = "marat";
    expect(expectedAdminCredentials()?.username).toBe("marat");
  });
});
