"use client";

import { useActionState } from "react";
import { createBooking, type BookingResult } from "@/app/book/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const initialState: BookingResult = { success: false, message: "" };

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting…
        </>
      ) : (
        "Book My Class"
      )}
    </Button>
  );
}

export function BookingForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: BookingResult, formData: FormData) => createBooking(formData),
    initialState
  );

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle className="h-10 w-10 text-emerald-600" />
        <p className="text-lg font-semibold text-emerald-800">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.message && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.message}
        </div>
      )}

      <fieldset disabled={pending} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="user_name" className="text-sm font-medium">
            Full Name
          </label>
          <input
            id="user_name"
            name="user_name"
            type="text"
            required
            placeholder="Maria Schmidt"
            className={cn(
              "w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm",
              "placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            )}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="user_email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="user_email"
            name="user_email"
            type="email"
            required
            placeholder="maria@example.com"
            className={cn(
              "w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm",
              "placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            )}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="class_type" className="text-sm font-medium">
            Class Type
          </label>
          <select
            id="class_type"
            name="class_type"
            required
            defaultValue=""
            className={cn(
              "w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm",
              "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            )}
          >
            <option value="" disabled>
              Select a class type
            </option>
            <option value="group">Group Class</option>
            <option value="private">Private Lesson</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="preferred_date" className="text-sm font-medium">
            Preferred Date
          </label>
          <input
            id="preferred_date"
            name="preferred_date"
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
            className={cn(
              "w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm",
              "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            )}
          />
        </div>

        <SubmitButton pending={pending} />
      </fieldset>
    </form>
  );
}
