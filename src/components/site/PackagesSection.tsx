import { useMemo, useState } from "react";

import { PackageCard } from "@/components/site/PackageCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UmrahPackage } from "@/lib/content.functions";
import { waLink } from "@/lib/site";

const ALL = "all";

const PRICE_RANGES = [
  { value: "lt30", label: "< Rp 30 Juta", min: 0, max: 29_999_999 },
  { value: "30-36", label: "Rp 30 - 36 Juta", min: 30_000_000, max: 36_999_999 },
  { value: "gt37", label: "> Rp 37 Juta", min: 37_000_000, max: Number.MAX_SAFE_INTEGER },
];

export function PackagesSection({ packages }: { packages: UmrahPackage[] }) {
  const [month, setMonth] = useState(ALL);
  const [airline, setAirline] = useState(ALL);
  const [price, setPrice] = useState(ALL);

  const months = useMemo(
    () => Array.from(new Set(packages.map((p) => p.departure_month).filter(Boolean))),
    [packages],
  );
  const airlines = useMemo(
    () => Array.from(new Set(packages.map((p) => p.airlines).filter(Boolean))),
    [packages],
  );

  const filtered = packages.filter((pkg) => {
    if (month !== ALL && pkg.departure_month !== month) return false;
    if (airline !== ALL && pkg.airlines !== airline) return false;
    if (price !== ALL) {
      const range = PRICE_RANGES.find((r) => r.value === price);
      const value = pkg.price_numeric ?? 0;
      if (range && (value < range.min || value > range.max)) return false;
    }
    return true;
  });

  const reset = () => {
    setMonth(ALL);
    setAirline(ALL);
    setPrice(ALL);
  };

  return (
    <section id="paket" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="mb-8 rounded-2xl border border-gold/30 bg-surface/80 p-4 shadow-deep sm:p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
          Quick Filter
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger aria-label="Filter bulan">
              <SelectValue placeholder="Bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Semua Bulan</SelectItem>
              {months.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={airline} onValueChange={setAirline}>
            <SelectTrigger aria-label="Filter maskapai">
              <SelectValue placeholder="Maskapai" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Semua Maskapai</SelectItem>
              {airlines.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={price} onValueChange={setPrice}>
            <SelectTrigger aria-label="Filter harga">
              <SelectValue placeholder="Harga" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Semua Harga</SelectItem>
              {PRICE_RANGES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outlineGold" onClick={reset}>
            Reset Filter
          </Button>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Paket <span className="text-gradient-gold">Umrah Unggulan</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {filtered.length} paket tersedia &middot; harga sewaktu-waktu dapat berubah
          </p>
        </div>
        <Button asChild variant="whatsapp">
          <a href={waLink("jadwal & harga paket umrah terbaru")} target="_blank" rel="noreferrer">
            Tanya CS
          </a>
        </Button>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted-foreground">
          Tidak ada paket sesuai filter. Silakan reset filter atau tanya CS kami.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </section>
  );
}
