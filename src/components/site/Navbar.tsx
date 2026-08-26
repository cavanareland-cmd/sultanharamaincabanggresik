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
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logoAsset.url}
            alt="Logo Sultan Haramain Gresik"
            width={48}
            height={48}
            className="h-11 w-11 object-contain"
          />
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold tracking-wide text-gradient-gold">
              SULTAN HARAMAIN
            </span>
            <span className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Cabang Gresik
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="whatsapp" size="sm" className="hidden sm:inline-flex">
            <a href={waLink("paket umrah")} target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" />
              Hubungi Kami
            </a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outlineGold" size="icon" className="lg:hidden" aria-label="Buka menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[82vw] border-border bg-surface sm:w-80">
              <SheetTitle className="font-display text-xl text-gradient-gold">
                SULTAN HARAMAIN
              </SheetTitle>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium text-foreground/85 transition-colors hover:bg-accent hover:text-gold"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 space-y-3">
                <Button asChild variant="whatsapp" className="w-full">
                  <a href={waLink("paket umrah")} target="_blank" rel="noreferrer">
                    <MessageCircle className="size-4" />
                    Hubungi Kami
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground">
                  {SITE.address}
                  <br />
                  Hotline {SITE.phoneDisplay}
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
