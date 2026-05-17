import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
        404
      </p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        This page doesn&apos;t exist
      </h1>
      <p className="mt-3 text-muted-foreground">
        The link may be broken or the page may have moved.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/videos">Browse videos</Link>
        </Button>
      </div>
    </div>
  );
}
