import { CalendarDays, Check, Hotel, PlaneTakeoff, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { UmrahPackage } from "@/lib/content.functions";
import { waLink } from "@/lib/site";

export function PackageCard({ pkg }: { pkg: UmrahPackage }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden border-border/70 bg-gradient-surface shadow-deep transition-transform duration-300 hover:-translate-y-1 hover:shadow-gold">
      <div className="relative h-1 w-full bg-gradient-gold" aria-hidden="true" />
      {pkg.image_url ? (
        <img
          src={pkg.image_url}
          alt={pkg.title}
          loading="lazy"
          className="h-44 w-full object-cover"
        />
      ) : null}
      <CardHeader className="gap-3 pb-2">
        <div className="flex flex-wrap gap-2">
          {pkg.badges.map((badge) => (
            <Badge key={badge} variant="gold">
              {badge}
            </Badge>
          ))}
        </div>
        <h3 className="font-display text-xl font-semibold leading-snug">{pkg.title}</h3>
        <p className="text-2xl font-bold text-gold">{pkg.price_label}</p>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 text-sm text-foreground/85">
        <ul className="space-y-2">
          <li className="flex gap-2">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-gold" />
            <span>
              {pkg.departure_date_label}
              {pkg.duration_days ? ` · ${pkg.duration_days} Hari` : ""}
            </span>
          </li>
          <li className="flex gap-2">
            <PlaneTakeoff className="mt-0.5 size-4 shrink-0 text-gold" />
            <span>
              {pkg.departure_city}
              {pkg.airlines ? ` · ${pkg.airlines}` : ""}
            </span>
          </li>
          <li className="flex gap-2">
            <Hotel className="mt-0.5 size-4 shrink-0 text-gold" />
            <span>
              Madinah: {pkg.hotel_madinah || "-"}
              <br />
              Makkah: {pkg.hotel_makkah || "-"}
            </span>
          </li>
        </ul>

        {pkg.variants.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {pkg.variants.map((variant) => (
              <div key={variant.name} className="rounded-lg border border-gold/30 bg-background/40 p-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                  {variant.name}
                </p>
                <p className="mt-1 font-semibold">{variant.price_label}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {variant.hotel_madinah} / {variant.hotel_makkah}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {pkg.includes.length > 0 ? (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Include
            </p>
            <ul className="space-y-1">
              {pkg.includes.slice(0, 5).map((item) => (
                <li key={item} className="flex gap-2 text-xs">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {pkg.excludes.length > 0 ? (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Exclude
            </p>
            <ul className="space-y-1">
              {pkg.excludes.slice(0, 3).map((item) => (
                <li key={item} className="flex gap-2 text-xs text-muted-foreground">
                  <X className="mt-0.5 size-3.5 shrink-0 text-destructive" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {pkg.notes ? <p className="text-xs italic text-muted-foreground">{pkg.notes}</p> : null}
      </CardContent>

      <CardFooter className="flex-col gap-2 sm:flex-row">
        <Button asChild variant="gold" className="w-full">
          <a href={waLink(pkg.title)} target="_blank" rel="noreferrer">
            Daftar Sekarang
          </a>
        </Button>
        <Button asChild variant="outlineGold" className="w-full">
          <a href={waLink(`${pkg.title} (pesan seat)`)} target="_blank" rel="noreferrer">
            Pesan Seat
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
