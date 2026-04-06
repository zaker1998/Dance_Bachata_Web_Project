"use server";

import { supabase } from "@/lib/supabase";
import { sendBookingEmails } from "@/lib/email";
import type { BookingInsert } from "@/lib/types";

export interface BookingResult {
  success: boolean;
  message: string;
}

export async function createBooking(formData: FormData): Promise<BookingResult> {
  const raw = {
    user_name: formData.get("user_name"),
    user_email: formData.get("user_email"),
    class_type: formData.get("class_type"),
    preferred_date: formData.get("preferred_date"),
  };

  if (
    !raw.user_name ||
    !raw.user_email ||
    !raw.class_type ||
    !raw.preferred_date
  ) {
    return { success: false, message: "All fields are required." };
  }

  if (!["private", "group"].includes(raw.class_type as string)) {
    return { success: false, message: "Invalid class type." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(raw.user_email as string)) {
    return { success: false, message: "Invalid email address." };
  }

  const booking: BookingInsert = {
    user_name: raw.user_name as string,
    user_email: raw.user_email as string,
    class_type: raw.class_type as "private" | "group",
    preferred_date: raw.preferred_date as string,
  };

  const { error } = await supabase.from("bookings").insert(booking);

  if (error) {
    console.error("Supabase insert error:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }

  // Fire emails non-blocking — don't fail the booking if email sending errors
  sendBookingEmails(booking).catch((err) =>
    console.error("Email send failed:", err)
  );

  return { success: true, message: "Booking submitted! We'll confirm your spot shortly." };
}
