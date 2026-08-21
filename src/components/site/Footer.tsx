import { Link } from "@tanstack/react-router";
import { Clock, Facebook, Instagram, Mail, MapPin, MessageCircle, Music2, Phone } from "lucide-react";

import logoAsset from "@/assets/logo.png.asset.json";
import { Button } from "@/components/ui/button";
import type { SiteContentMap } from "@/lib/content.functions";
import { NAV_LINKS, SITE, waLink } from "@/lib/site";

export function Footer({ content }: { content: SiteContentMap }) {
  const phone = content["contact_phone"] ?? SITE.phoneDisplay;
  const address = content["contact_address"] ?? SITE.address;

  return (
    <footer id="kontak" className="border-t border-border/60 bg-surface/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={logoAsset.url}
              alt="Logo Sultan Haramain Gresik"
              width={56}
              height={56}
              loading="lazy"
              className="h-14 w-14 object-contain"
            />
            <span className="font-display text-xl font-semibold text-gradient-gold">
              SULTAN HARAMAIN
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {SITE.company} - {SITE.branch}. Travel Umrah resmi dan terpercaya melayani jamaah Gresik,
            Surabaya, dan Jawa Timur.
          </p>
          <div className="mt-5 flex gap-2">
            <Button asChild variant="outlineGold" size="icon" aria-label="Instagram">
              <a href={SITE.instagram} target="_blank" rel="noreferrer">
                <Instagram className="size-4" />
              </a>
            </Button>
            <Button asChild variant="outlineGold" size="icon" aria-label="Facebook">
              <a href={SITE.facebook} target="_blank" rel="noreferrer">
                <Facebook className="size-4" />
              </a>
            </Button>
            <Button asChild variant="outlineGold" size="icon" aria-label="TikTok">
              <a href={SITE.tiktok} target="_blank" rel="noreferrer">
                <Music2 className="size-4" />
              </a>
            </Button>
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold text-gold">Kontak Kami</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>{address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-gold" />
              <a className="hover:text-gold" href={`tel:+${SITE.phoneIntl}`}>
                {phone}
              </a>
            </li>
            {content["contact_email"] ? (
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-gold" />
                <a className="hover:text-gold" href={`mailto:${content["contact_email"]}`}>
                  {content["contact_email"]}
                </a>
              </li>
            ) : null}
            {content["contact_hours"] ? (
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-gold" />
                <span>{content["contact_hours"]}</span>
              </li>
            ) : null}
          </ul>
          <Button asChild variant="whatsapp" className="mt-5">
            <a href={waLink("informasi paket umrah")} target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" />
              Chat WhatsApp
            </a>
          </Button>
          <nav className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <a key={link.hash} href={link.hash} className="text-muted-foreground hover:text-gold">
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold text-gold">Lokasi Kantor</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-gold/30">
            <iframe
              title="Lokasi kantor Sultan Haramain Gresik"
              src={SITE.mapsEmbed}
              loading="lazy"
              className="h-56 w-full"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-border/60 px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
        <p>
          {SITE.company} ({SITE.branch}) &middot; No. Izin PPIU {SITE.ppiu}
        </p>
        <p className="mt-1">
          &copy; {new Date().getFullYear()} Sultan Haramain Gresik. Seluruh hak cipta dilindungi.{" "}
          <Link to="/auth" className="hover:text-gold">
            Login Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}
