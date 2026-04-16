"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { sendBookingEmails } from "@/lib/email";
import type { BookingInsert } from "@/lib/types";

export interface BookingResult {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<"user_name" | "user_email" | "class_type" | "preferred_date", string>>;
}

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const BookingSchema = z.object({
  user_name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(80, "Name is too long."),
  user_email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email.")
    .max(120),
  class_type: z.enum(["private", "group"], {
    message: "Please pick a class type.",
  }),
  preferred_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please pick a valid date.")
    .refine((s) => {
      const d = new Date(s + "T00:00:00");
      return !Number.isNaN(d.getTime()) && d >= today();
    }, "Date must be today or later."),
  // Honeypot — must stay empty
  website: z.string().max(0).optional().or(z.literal("")),
});

// Simple in-memory rate limit (per-process). For production, swap for Upstash/Redis.
const rateLimitStore = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5;

function rateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || entry.reset < now) {
    rateLimitStore.set(key, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

async function getClientKey(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for") ?? "";
  const ip = fwd.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return `booking:${ip}`;
}

export async function createBooking(formData: FormData): Promise<BookingResult> {
  const key = await getClientKey();
  if (!rateLimit(key)) {
    return {
      success: false,
      message: "Too many booking attempts. Please try again later.",
    };
  }

  const parsed = BookingSchema.safeParse({
    user_name: formData.get("user_name"),
    user_email: formData.get("user_email"),
    class_type: formData.get("class_type"),
    preferred_date: formData.get("preferred_date"),
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: BookingResult["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (
        field === "user_name" ||
        field === "user_email" ||
        field === "class_type" ||
        field === "preferred_date"
      ) {
        fieldErrors[field] ??= issue.message;
      }
    }
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  // Silently accept if honeypot is tripped — don't tell the bot anything useful.
  if (parsed.data.website) {
    return { success: true, message: "Booking submitted! We'll confirm your spot shortly." };
  }

  const booking: BookingInsert = {
    user_name: parsed.data.user_name,
    user_email: parsed.data.user_email,
    class_type: parsed.data.class_type,
    preferred_date: parsed.data.preferred_date,
  };

  const { error } = await supabase.from("bookings").insert(booking);

  if (error) {
    console.error("Supabase insert error:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }

  sendBookingEmails(booking).catch((err) =>
    console.error("Email send failed:", err)
  );

  return {
    success: true,
    message: "Booking submitted! We'll confirm your spot shortly.",
  };
}
