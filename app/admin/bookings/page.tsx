import { createAdminClient } from "@/lib/supabase-admin";
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

const statusDot: Record<string, string> = {
  pending: "bg-amber-400",
  confirmed: "bg-emerald-500",
  cancelled: "bg-rose-400",
};

export default async function AdminBookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {bookings.length} total · change status inline
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
          No bookings yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{b.user_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.user_email}</td>
                  <td className="px-4 py-3 capitalize">{b.class_type}</td>
                  <td className="px-4 py-3">{b.preferred_date}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(b.created_at).toLocaleDateString("de-AT", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${statusDot[b.status] ?? "bg-muted-foreground"}`}
                      />
                      <StatusSelect id={b.id} current={b.status} />
                    </div>
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
