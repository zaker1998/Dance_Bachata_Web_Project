export default function AdminBookingsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <div className="h-7 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-48 animate-pulse rounded bg-muted/60" />
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="border-b border-border bg-muted/40 px-4 py-3">
          <div className="h-3 w-24 animate-pulse rounded bg-muted-foreground/20" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-border px-4 py-4 last:border-b-0"
          >
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-48 animate-pulse rounded bg-muted/70" />
            <div className="ml-auto h-6 w-24 animate-pulse rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
