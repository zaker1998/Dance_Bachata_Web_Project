"use server";

import { after } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase-admin";
import { sendBookingEmails } from "@/lib/email";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import type { BookingInsert } from "@/lib/types";

export interface BookingResult {
  success: boolean;
  message: string;
  fieldErrors?: Partial<
    Record<
      | "user_name"
      | "user_email"
      | "whatsapp_number"
      | "class_type"
      | "preferred_date"
      | "preferred_time"
      | "secondary_date"
      | "secondary_time",
      string
    >
  >;
}

// Today's date in Vienna as "YYYY-MM-DD" — the server may run in UTC,
// so comparing against server-local midnight would be off by up to 2 hours.
const todayInVienna = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Vienna" }).format(new Date());

const VALID_TIMES = Array.from({ length: 15 }, (_, i) =>
  String(i + 8).padStart(2, "0") + ":00"
) as [string, ...string[]]; // "08:00" … "22:00"

const dateField = (label: string) =>
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, `Please pick a valid ${label}.`)
    .refine((s) => !Number.isNaN(new Date(s + "T00:00:00").getTime()), `Please pick a valid ${label}.`)
    .refine((s) => s >= todayInVienna(), "Date must be today or later.");

const timeField = z.enum(VALID_TIMES, { message: "Please pick a valid time." });

const BookingSchema = z
  .object({
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
    whatsapp_number: z
      .string()
      .trim()
      .regex(/^\+?[0-9()\-\s]{7,20}$/, "Please enter a valid WhatsApp number."),
    class_type: z.enum(["private", "group"], {
      message: "Please pick a class type.",
    }),
    preferred_date: dateField("date"),
    preferred_time: timeField,
    secondary_date: dateField("date"),
    secondary_time: timeField,
  })
  .refine(
    (d) => !(d.preferred_date === d.secondary_date && d.preferred_time === d.secondary_time),
    { message: "Secondary slot must differ from the primary slot.", path: ["secondary_date"] }
  );

const bookingRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
});

export async function createBooking(formData: FormData): Promise<BookingResult> {
  const ip = await getClientIp();
  if (!bookingRateLimiter.check(`booking:${ip}`)) {
    return {
      success: false,
      message: "Too many booking attempts. Please try again later.",
    };
  }

  // Honeypot — checked before validation so bots get a plausible success
  // response instead of a validation error revealing the trap.
  if (formData.get("website")) {
    return { success: true, message: "Booking submitted! We'll confirm your spot shortly." };
  }

  const parsed = BookingSchema.safeParse({
    user_name: formData.get("user_name"),
    user_email: formData.get("user_email"),
    whatsapp_number: formData.get("whatsapp_number"),
    class_type: formData.get("class_type"),
    preferred_date: formData.get("preferred_date"),
    preferred_time: formData.get("preferred_time"),
    secondary_date: formData.get("secondary_date"),
    secondary_time: formData.get("secondary_time"),
  });

  if (!parsed.success) {
    const fieldErrors: NonNullable<BookingResult["fieldErrors"]> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (
        field === "user_name" ||
        field === "user_email" ||
        field === "whatsapp_number" ||
        field === "class_type" ||
        field === "preferred_date" ||
        field === "preferred_time" ||
        field === "secondary_date" ||
        field === "secondary_time"
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

  const booking: BookingInsert = {
    user_name: parsed.data.user_name,
    user_email: parsed.data.user_email,
    whatsapp_number: parsed.data.whatsapp_number,
    class_type: parsed.data.class_type,
    preferred_date: parsed.data.preferred_date,
    preferred_time: parsed.data.preferred_time,
    secondary_date: parsed.data.secondary_date,
    secondary_time: parsed.data.secondary_time,
  };

  const supabase = createAdminClient();
  const { error } = await supabase.from("bookings").insert(booking);

  if (error) {
    console.error("Supabase insert error:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }

  // Send emails after the response is sent so the function doesn't get
  // frozen mid-request on serverless platforms.
  after(async () => {
    try {
      await sendBookingEmails(booking);
    } catch (err) {
      console.error("Email send failed:", err);
    }
  });

  return {
    success: true,
    message: "Booking submitted! We'll confirm your spot shortly.",
  };
}
