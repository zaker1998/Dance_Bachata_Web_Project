import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — Bachata Vienna",
  description:
    "Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO und österreichischem Datenschutzgesetz.",
  alternates: { canonical: "/datenschutz" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "16. April 2026";

export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Datenschutzerklärung
        </h1>
        <p className="mt-2 text-muted-foreground">
          Information on the processing of personal data in accordance with
          the EU General Data Protection Regulation (GDPR / DSGVO) and the
          Austrian Data Protection Act (DSG). Last updated: {LAST_UPDATED}.
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">
        <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            1. Verantwortlicher (Data Controller)
          </h2>
          <p className="mb-3">
            Verantwortlich für die Datenverarbeitung auf dieser Website im
            Sinne der DSGVO ist:
          </p>
          <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-[max-content_1fr]">
            <dt className="font-medium text-muted-foreground">Name</dt>
            <dd>[YOUR FULL LEGAL NAME]</dd>

            <dt className="font-medium text-muted-foreground">Adresse</dt>
            <dd>
              [STREET + NUMBER], [POSTCODE] Wien, Österreich
            </dd>

            <dt className="font-medium text-muted-foreground">E-Mail</dt>
            <dd>
              <a
                href="mailto:privacy@bachatavienna.com"
                className="text-primary hover:underline"
              >
                privacy@bachatavienna.com
              </a>
            </dd>
          </dl>
          <p className="mt-3">
            Für alle datenschutzrechtlichen Anliegen können Sie uns jederzeit
            über die oben genannten Kontaktdaten erreichen. Vollständige
            Kontaktinformationen finden Sie im{" "}
            <Link href="/impressum" className="text-primary hover:underline">
              Impressum
            </Link>
            .
          </p>
        </section>

        <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            2. Welche Daten wir verarbeiten
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold">
                a) Kontaktformular
              </h3>
              <p>
                Wenn Sie das Kontaktformular nutzen, verarbeiten wir die von
                Ihnen angegebenen Daten: Name, E-Mail-Adresse und Ihre
                Nachricht. Diese Daten werden ausschließlich zur Beantwortung
                Ihrer Anfrage verwendet.
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Rechtsgrundlage: Art 6 Abs 1 lit b und f DSGVO</li>
                <li>
                  Zweck: Bearbeitung der Kontaktanfrage
                </li>
                <li>
                  Speicherdauer: bis zur Erledigung Ihres Anliegens, maximal
                  12 Monate, sofern keine gesetzliche Aufbewahrungspflicht
                  besteht
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">
                b) Buchungsformular
              </h3>
              <p>
                Zur Buchung von Tanzkursen erheben wir: Name, E-Mail-Adresse,
                Telefonnummer (optional), gewünschter Kurs, optionale
                Nachricht.
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>
                  Rechtsgrundlage: Art 6 Abs 1 lit b DSGVO (Vertragsanbahnung
                  bzw. Vertragserfüllung)
                </li>
                <li>
                  Zweck: Durchführung und Verwaltung der Kursbuchung,
                  Kommunikation zur Terminvereinbarung
                </li>
                <li>
                  Speicherdauer: für die Dauer der Geschäftsbeziehung;
                  steuerrechtlich relevante Daten (Rechnungen) bis zu 7 Jahre
                  gemäß §132 BAO
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">
                c) Server-Logfiles
              </h3>
              <p>
                Unser Hosting-Anbieter (Vercel Inc.) erhebt automatisch
                technische Daten (IP-Adresse, Zeitpunkt des Zugriffs,
                angeforderte Ressource, Browser-Typ) zur Gewährleistung des
                sicheren Betriebs. Diese Daten werden nicht mit anderen
                personenbezogenen Daten zusammengeführt.
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>
                  Rechtsgrundlage: Art 6 Abs 1 lit f DSGVO (berechtigtes
                  Interesse an IT-Sicherheit)
                </li>
                <li>Speicherdauer: gemäß Vercel-Richtlinien, in der Regel 30 Tage</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">d) Cookies</h3>
              <p>
                Diese Website verwendet ausschließlich technisch notwendige
                Cookies, die für den Betrieb der Seite erforderlich sind.
                Es werden keine Tracking-, Analyse- oder Werbe-Cookies
                eingesetzt.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            3. Empfänger und Auftragsverarbeiter
          </h2>
          <p className="mb-3">
            Zur Bereitstellung unserer Website und Services setzen wir die
            folgenden Dienstleister als Auftragsverarbeiter gemäß Art 28 DSGVO
            ein. Mit allen Anbietern bestehen Auftragsverarbeitungsverträge:
          </p>
          <ul className="space-y-3">
            <li>
              <strong>Vercel Inc.</strong> (USA) — Hosting & Content Delivery.
              Datenübermittlung in die USA auf Grundlage des
              EU-US-Data-Privacy-Framework sowie Standardvertragsklauseln.{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Datenschutzerklärung Vercel
              </a>
            </li>
            <li>
              <strong>Supabase Inc.</strong> (EU-Region: Frankfurt, Deutschland)
              — Datenbank für Buchungs- und Kontaktdaten.{" "}
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Datenschutzerklärung Supabase
              </a>
            </li>
            <li>
              <strong>Resend, Inc.</strong> (USA) — Versand von
              Bestätigungs- und Benachrichtigungs-E-Mails.
              Datenübermittlung auf Grundlage von Standardvertragsklauseln.{" "}
              <a
                href="https://resend.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Datenschutzerklärung Resend
              </a>
            </li>
            <li>
              <strong>Cloudflare, Inc.</strong> (USA) — DNS und Domain-Registry.{" "}
              <a
                href="https://www.cloudflare.com/privacypolicy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Datenschutzerklärung Cloudflare
              </a>
            </li>
          </ul>
          <p className="mt-3">
            Eine Weitergabe Ihrer Daten an sonstige Dritte erfolgt nicht,
            ausgenommen gesetzliche Verpflichtungen (z.B. Finanzbehörden).
          </p>
        </section>

        <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            4. Ihre Rechte
          </h2>
          <p className="mb-3">Ihnen stehen folgende Betroffenenrechte zu:</p>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <strong>Recht auf Auskunft</strong> (Art 15 DSGVO) — ob und
              welche Daten wir über Sie verarbeiten
            </li>
            <li>
              <strong>Recht auf Berichtigung</strong> (Art 16 DSGVO) —
              unrichtige Daten berichtigen zu lassen
            </li>
            <li>
              <strong>Recht auf Löschung</strong> (Art 17 DSGVO) &mdash;
              &bdquo;Recht auf Vergessenwerden&ldquo;
            </li>
            <li>
              <strong>Recht auf Einschränkung</strong> (Art 18 DSGVO)
            </li>
            <li>
              <strong>Recht auf Datenübertragbarkeit</strong> (Art 20 DSGVO)
            </li>
            <li>
              <strong>Widerspruchsrecht</strong> (Art 21 DSGVO) gegen
              Verarbeitungen auf Grundlage berechtigter Interessen
            </li>
            <li>
              <strong>Recht auf Widerruf</strong> einer erteilten Einwilligung
              mit Wirkung für die Zukunft
            </li>
          </ul>
          <p className="mt-4">
            Zur Ausübung Ihrer Rechte genügt eine formlose E-Mail an{" "}
            <a
              href="mailto:privacy@bachatavienna.com"
              className="text-primary hover:underline"
            >
              privacy@bachatavienna.com
            </a>
            .
          </p>
        </section>

        <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            5. Beschwerderecht
          </h2>
          <p>
            Sie haben gemäß Art 77 DSGVO das Recht, sich bei der
            österreichischen Datenschutzbehörde zu beschweren, wenn Sie der
            Ansicht sind, dass die Verarbeitung Ihrer Daten rechtswidrig ist.
          </p>
          <div className="mt-3 rounded-lg bg-muted/40 p-4">
            <p className="font-medium">Österreichische Datenschutzbehörde</p>
            <p>Barichgasse 40–42, 1030 Wien</p>
            <p>
              Tel.: +43 1 52 152-0 &middot;{" "}
              <a
                href="mailto:dsb@dsb.gv.at"
                className="text-primary hover:underline"
              >
                dsb@dsb.gv.at
              </a>
            </p>
            <p>
              <a
                href="https://www.dsb.gv.at"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                www.dsb.gv.at
              </a>
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            6. Datensicherheit
          </h2>
          <p>
            Die Übermittlung Ihrer Daten erfolgt verschlüsselt über HTTPS
            (TLS). Wir setzen technische und organisatorische Maßnahmen ein,
            um Ihre Daten gegen unbefugten Zugriff, Verlust oder Manipulation
            zu schützen.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            7. Änderungen dieser Datenschutzerklärung
          </h2>
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um
            sie an geänderte Rechtslagen oder bei Änderungen des Dienstes
            sowie der Datenverarbeitung anzupassen. Die jeweils aktuelle
            Fassung ist stets auf dieser Seite verfügbar.
          </p>
        </section>

        <section>
          <Link
            href="/impressum"
            className="text-sm text-primary hover:underline"
          >
            → Impressum
          </Link>
        </section>
      </div>
    </div>
  );
}
