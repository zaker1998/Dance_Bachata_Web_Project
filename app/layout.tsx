import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bachata Vienna — Dance Classes & Private Lessons",
    template: "%s · Bachata Vienna",
  },
  description:
    "Master Bachata in Vienna with expert-led group classes and private lessons. Watch our video library and book your next session.",
  keywords: [
    "Bachata",
    "Vienna",
    "dance classes",
    "private lessons",
    "Wien",
    "Tanzkurs",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Bachata Vienna",
    title: "Bachata Vienna — Dance Classes & Private Lessons",
    description:
      "Master Bachata in Vienna with expert-led group classes and private lessons.",
    locale: "en_AT",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bachata Vienna — Dance Classes & Private Lessons",
    description:
      "Master Bachata in Vienna with expert-led group classes and private lessons.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "/",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Bachata Vienna",
  description:
    "Bachata dance classes and private lessons in Vienna, Austria.",
  url: siteUrl,
  email: "hello@bachatavienna.at",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Vienna",
    addressCountry: "AT",
  },
  areaServed: "Vienna, Austria",
  sameAs: [
    "https://instagram.com/bachatavienna",
    "https://youtube.com/@bachatavienna",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
      </body>
    </html>
  );
}
