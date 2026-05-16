"use server";

import { createAdminClient } from "@/lib/supabase-admin";
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

  const { error } = await supabase
    .from("bookings")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/bookings");
}
