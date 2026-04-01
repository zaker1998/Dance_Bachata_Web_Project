import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:justify-between">
        <p>&copy; {new Date().getFullYear()} Bachata Vienna. All rights reserved.</p>
        <nav className="flex gap-6">
          <Link href="/videos" className="transition-colors hover:text-foreground">
            Videos
          </Link>
          <Link href="/book" className="transition-colors hover:text-foreground">
            Book Class
          </Link>
          <Link href="/contact" className="transition-colors hover:text-foreground">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
