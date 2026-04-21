-- Add WhatsApp number column to bookings
-- Nullable because existing rows predate this field; new submissions are
-- validated as required at the application layer (Zod in app/book/actions.ts).

alter table public.bookings
  add column if not exists whatsapp_number text;
