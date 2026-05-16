-- Create the bookings table and lock down public access.
-- Public clients may only insert booking requests; all reads and status updates
-- are handled server-side with the Supabase service role.

create extension if not exists pgcrypto;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_name text not null,
  user_email text not null,
  whatsapp_number text not null,
  class_type text not null check (class_type in ('private', 'group')),
  preferred_date date not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled'))
);

alter table public.bookings enable row level security;

revoke all on table public.bookings from anon, authenticated;

grant insert (
  user_name,
  user_email,
  whatsapp_number,
  class_type,
  preferred_date
) on table public.bookings to anon;

drop policy if exists "Allow public booking submissions" on public.bookings;
create policy "Allow public booking submissions"
on public.bookings
for insert
to anon
with check (true);
