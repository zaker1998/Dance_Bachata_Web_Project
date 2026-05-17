"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error boundary caught:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
        Something went wrong
      </p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        We hit an unexpected error
      </h1>
      <p className="mt-3 text-muted-foreground">
        Please try again, or head back to the homepage. If this keeps
        happening, let us know on the contact page.
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-muted-foreground/60">
          Reference: {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
