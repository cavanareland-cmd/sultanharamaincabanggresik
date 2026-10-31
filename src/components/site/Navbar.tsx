import { Link } from "@tanstack/react-router";
import { Menu, MessageCircle } from "lucide-react";
import { useState } from "react";

import logoAsset from "@/assets/logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS, SITE, waLink } from "@/lib/site";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sh-navbar sticky top-0 z-50">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Sultan Haramain Gresik — Beranda">
          <img src={logoAsset.url} alt="Logo Sultan Haramain Gresik" width={58} height={58} className="h-12 w-12 object-contain sm:h-14 sm:w-14" />
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold tracking-wide text-white sm:text-xl">Sultan Haramain</span>
            <span className="block text-xs font-semibold text-gold">Cabang Gresik</span>
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-1 rounded-full border border-white/20 bg-black/35 p-1.5 shadow-2xl backdrop-blur-xl lg:flex">
          {NAV_LINKS.filter((link) => link.label !== "Badal Umroh" && link.label !== "Keunggulan" && link.label !== "Testimoni" && link.label !== "Karir").map((link) => (
            <a key={link.href} href={link.href} className="rounded-full px-4 py-2.5 text-[13px] font-medium text-white/85 transition hover:bg-white/10 hover:text-gold">
              {link.label}
            </a>
          ))}
          <Link to="/badal-umroh" className="rounded-full px-4 py-2.5 text-[13px] font-medium text-white/85 transition hover:bg-white/10 hover:text-gold">Badal Umroh</Link>
          <Link to="/karir" className="rounded-full px-4 py-2.5 text-[13px] font-medium text-white/85 transition hover:bg-white/10 hover:text-gold">Karir</Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="outlineGold" size="icon" className="hidden rounded-full border-white/25 bg-black/30 text-white hover:bg-white/10 sm:inline-flex" aria-label="Hubungi melalui WhatsApp">
            <a href={waLink("informasi paket umrah")} target="_blank" rel="noreferrer"><MessageCircle className="size-4" /></a>
          </Button>
          <Button asChild variant="gold" size="sm" className="hidden rounded-full sm:inline-flex">
            <a href={waLink("konsultasi paket umrah")} target="_blank" rel="noreferrer">Hubungi Kami</a>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outlineGold" size="icon" className="rounded-full border-white/25 bg-black/30 text-white hover:bg-white/10 lg:hidden" aria-label="Buka menu"><Menu className="size-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[84vw] border-white/10 bg-[#10151d] text-white sm:w-80">
              <SheetTitle className="font-display text-xl text-gold">Sultan Haramain · Gresik</SheetTitle>
              <nav aria-label="Navigasi mobile" className="mt-7 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  link.href.startsWith("/") && !link.href.startsWith("/#") ? (
                    <Link key={link.href} to={link.href as "/badal-umroh" | "/karir"} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm text-white/85 hover:bg-white/10 hover:text-gold">{link.label}</Link>
                  ) : (
                    <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm text-white/85 hover:bg-white/10 hover:text-gold">{link.label}</a>
                  )
                ))}
              </nav>
              <Button asChild variant="gold" className="mt-7 w-full"><a href={waLink("konsultasi paket umrah")} target="_blank" rel="noreferrer"><MessageCircle className="size-4" /> Hubungi Kami</a></Button>
              <p className="mt-5 text-xs text-white/45">{SITE.phoneDisplay}</p>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
