import { Filter, MessageCircle, RotateCcw, Sparkles } from "lucide-react";
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
    <section id="paket" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      {/* Section Header */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f3c64f] uppercase tracking-[0.2em]">
            <Sparkles className="size-3.5" />
            <span>Katalog Resmi 2026/2027</span>
          </div>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Pilihan Paket <span className="text-gradient-gold">Umrah Unggulan</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Menampilkan {filtered.length} dari {packages.length} paket ibadah Umrah dengan fasilitas hotel dekat Masjidil Haram.
          </p>
        </div>

        <Button
          asChild
          size="sm"
          className="rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 text-xs px-4"
        >
          <a href={waLink("konsultasi paket umrah terbaru")} target="_blank" rel="noreferrer">
            <MessageCircle className="size-3.5 mr-1.5 text-[#25D366]" />
            Tanya Customer Service
          </a>
        </Button>
      </div>

      {/* Floating Glass Filter Toolbar */}
      <div className="mb-10 rounded-2xl border border-white/10 bg-[#0e1320]/80 p-4 shadow-xl backdrop-blur-2xl sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#f3c64f] uppercase tracking-wider">
            <Filter className="size-3.5" />
            <span>Filter Cepat Paket</span>
          </div>
          {(month !== ALL || airline !== ALL || price !== ALL) && (
            <button
              onClick={reset}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-[#f3c64f] transition-colors"
            >
              <RotateCcw className="size-3" />
              Reset Filter
            </button>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger
              aria-label="Filter bulan"
              className="rounded-xl border-white/10 bg-black/40 text-xs text-foreground focus:ring-[#f3c64f]"
            >
              <SelectValue placeholder="Bulan Keberangkatan" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#0f1422] text-foreground">
              <SelectItem value={ALL}>Semua Bulan</SelectItem>
              {months.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={airline} onValueChange={setAirline}>
            <SelectTrigger
              aria-label="Filter maskapai"
              className="rounded-xl border-white/10 bg-black/40 text-xs text-foreground focus:ring-[#f3c64f]"
            >
              <SelectValue placeholder="Maskapai Penerbangan" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#0f1422] text-foreground">
              <SelectItem value={ALL}>Semua Maskapai</SelectItem>
              {airlines.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={price} onValueChange={setPrice}>
            <SelectTrigger
              aria-label="Filter harga"
              className="rounded-xl border-white/10 bg-black/40 text-xs text-foreground focus:ring-[#f3c64f]"
            >
              <SelectValue placeholder="Rentang Harga" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#0f1422] text-foreground">
              <SelectItem value={ALL}>Semua Rentang Harga</SelectItem>
              {PRICE_RANGES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            onClick={reset}
            className="rounded-xl border-white/15 bg-white/5 text-xs text-muted-foreground hover:bg-white/10 hover:text-foreground"
          >
            Reset Semua Filter
          </Button>
        </div>
      </div>

      {/* Package Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#0e1320]/60 p-12 text-center backdrop-blur-xl">
          <p className="font-display text-xl font-bold text-white">Tidak Ada Paket Yang Sesuai</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Coba atur ulang filter pencarian atau hubungi Customer Service kami untuk paket kustom.
          </p>
          <Button
            type="button"
            onClick={reset}
            className="mt-5 rounded-full bg-[#f3c64f] text-black font-semibold text-xs px-5"
          >
            Tampilkan Semua Paket
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </section>
  );
}
