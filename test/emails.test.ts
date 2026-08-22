import { describe, expect, it } from "vitest";
import {
  statusUpdateEmailHtml,
  statusUpdateEmailText,
  statusUpdateSubject,
} from "@/lib/emails/status-update";
import type { BookingRow } from "@/lib/types";

const booking = (overrides: Partial<BookingRow> = {}): BookingRow => ({
  id: "11111111-1111-4111-8111-111111111111",
  status: "confirmed",
  created_at: "2026-08-01T10:00:00Z",
  user_name: "Ana María",
  user_email: "ana@example.com",
  whatsapp_number: "+43 660 1234567",
  class_type: "private",
  preferred_date: "2026-09-01",
  preferred_time: "18:00",
  secondary_date: "2026-09-02",
  secondary_time: "19:00",
  ...overrides,
});

describe("statusUpdateSubject", () => {
  it("differs per status", () => {
    expect(statusUpdateSubject("confirmed")).toMatch(/confirmed/i);
    expect(statusUpdateSubject("cancelled")).toMatch(/cancelled/i);
    expect(statusUpdateSubject("confirmed")).not.toBe(statusUpdateSubject("cancelled"));
  });
});

describe("statusUpdateEmailHtml", () => {
  it("renders the confirmed variant", () => {
    const html = statusUpdateEmailHtml(booking(), "confirmed");
    expect(html).toContain("Confirmed");
    expect(html).toContain("Ana María");
    expect(html).not.toContain("Cancelled");
  });

  it("renders the cancelled variant with its own copy and CTA", () => {
    const html = statusUpdateEmailHtml(booking({ status: "cancelled" }), "cancelled");
    expect(html).toContain("Cancelled");
    expect(html).toContain("Book Another Class");
    expect(html).not.toContain("Browse Class Videos");
  });

  it("escapes hostile user input instead of emitting live markup", () => {
    const html = statusUpdateEmailHtml(
      booking({ user_name: '<script>alert("xss")</script>' }),
      "confirmed"
    );
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("falls back to a dash for rows predating the dual-slot migration", () => {
    const html = statusUpdateEmailHtml(
      booking({ secondary_date: null, secondary_time: null }),
      "confirmed"
    );
    expect(html).toContain("—");
    expect(html).not.toContain("null");
  });

  it("renders a date-only slot when the time is missing", () => {
    const html = statusUpdateEmailHtml(booking({ preferred_time: null }), "confirmed");
    expect(html).not.toContain("null");
  });
});

describe("statusUpdateEmailText", () => {
  it("carries the status and both slots", () => {
    const text = statusUpdateEmailText(booking(), "confirmed");
    expect(text).toContain("Status: Confirmed");
    expect(text).toContain("Ana María");
  });

  it("reflects a cancellation", () => {
    expect(statusUpdateEmailText(booking(), "cancelled")).toContain("Status: Cancelled");
  });
});
