-- Add WhatsApp number column to bookings.
--
-- Nullable because existing rows predate this field; new submissions are
-- validated as required at the application layer (Zod in app/book/actions.ts).
--
-- On a freshly migrated DB this is a no-op (the create_bookings migration
-- already includes the column) — it's here for environments that were
-- created before that column was added.

alter table public.bookings
  add column if not exists whatsapp_number text;

-- Make sure the public.bookings INSERT grant to `anon` covers whatsapp_number
-- on any DB where the column was added after the original grant. This is
-- superseded by the 20260516 migration that revokes anon access entirely.
do $$
begin
  if exists (
    select 1
    from information_schema.role_column_grants
    where grantee = 'anon'
      and table_schema = 'public'
      and table_name = 'bookings'
      and privilege_type = 'INSERT'
  ) then
    execute 'grant insert (whatsapp_number) on table public.bookings to anon';
  end if;
end$$;
