"use client";

import { useTransition } from "react";
import { updateBookingStatus } from "./actions";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-800 border-rose-200",
};

export function StatusSelect({ id, current }: { id: string; current: string }) {
  const [pending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    startTransition(() => updateBookingStatus(id, next));
  }

  return (
    <select
      defaultValue={current}
      onChange={handleChange}
      disabled={pending}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium capitalize focus:outline-none",
        statusStyles[current] ?? "bg-muted text-foreground border-border",
        pending && "opacity-50"
      )}
    >
      <option value="pending">pending</option>
      <option value="confirmed">confirmed</option>
      <option value="cancelled">cancelled</option>
    </select>
  );
}
