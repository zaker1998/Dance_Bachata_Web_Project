import Link from "next/link";
import { createAdminClient } from "@/lib/supabase-admin";
import { cn } from "@/lib/utils";
import { StatusSelect } from "./status-select";
import type { BookingRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — Bookings",
};

async function getBookings(): Promise<BookingRow[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

const STATUS_FILTERS = ["all", "pending", "confirmed", "cancelled"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const filterStyles: Record<StatusFilter, string> = {
  all: "border-primary bg-primary text-white",
  pending: "border-amber-300 bg-amber-100 text-amber-800",
  confirmed: "border-emerald-300 bg-emerald-100 text-emerald-800",
  cancelled: "border-rose-300 bg-rose-100 text-rose-800",
};

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const allBookings = await getBookings();

  const { status } = await searchParams;
  const filter: StatusFilter = STATUS_FILTERS.includes(status as StatusFilter)
    ? (status as StatusFilter)
    : "all";
  const bookings =
    filter === "all" ? allBookings : allBookings.filter((b) => b.status === filter);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {allBookings.length} total · change status inline
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => {
          const count =
            f === "all"
              ? allBookings.length
              : allBookings.filter((b) => b.status === f).length;
          const active = filter === f;
          return (
            <Link
              key={f}
              href={f === "all" ? "/admin/bookings" : `/admin/bookings?status=${f}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                active
                  ? filterStyles[f]
                  : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {f} <span className="opacity-70">{count}</span>
            </Link>
          );
        })}
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
          {filter === "all" ? "No bookings yet." : `No ${filter} bookings.`}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">WhatsApp</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">1st slot</th>
                <th className="px-4 py-3">2nd slot</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{b.user_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.user_email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.whatsapp_number}</td>
                  <td className="px-4 py-3 capitalize">{b.class_type}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {b.preferred_date}
                    {b.preferred_time && (
                      <span className="ml-1 text-muted-foreground">@ {b.preferred_time}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {b.secondary_date ? (
                      <>
                        {b.secondary_date}
                        {b.secondary_time && (
                          <span className="ml-1 text-muted-foreground">@ {b.secondary_time}</span>
                        )}
                      </>
                    ) : (
                      <span className="text-muted-foreground/50">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(b.created_at).toLocaleDateString("de-AT", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <StatusSelect id={b.id} current={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
