import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum — Bachata Vienna",
  description:
    "Legal information (Impressum) for Bachata Vienna according to §5 ECG, §25 MedienG and §14 UGB.",
  alternates: { canonical: "/impressum" },
  robots: { index: true, follow: true },
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Impressum
        </h1>
        <p className="mt-2 text-muted-foreground">
          Information according to §5 ECG, §25 MedienG and §14 UGB.
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">
        <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            Diensteanbieter / Medieninhaber
          </h2>
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-[max-content_1fr]">
            <dt className="font-medium text-muted-foreground">Name</dt>
            <dd>[YOUR FULL LEGAL NAME — Vor- und Nachname]</dd>

            <dt className="font-medium text-muted-foreground">Unternehmen</dt>
            <dd>Bachata Vienna (Einzelunternehmen — Neue Selbständige)</dd>

            <dt className="font-medium text-muted-foreground">Adresse</dt>
            <dd>
              [STREET + NUMBER]
              <br />
              [POSTCODE] Wien
              <br />
              Österreich / Austria
            </dd>

            <dt className="font-medium text-muted-foreground">E-Mail</dt>
            <dd>
              <a
                href="mailto:hello@bachatavienna.com"
                className="text-primary hover:underline"
              >
                hello@bachatavienna.com
              </a>
            </dd>

            <dt className="font-medium text-muted-foreground">Telefon</dt>
            <dd>[YOUR PHONE NUMBER — required by §5 ECG]</dd>
          </dl>
        </section>

        <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            Berufliche Tätigkeit
          </h2>
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-[max-content_1fr]">
            <dt className="font-medium text-muted-foreground">
              Berufsbezeichnung
            </dt>
            <dd>Freiberuflicher Tanzlehrer (Neue Selbständige)</dd>

            <dt className="font-medium text-muted-foreground">Tätigkeit</dt>
            <dd>
              Bachata-Tanzunterricht für Anfänger und Fortgeschrittene in Wien
            </dd>

            <dt className="font-medium text-muted-foreground">
              Wirtschaftszweig (ÖNACE)
            </dt>
            <dd>85.52-1 — Kultureller Unterricht</dd>

            <dt className="font-medium text-muted-foreground">Steuernummer</dt>
            <dd>12 859/4272</dd>

            <dt className="font-medium text-muted-foreground">
              Umsatzsteuer
            </dt>
            <dd>
              Kleinunternehmerregelung gemäß §6 Abs 1 Z 27 UStG — keine
              Umsatzsteuer ausgewiesen.
            </dd>

            <dt className="font-medium text-muted-foreground">
              Beginn der Tätigkeit
            </dt>
            <dd>18.07.2025</dd>

            <dt className="font-medium text-muted-foreground">
              Anwendbare Rechtsvorschriften
            </dt>
            <dd>
              Einkommensteuergesetz (EStG), Umsatzsteuergesetz (UStG).
              <br />
              Einsehbar auf{" "}
              <a
                href="https://www.ris.bka.gv.at/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                www.ris.bka.gv.at
              </a>
              .
            </dd>
          </dl>
        </section>

        <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Online-Streitbeilegung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streit­
            beilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              ec.europa.eu/consumers/odr
            </a>
            . Zur Teilnahme an einem Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle sind wir weder verpflichtet noch
            bereit.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            Haftung für Inhalte und Links
          </h2>
          <div className="space-y-3">
            <p>
              Die Inhalte dieser Website werden mit größtmöglicher Sorgfalt
              erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität
              kann jedoch keine Gewähr übernommen werden. Als Diensteanbieter
              bin ich gemäß §7 Abs 1 ECG für eigene Inhalte nach den
              allgemeinen Gesetzen verantwortlich.
            </p>
            <p>
              Diese Website enthält Verweise auf externe Websites Dritter,
              auf deren Inhalte ich keinen Einfluss habe. Für diese fremden
              Inhalte kann keine Gewähr übernommen werden. Für die Inhalte
              verlinkter Seiten ist stets der jeweilige Anbieter verantwortlich.
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Urheberrecht</h2>
          <p>
            Die durch den Seitenbetreiber erstellten Inhalte und Werke
            unterliegen dem österreichischen Urheberrecht. Vervielfältigung,
            Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
            Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung
            des jeweiligen Autors. Videoinhalte sind Eigentum der jeweiligen
            Urheber und werden unter Angabe der Quelle verlinkt.
          </p>
        </section>

        <section>
          <Link
            href="/datenschutz"
            className="text-sm text-primary hover:underline"
          >
            → Datenschutzerklärung
          </Link>
        </section>
      </div>
    </div>
  );
}
