"use server";

import { after } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { sendBookingEmails } from "@/lib/email";
import {
  createRateLimiter,
  getClientIp,
  retryAfterMinutes,
} from "@/lib/rate-limit";
import {
  BOOKING_FIELDS,
  BookingSchema,
  collectFieldErrors,
  type BookingField,
} from "@/lib/validation";
import type { BookingInsert } from "@/lib/types";

export interface BookingResult {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<BookingField, string>>;
}

const SUCCESS_MESSAGE = "Booking submitted! We'll confirm your spot shortly.";

const bookingRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
});

export async function createBooking(formData: FormData): Promise<BookingResult> {
  const ip = await getClientIp();
  const limit = bookingRateLimiter.consume(`booking:${ip}`);
  if (!limit.allowed) {
    const mins = retryAfterMinutes(limit.retryAfterMs);
    return {
      success: false,
      message: `Too many booking attempts. Please try again in ${mins} minute${mins === 1 ? "" : "s"}.`,
    };
  }

  // Honeypot — checked before validation so bots get a plausible success
  // response instead of a validation error revealing the trap.
  if (formData.get("website")) {
    return { success: true, message: SUCCESS_MESSAGE };
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
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: collectFieldErrors(parsed.error.issues, BOOKING_FIELDS),
    };
  }

  const booking: BookingInsert = parsed.data;

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

  return { success: true, message: SUCCESS_MESSAGE };
}
