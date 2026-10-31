import { AlertTriangle, ShieldCheck } from "lucide-react";

import { SITE } from "@/lib/site";

const PARTNERS = [
  { name: "Kemenag RI", note: `No. Izin PPIU ${SITE.ppiu}`, highlight: "Resmi Terdaftar" },
  { name: "5 Pasti Umrah", note: "Standar Layanan Kemenag", highlight: "Pasti Berangkat" },
  { name: "SISKOPATUH", note: "Sistem Terintegrasi", highlight: "Data Transparan" },
  { name: "AMITRA Syariah", note: "Pembiayaan Tanpa Riba", highlight: "Mitra Resmi" },
];

export function TrustBanner() {
  return (
    <section className="relative border-b border-white/[0.08] bg-[#090d15] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Anti-Fraud Warning Callout */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-[#0e1320] to-amber-500/5 p-5 sm:p-6 backdrop-blur-xl">
          <div className="flex items-start gap-3.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-[#f3c64f]">
              <AlertTriangle className="size-5" />
            </div>
            <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
              <strong className="font-bold text-[#f3c64f]">Keamanan Transaksi Jamaah:</strong>{" "}
              Pastikan seluruh proses pendaftaran dan pembayaran hanya dilakukan di kantor cabang resmi kami{" "}
              (<strong>{SITE.address}</strong>) dan ditransfer ke rekening bank atas nama perusahaan resmi{" "}
              <strong className="text-white underline underline-offset-2">{SITE.company}</strong>.
            </div>
          </div>
        </div>

        {/* 4 Trust Partners */}
        <div className="mt-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
          {PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0e1320]/75 p-5 text-center shadow-xl backdrop-blur-xl transition-all hover:border-[#f3c64f]/40 hover:bg-[#121726]"
            >
              <span className="text-[10px] uppercase tracking-widest text-[#f3c64f] font-mono">
                {partner.highlight}
              </span>
              <p className="mt-1 font-display text-lg font-bold text-white tracking-wide">
                {partner.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{partner.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
