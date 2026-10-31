import {
  CalendarDays,
  Check,
  ChevronRight,
  Compass,
  Hotel,
  MapPin,
  MessageCircle,
  PlaneTakeoff,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { UmrahPackage } from "@/lib/content.functions";
import { waLink } from "@/lib/site";

export function PackageCard({ pkg }: { pkg: UmrahPackage }) {
  const [selectedVariant, setSelectedVariant] = useState<number>(0);

  const activeVariant = pkg.variants[selectedVariant];
  const displayPrice = activeVariant ? activeVariant.price_label : pkg.price_label;

  return (
    <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0e1320]/85 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-[#f3c64f]/40 hover:shadow-[#f3c64f]/10">
      {/* Subtle Top Ambient Glow */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 h-36 w-48 rounded-full bg-[#f3c64f]/10 blur-3xl pointer-events-none transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />

      <div>
        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-1.5">
          {pkg.badges.map((badge, idx) => (
            <span
              key={badge}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${
                idx === 0
                  ? "border border-[#f3c64f]/40 bg-[#f3c64f]/15 text-[#f3c64f]"
                  : "border border-white/10 bg-white/5 text-muted-foreground"
              }`}
            >
              {badge}
            </span>
          ))}
          {pkg.duration_days && (
            <span className="ml-auto rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-mono text-muted-foreground">
              {pkg.duration_days} Hari
            </span>
          )}
        </div>

        {/* Package Title */}
        <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-white group-hover:text-[#f3c64f] transition-colors leading-snug">
          {pkg.title}
        </h3>

        {/* Pricing Display */}
        <div className="mt-3 flex items-baseline gap-2 border-b border-white/10 pb-4">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Mulai</span>
          <span className="font-display text-3xl font-extrabold text-[#f3c64f] tracking-tight">
            {displayPrice}
          </span>
          <span className="text-xs text-muted-foreground">/ jamaah</span>
        </div>

        {/* Key Itinerary Specs */}
        <div className="mt-5 space-y-2.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.03] p-2.5">
            <CalendarDays className="size-4 shrink-0 text-[#f3c64f]" />
            <div className="truncate">
              <span className="text-white/90 font-medium">Keberangkatan:</span>{" "}
              {pkg.departure_date_label || "Jadwal Reguler"}
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.03] p-2.5">
            <PlaneTakeoff className="size-4 shrink-0 text-[#f3c64f]" />
            <div className="truncate">
              <span className="text-white/90 font-medium">Penerbangan:</span>{" "}
              {pkg.airlines || "Maskapai Bintang 5"} ({pkg.departure_city || "Surabaya"})
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.03] p-2.5">
            <Hotel className="size-4 shrink-0 text-[#f3c64f] mt-0.5" />
            <div className="min-w-0 flex-1 text-[11px] leading-relaxed">
              <div>
                <span className="text-white/80 font-medium">Makkah:</span>{" "}
                {activeVariant?.hotel_makkah || pkg.hotel_makkah || "Hotel Bintang 4"}
              </div>
              <div className="mt-0.5">
                <span className="text-white/80 font-medium">Madinah:</span>{" "}
                {activeVariant?.hotel_madinah || pkg.hotel_madinah || "Hotel Bintang 4"}
              </div>
            </div>
          </div>
        </div>

        {/* Variants Selector (if package has Gold/Silver etc.) */}
        {pkg.variants.length > 0 && (
          <div className="mt-4">
            <div className="mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              Pilihan Kategori Kamar / Hotel:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {pkg.variants.map((v, idx) => (
                <button
                  key={v.name}
                  type="button"
                  onClick={() => setSelectedVariant(idx)}
                  className={`rounded-xl border p-2 text-left transition-all ${
                    selectedVariant === idx
                      ? "border-[#f3c64f]/60 bg-[#f3c64f]/10 text-white shadow-sm"
                      : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#f3c64f]">
                    <span>{v.name}</span>
                    {selectedVariant === idx && <Check className="size-3 text-[#f3c64f]" />}
                  </div>
                  <div className="text-[11px] font-semibold text-white/90 mt-0.5">
                    {v.price_label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Included Items preview */}
        {pkg.includes.length > 0 && (
          <div className="mt-4 border-t border-white/5 pt-3">
            <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
              Fasilitas Termasuk:
            </div>
            <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {pkg.includes.slice(0, 4).map((inc) => (
                <li key={inc} className="flex items-center gap-1.5 text-[11px] text-foreground/80">
                  <Check className="size-3 text-[#f3c64f] shrink-0" />
                  <span className="truncate">{inc}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {pkg.notes && (
          <p className="mt-3 text-[11px] italic text-muted-foreground/75">
            *{pkg.notes}
          </p>
        )}
      </div>

      {/* Card Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-2.5 pt-4 border-t border-white/10">
        <Button
          asChild
          className="flex-1 rounded-xl bg-gradient-to-r from-[#c59b27] via-[#f3c64f] to-[#ffd978] text-black font-bold shadow-lg shadow-[#f3c64f]/15 hover:opacity-95 text-xs h-10"
        >
          <a
            href={waLink(`pendaftaran ${pkg.title}`)}
            target="_blank"
            rel="noreferrer"
          >
            Daftar Sekarang
          </a>
        </Button>

        <Button
          asChild
          variant="outline"
          className="rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/25 text-xs h-10 px-4"
        >
          <a
            href={waLink(`tanya ketersediaan seat ${pkg.title}`)}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="size-3.5 mr-1.5 text-[#25D366]" />
            Tanya Seat
          </a>
        </Button>
      </div>
    </div>
  );
}
