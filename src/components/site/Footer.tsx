import { Link } from "@tanstack/react-router";
import {
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  ShieldCheck,
} from "lucide-react";

import logoAsset from "@/assets/logo.png.asset.json";
import { Button } from "@/components/ui/button";
import type { SiteContentMap } from "@/lib/content.functions";
import { NAV_LINKS, SITE, waLink } from "@/lib/site";

export function Footer({ content }: { content: SiteContentMap }) {
  const phone = content["contact_phone"] ?? SITE.phoneDisplay;
  const address = content["contact_address"] ?? SITE.address;

  return (
    <footer id="kontak" className="relative border-t border-white/[0.08] bg-[#070a12] pt-16 pb-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-[#f3c64f]/5 blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Col 1: Brand & Credentials (4 cols) */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5 shadow-inner">
                <img
                  src={logoAsset.url}
                  alt="Logo Sultan Haramain Gresik"
                  width={40}
                  height={40}
                  loading="lazy"
                  className="h-9 w-9 object-contain"
                />
              </div>
              <div>
                <span className="font-display text-xl font-bold tracking-wide text-gradient-gold">
                  SULTAN HARAMAIN
                </span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Kantor Cabang Gresik
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {SITE.company} ({SITE.branch}). Biro perjalanan ibadah Umrah resmi berizin PPIU No. {SITE.ppiu}. Menghadirkan kenyamanan, kepastian, dan kemewahan dalam melayani tamu-tamu Allah.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Sultan Haramain"
                className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:text-[#f3c64f] hover:border-[#f3c64f]/40 hover:bg-white/10 transition-all"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook Sultan Haramain"
                className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:text-[#f3c64f] hover:border-[#f3c64f]/40 hover:bg-white/10 transition-all"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href={SITE.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok Sultan Haramain"
                className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:text-[#f3c64f] hover:border-[#f3c64f]/40 hover:bg-white/10 transition-all"
              >
                <Music2 className="size-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Contact Info & Quick Navigation (4 cols) */}
          <div className="lg:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f3c64f]">
              Kontak & Alamat Kantor
            </h3>

            <ul className="mt-4 space-y-3 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#f3c64f]" />
                <span className="leading-snug">{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-[#f3c64f]" />
                <a
                  className="hover:text-[#f3c64f] transition-colors"
                  href={`tel:+${SITE.phoneIntl}`}
                >
                  {phone} (Hotline Resmi)
                </a>
              </li>
              {content["contact_email"] ? (
                <li className="flex items-center gap-3">
                  <Mail className="size-4 shrink-0 text-[#f3c64f]" />
                  <a
                    className="hover:text-[#f3c64f] transition-colors"
                    href={`mailto:${content["contact_email"]}`}
                  >
                    {content["contact_email"]}
                  </a>
                </li>
              ) : null}
              {content["contact_hours"] ? (
                <li className="flex items-center gap-3">
                  <Clock className="size-4 shrink-0 text-[#f3c64f]" />
                  <span>{content["contact_hours"]}</span>
                </li>
              ) : null}
            </ul>

            <div className="mt-5">
              <Button
                asChild
                size="sm"
                className="rounded-full border border-[#25D366]/40 bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/25 text-xs font-semibold"
              >
                <a href={waLink("konsultasi paket umrah")} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-3.5 mr-1.5" />
                  Chat Langsung Customer Service
                </a>
              </Button>
            </div>

            <nav className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-[#f3c64f] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Col 3: Interactive Location Map (4 cols) */}
          <div className="lg:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f3c64f]">
              Peta Lokasi Kantor Cabang
            </h3>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-xl">
              <iframe
                title="Peta lokasi kantor Sultan Haramain Gresik"
                src={SITE.mapsEmbed}
                loading="lazy"
                className="h-48 w-full border-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Golden Wave Ribbon Accent (Exact from template) */}
        <div className="relative mt-12 w-full overflow-hidden h-7">
          <svg
            viewBox="0 0 1200 40"
            className="w-full h-full preserve-3d"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,25 C300,5 600,40 900,15 C1050,5 1150,28 1200,20"
              stroke="url(#goldRibbon)"
              strokeWidth="2.5"
              fill="none"
            />
            <path
              d="M0,28 C280,10 580,45 880,18 C1040,8 1160,30 1200,22"
              stroke="#ffd978"
              strokeWidth="1"
              strokeOpacity="0.4"
              fill="none"
            />
            <defs>
              <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#b8860b" stopOpacity="0.2" />
                <stop offset="30%" stopColor="#f3c64f" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#ffd978" stopOpacity="1" />
                <stop offset="100%" stopColor="#c59b27" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Bottom Legal Copyright Strip Matching Template */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs text-muted-foreground">
          <p className="text-white/80">
            &copy; {new Date().getFullYear()} Sultan Haramain Cabang Gresik. All rights reserved.
          </p>

          {/* Social Icons Stack */}
          <div className="flex items-center gap-3 text-white/70">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube Sultan Haramain"
              className="flex size-7 items-center justify-center rounded-full bg-white/5 hover:text-[#f3c64f] hover:bg-white/10 transition-colors"
            >
              <span className="text-[11px] font-bold">YT</span>
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram Sultan Haramain"
              className="flex size-7 items-center justify-center rounded-full bg-white/5 hover:text-[#f3c64f] hover:bg-white/10 transition-colors"
            >
              <Instagram className="size-3.5" />
            </a>
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook Sultan Haramain"
              className="flex size-7 items-center justify-center rounded-full bg-white/5 hover:text-[#f3c64f] hover:bg-white/10 transition-colors"
            >
              <Facebook className="size-3.5" />
            </a>
            <a
              href={waLink("informasi resmi umrah gresik")}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp Sultan Haramain"
              className="flex size-7 items-center justify-center rounded-full bg-white/5 hover:text-[#25D366] hover:bg-white/10 transition-colors"
            >
              <MessageCircle className="size-3.5" />
            </a>
          </div>

          {/* Slogan */}
          <div className="font-display italic text-[#f3c64f] text-sm tracking-wide">
            Ibadah Suci, Layanan Terbaik
          </div>
        </div>
      </div>
    </footer>
  );
}
