import { Mail, MapPin, Instagram, Youtube } from "lucide-react";

export const metadata = {
  title: "Contact — Bachata Vienna",
  description: "Get in touch about Bachata classes, private lessons, or anything else.",
};

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    value: "dusaliev.marat@gmail.com",
    href: "mailto:dusaliev.marat@gmail.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Vienna, Austria",
    href: "https://maps.google.com/?q=Vienna,Austria",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@_maratikooo_",
    href: "https://instagram.com/_maratikooo_",
  },
  {
    icon: Youtube,
    label: "YouTube",
    value: "Bachata Vienna",
    href: "https://youtube.com/@bachatavienna",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Get in Touch
        </h1>
        <p className="mt-2 text-muted-foreground">
          Questions about classes, private lessons, or events? Reach out.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {contactItems.map(({ icon: Icon, label, value, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              <p className="mt-0.5 text-sm font-semibold">{value}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-1 text-lg font-semibold">Send a Message</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          I usually respond within 24 hours.
        </p>
        <form
          action={`mailto:hello@bachatavienna.at`}
          method="post"
          encType="text/plain"
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="message" className="text-sm font-medium">Message</label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="How can I help you?"
              className="w-full resize-none rounded-lg border border-border bg-white px-4 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
