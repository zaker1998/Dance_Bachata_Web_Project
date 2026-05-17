-- Add time preferences and a secondary slot to bookings.
-- Columns are nullable so existing rows are unaffected; the application-level
-- schema enforces that new submissions always supply all four values.

alter table public.bookings
  add column if not exists preferred_time text,
  add column if not exists secondary_date  date,
  add column if not exists secondary_time  text;
