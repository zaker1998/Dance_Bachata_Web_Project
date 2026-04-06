export interface BookingInsert {
  user_name: string;
  user_email: string;
  class_type: "private" | "group";
  preferred_date: string; // ISO date string YYYY-MM-DD
}

export interface BookingRow extends BookingInsert {
  id: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}
