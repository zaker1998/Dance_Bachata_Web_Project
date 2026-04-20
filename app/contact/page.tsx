import { Mail, MapPin, Instagram, Youtube } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata = {
  title: "Contact — Bachata Vienna",
  description: "Get in touch about Bachata classes, private lessons, or events in Vienna.",
};

const CONTACT_EMAIL = "dusaliev.marat@gmail.com";

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
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
        <ContactForm />
      </div>
    </div>
  );
}
