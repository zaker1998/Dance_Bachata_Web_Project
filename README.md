# Bachata Vienna

Next.js website for Bachata dance classes in Vienna — video library, booking system, admin dashboard, and a Resend-powered contact form.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create `.env.local` at the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # server-only — never expose

# Admin (HTTP Basic Auth for /admin/*)
ADMIN_USERNAME=admin            # optional, defaults to "admin"
ADMIN_PASSWORD=<min 8 chars>

# Resend
RESEND_API_KEY=...
INSTRUCTOR_EMAIL=you@example.com
CONTACT_EMAIL=you@example.com   # optional — falls back to INSTRUCTOR_EMAIL

# Public site URL (used in sitemap, emails, OG metadata)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Env vars are validated with Zod on boot (`lib/env.ts`), so missing/invalid values fail fast with a clear error.

## Tech Stack

- **Next.js 15** (App Router, TypeScript, Server Actions)
- **Tailwind CSS v4**
- **Supabase** (Postgres — bookings)
- **Resend** (transactional email)
- **Framer Motion** (animations)
- **Zod** (server-side input + env validation)

## Project Structure

```
app/
  admin/bookings/    # protected by middleware basic auth
  book/              # booking form + server action
  contact/           # contact form + server action
  videos/            # hardcoded video library (move to DB later)
  layout.tsx         # root layout + LocalBusiness JSON-LD
  sitemap.ts         # Next metadata-route sitemap
  robots.ts          # disallows /admin and /api
components/
lib/
  env.ts             # zod-validated env access
  supabase.ts        # anon client (for inserts)
  supabase-admin.ts  # service-role client (admin only, server-only)
  email.ts           # Resend helpers for booking emails
middleware.ts        # timing-safe Basic Auth for /admin/*
```

## Supabase Schema

The `bookings` table is expected to have:

- `id uuid default gen_random_uuid() primary key`
- `created_at timestamptz default now()`
- `user_name text`, `user_email text`
- `class_type text check (class_type in ('private','group'))`
- `preferred_date date`
- `status text default 'pending' check (status in ('pending','confirmed','cancelled'))`

RLS should allow anon `INSERT` only on `(user_name, user_email, class_type, preferred_date)` and block `SELECT/UPDATE/DELETE`. All reads/writes of `status` and admin queries use the service-role key server-side.
