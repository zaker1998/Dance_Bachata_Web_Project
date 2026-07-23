"use server";

import { after } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { sendBookingConfirmedEmail } from "@/lib/email";
import type { BookingRow } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const UpdateBookingStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "confirmed", "cancelled"]),
});

export async function updateBookingStatus(id: string, status: BookingRow["status"]) {
  const parsed = UpdateBookingStatusSchema.safeParse({ id, status });
  if (!parsed.success) {
    throw new Error("Invalid booking status update.");
  }

  const supabase = createAdminClient();

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", parsed.data.id)
    .single();

  if (fetchError || !booking) {
    throw new Error(fetchError?.message ?? "Booking not found.");
  }

  const previousStatus = booking.status as BookingRow["status"];
  if (previousStatus === parsed.data.status) {
    return;
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/bookings");

  if (parsed.data.status === "confirmed") {
    after(async () => {
      try {
        await sendBookingConfirmedEmail(booking as BookingRow);
      } catch (err) {
        console.error("Status-confirmed email failed:", err);
      }
    });
  }
}
