"use client";

import { useRef, useState, useTransition } from "react";
import { updateBookingStatus } from "./actions";
import { cn } from "@/lib/utils";
import type { BookingRow } from "@/lib/types";

type BookingStatus = BookingRow["status"];

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-800 border-rose-200",
};

export function StatusSelect({ id, current }: { id: string; current: BookingStatus }) {
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState<BookingStatus>(current);
  const [error, setError] = useState<string | null>(null);
  const selectRef = useRef<HTMLSelectElement | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as BookingStatus;
    const previous = value;

    setError(null);
    setValue(next); // Optimistic update.

    startTransition(async () => {
      try {
        await updateBookingStatus(id, next);
      } catch (err) {
        console.error("Failed to update booking status:", err);
        setValue(previous);
        if (selectRef.current) selectRef.current.value = previous;
        setError("Couldn't save status. Please try again.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <select
        ref={selectRef}
        value={value}
        onChange={handleChange}
        disabled={pending}
        aria-label="Booking status"
        className={cn(
          "rounded-full border px-3 py-1 text-xs font-medium capitalize focus:outline-none",
          statusStyles[value],
          pending && "opacity-50"
        )}
      >
        <option value="pending">pending</option>
        <option value="confirmed">confirmed</option>
        <option value="cancelled">cancelled</option>
      </select>
      {error && (
        <p role="alert" className="text-[11px] font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
