import { describe, expect, it } from "vitest";
import { cn, escapeHtml } from "@/lib/utils";

describe("escapeHtml", () => {
  it("neutralises a script tag", () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"
    );
  });

  it("escapes quotes so it is safe inside an attribute", () => {
    expect(escapeHtml(`" onmouseover='evil()'`)).toBe(
      "&quot; onmouseover=&#39;evil()&#39;"
    );
  });

  it("escapes ampersands first, so entities are not double-decoded", () => {
    expect(escapeHtml("&lt;")).toBe("&amp;lt;");
  });

  it("leaves ordinary text untouched", () => {
    expect(escapeHtml("Ana María — Grüße")).toBe("Ana María — Grüße");
  });
});

describe("cn", () => {
  it("merges conditional classes", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });

  it("lets a later Tailwind utility win over an earlier conflicting one", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
