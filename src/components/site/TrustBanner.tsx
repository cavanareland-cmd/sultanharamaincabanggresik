import { AlertTriangle } from "lucide-react";

import { SITE } from "@/lib/site";

const PARTNERS = [
  { name: "Kemenag RI", note: "Izin PPIU" },
  { name: "5 Pasti Umrah", note: "Standar Layanan" },
  { name: "SISKOPATUH", note: "Terdaftar" },
  { name: "AMITRA", note: "Pembiayaan Syariah" },
];

export function TrustBanner() {
  return (
    <section className="border-y border-border/60 bg-surface/50 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-5 sm:p-6">
          <p className="flex items-start gap-3 text-sm text-foreground/90">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
            <span>
              <strong className="font-semibold">Hati-hati terhadap penipuan!</strong> Pastikan
              pendaftaran Umroh hanya melalui kantor resmi kami dan rekening atas nama perusahaan{" "}
              <strong>{SITE.company}</strong>.
            </span>
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="rounded-xl border border-gold/30 bg-background/50 px-5 py-4 text-center"
            >
              <p className="font-display text-lg font-semibold text-gradient-gold">{partner.name}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {partner.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
