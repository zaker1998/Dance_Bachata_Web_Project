export interface BookingInsert {
  user_name: string;
  user_email: string;
  whatsapp_number: string;
  class_type: "private" | "group";
  preferred_date: string;  // ISO date YYYY-MM-DD
  preferred_time: string;  // HH:MM, e.g. "14:00"
  secondary_date: string;  // ISO date YYYY-MM-DD
  secondary_time: string;  // HH:MM, e.g. "16:00"
}

export interface BookingRow extends Omit<BookingInsert, "preferred_time" | "secondary_date" | "secondary_time"> {
  id: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  // Nullable for rows that pre-date the dual-slot migration
  preferred_time: string | null;
  secondary_date: string | null;
  secondary_time: string | null;
}
