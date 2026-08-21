import { MessageCircle, ShieldCheck } from "lucide-react";

import heroImage from "@/assets/hero-haramain.jpg";
import { Button } from "@/components/ui/button";
import { SITE, waLink } from "@/lib/site";

type HeroProps = {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
};

export function Hero({ title, subtitle, children }: HeroProps) {
  return (
    <section id="beranda" className="relative overflow-hidden">
      <img
        src={heroImage}
        alt="Masjid Nabawi Madinah dan Masjidil Haram Makkah pada malam hari"
        width={1920}
        height={1088}
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-night)" }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="max-w-3xl border-l-2 border-gold/70 pl-5 sm:pl-8">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-background/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-gold">
            <ShieldCheck className="size-3.5" />
            Resmi & Berizin Kemenag
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
            <span className="text-gradient-gold">{title}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm text-foreground/85 sm:text-base">{subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="gold" size="lg">
              <a href={waLink("pendaftaran umrah")} target="_blank" rel="noreferrer">
                Daftar Sekarang
              </a>
            </Button>
            <Button asChild variant="whatsapp" size="lg">
              <a href={waLink("konsultasi gratis paket umrah")} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" />
                Konsultasi Free
              </a>
            </Button>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Hotline / WhatsApp {SITE.phoneDisplay} &middot; {SITE.address}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}
