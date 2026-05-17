-- Lock down anon access entirely.
--
-- Previously we granted INSERT on a subset of columns to `anon` and allowed it
-- via RLS, so that browser-initiated inserts could work. With booking inserts
-- now going through a Next.js Server Action using the service-role key, the
-- anon path is no longer needed. Removing it is defense in depth: even if the
-- anon key leaked, nobody can write to the table.

revoke insert on table public.bookings from anon;

drop policy if exists "Allow public booking submissions" on public.bookings;
