import type { Metadata } from "next";
import { BookingForm } from "@/components/booking/booking-form";
import { Users, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Book a Class — Bachata Vienna",
  description:
    "Reserve your spot in a group class or book a private Bachata lesson in Vienna.",
  alternates: { canonical: "/book" },
  openGraph: {
    title: "Book a Class — Bachata Vienna",
    description:
      "Reserve your spot in a group class or book a private Bachata lesson in Vienna.",
    url: "/book",
    type: "website",
  },
};

export default function BookPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Book a Class
        </h1>
        <p className="mt-2 text-muted-foreground">
          Choose your format, pick a date, and we&apos;ll confirm your spot.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-5">
        {/* Form column */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm sm:p-8">
            <BookingForm />
          </div>
        </div>

        {/* Info sidebar */}
        <aside className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Users className="h-5 w-5" />
              <h3 className="font-semibold">Group Class</h3>
            </div>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>Beginner & intermediate levels</li>
              <li>Schedule will be announced soon.</li>
              <li className="font-medium text-foreground">€15 / class (Student -20%)</li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <User className="h-5 w-5" />
              <h3 className="font-semibold">Private Lesson</h3>
            </div>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>1-on-1 or couple session</li>
              <li>Tailored to your level & goals</li>
              <li>Flexible scheduling</li>
              <li className="font-medium text-foreground">€60 / hour</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
