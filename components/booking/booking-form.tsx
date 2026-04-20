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

const fieldClasses = (hasError: boolean) =>
  cn(
    "w-full rounded-lg border bg-white px-4 py-2.5 text-sm",
    "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2",
    hasError
      ? "border-rose-300 focus:border-rose-400 focus:ring-rose-200"
      : "border-border focus:border-primary focus:ring-primary/20"
  );

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs font-medium text-rose-600">{message}</p>;
}

export function BookingForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: BookingResult, formData: FormData) => createBooking(formData),
    initialState
  );

  const errors = state.fieldErrors ?? {};

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle className="h-10 w-10 text-emerald-600" />
        <p className="text-lg font-semibold text-emerald-800">{state.message}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="text-sm font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
        >
          Book another class
        </button>
      </div>
    );
  }

  const todayIso = new Date().toISOString().split("T")[0];

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.message && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.message}
        </div>
      )}

      {/* Honeypot — invisible to humans, tempting to bots */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

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
            autoComplete="name"
            placeholder="Maria Schmidt"
            aria-invalid={!!errors.user_name}
            aria-describedby={errors.user_name ? "user_name-error" : undefined}
            className={fieldClasses(!!errors.user_name)}
          />
          <FieldError message={errors.user_name} />
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
            autoComplete="email"
            placeholder="maria@example.com"
            aria-invalid={!!errors.user_email}
            aria-describedby={errors.user_email ? "user_email-error" : undefined}
            className={fieldClasses(!!errors.user_email)}
          />
          <FieldError message={errors.user_email} />
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
            aria-invalid={!!errors.class_type}
            className={fieldClasses(!!errors.class_type)}
          >
            <option value="" disabled>
              Select a class type
            </option>
            <option value="group">Group Class</option>
            <option value="private">Private Lesson</option>
          </select>
          <FieldError message={errors.class_type} />
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
            min={todayIso}
            aria-invalid={!!errors.preferred_date}
            className={fieldClasses(!!errors.preferred_date)}
          />
          <FieldError message={errors.preferred_date} />
        </div>

        <SubmitButton pending={pending} />
      </fieldset>
    </form>
  );
}
