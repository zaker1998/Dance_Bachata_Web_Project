"use server";

import { after } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { assertAdmin } from "@/lib/admin-auth";
import { sendStatusUpdateEmail } from "@/lib/email";
import type { BookingRow } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const UpdateBookingStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "confirmed", "cancelled"]),
});

export async function updateBookingStatus(id: string, status: BookingRow["status"]) {
  await assertAdmin();

  const parsed = UpdateBookingStatusSchema.safeParse({ id, status });
  if (!parsed.success) {
    throw new Error("Invalid booking status update.");
  }

  const supabase = createAdminClient();

  const { data: existing, error: fetchError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", parsed.data.id)
    .single();

  if (fetchError || !existing) {
    throw new Error(fetchError?.message ?? "Booking not found.");
  }

  const previousStatus = existing.status as BookingRow["status"];
  if (previousStatus === parsed.data.status) {
    return;
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/bookings");

  const nextStatus = parsed.data.status;
  if (nextStatus === "confirmed" || nextStatus === "cancelled") {
    // `existing` was read before the update, so its `status` is still the old
    // one — overlay the new status so the email reflects what was just saved.
    const booking = { ...existing, status: nextStatus } as BookingRow;
    after(async () => {
      try {
        await sendStatusUpdateEmail(booking, nextStatus);
      } catch (err) {
        console.error(`Status-${nextStatus} email failed:`, err);
      }
    });
  }
}
