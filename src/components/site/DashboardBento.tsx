import {
  ArrowRight,
  Building2,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  FileCheck2,
  Headphones,
  Hotel,
  MapPin,
  MessageCircle,
  Plane,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

import type { UmrahPackage } from "@/lib/content.functions";
import { SITE, waLink } from "@/lib/site";

interface DashboardBentoProps {
  packages: UmrahPackage[];
}

export function DashboardBento({ packages }: DashboardBentoProps) {
  const [activePackageIdx, setActivePackageIdx] = useState(0);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  // Available packages or fallback
  const featured = packages.length > 0 ? packages : [
    {
      id: "pkg-1",
      title: "Umroh Premium September 2026",
      price_label: "Rp 29.900.000",
      duration_days: 12,
      hotel_makkah: "Badr Al Massa 4★",
      hotel_madinah: "Taiba Hills 4★",
      departure_city: "Surabaya & Jakarta",
    } as UmrahPackage,
  ];

  const currentPkg = featured[activePackageIdx % featured.length] || featured[0]!;

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      {/* ======================================================== */}
      {/* ROW 1: 4 METRIC STAT CARDS (Matching Template)           */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total Jamaah */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0e1320]/80 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-[#f3c64f]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#f3c64f]/15 text-[#f3c64f]">
                <Users className="size-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-medium">Total Jamaah</span>
                <div className="font-display text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
                  2.847+
                </div>
              </div>
            </div>

            {/* Sparkline Curve: Golden */}
            <div className="w-20 h-10">
              <svg viewBox="0 0 100 45" className="w-full h-full">
                <path
                  d="M0,35 Q20,38 40,25 T80,15 T100,8"
                  fill="none"
                  stroke="#f3c64f"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="8" r="3" fill="#f3c64f" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#25D366]">
            <span>&uarr; 12.5%</span>
            <span className="text-muted-foreground font-normal">musim 2026/2027</span>
          </div>
        </div>

        {/* Metric 2: Paket Tersedia */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0e1320]/80 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-[#f3c64f]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                <CalendarDays className="size-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-medium">Paket Tersedia</span>
                <div className="font-display text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
                  {packages.length || 6}
                </div>
              </div>
            </div>

            {/* Sparkline Curve: Blue */}
            <div className="w-20 h-10">
              <svg viewBox="0 0 100 45" className="w-full h-full">
                <path
                  d="M0,30 Q25,12 50,28 T100,10"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="10" r="3" fill="#38bdf8" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground">
            Paket Unggulan Terverifikasi
          </div>
        </div>

        {/* Metric 3: Rating Layanan */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0e1320]/80 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-[#f3c64f]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
                <Star className="size-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-medium">Rating Layanan</span>
                <div className="font-display text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
                  4.9<span className="text-base text-muted-foreground font-normal">/5</span>
                </div>
              </div>
            </div>

            {/* Sparkline Curve: Purple */}
            <div className="w-20 h-10">
              <svg viewBox="0 0 100 45" className="w-full h-full">
                <path
                  d="M0,35 Q20,30 45,18 T75,25 T100,8"
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="8" r="3" fill="#c084fc" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[#f3c64f]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-3 fill-current" />
            ))}
            <span className="text-[11px] text-muted-foreground ml-1.5 font-sans">
              Kepuasan Jamaah
            </span>
          </div>
        </div>

        {/* Metric 4: Layanan Support */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0e1320]/80 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-[#f3c64f]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#25D366]">
                <Headphones className="size-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-medium">Layanan Support</span>
                <div className="font-display text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
                  24/7
                </div>
              </div>
            </div>

            {/* Sparkline Curve: Green */}
            <div className="w-20 h-10">
              <svg viewBox="0 0 100 45" className="w-full h-full">
                <path
                  d="M0,28 Q30,35 60,18 T100,12"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="12" r="3" fill="#4ade80" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-[#25D366] font-medium">
            Siap Melayani Jamaah &bull; Hotline Gresik
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ROW 2: 3 MAIN CARDS (Matching Template)                  */}
      {/* 1. Paket Unggulan (Left)                                  */}
      {/* 2. Lokasi & Informasi (Center)                            */}
      {/* 3. Aktivitas Terbaru (Right)                              */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 xl:gap-5">
        {/* ---------------------------------------------------- */}
        {/* CARD 1: PAKET UNGGULAN (approx 4.5 cols on desktop)  */}
        {/* ---------------------------------------------------- */}
        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0d121e]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-2xl transition-all hover:border-[#f3c64f]/30 lg:col-span-5">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-lg bg-[#f3c64f]/20 text-[#f3c64f]">
                  <Sparkles className="size-3.5" />
                </div>
                <h3 className="font-display text-base font-bold text-white tracking-wide">
                  Paket Unggulan
                </h3>
              </div>
              <a
                href="#paket"
                className="flex items-center gap-1 text-xs font-semibold text-[#f3c64f] hover:underline"
              >
                Lihat Semua &rarr;
              </a>
            </div>

            {/* Photo Card with Kaaba Image */}
            <div className="relative mt-4 h-48 w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
              <img
                src="/src/assets/images/kaaba_thawaf_golden_1793437246304.jpg"
                alt={currentPkg.title}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white border border-white/15 backdrop-blur-md">
                  Hotel Bintang 4
                </span>
                <span className="rounded-full bg-[#f3c64f]/20 px-2.5 py-1 text-[10px] font-semibold text-[#f3c64f] border border-[#f3c64f]/30 backdrop-blur-md">
                  Pasti Berangkat
                </span>
              </div>
            </div>

            {/* Carousel Indicators (Matching Template 4 dots) */}
            <div className="mt-3 flex justify-center gap-1.5">
              {featured.slice(0, 4).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePackageIdx(idx)}
                  aria-label={`Lihat paket slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    activePackageIdx === idx ? "w-6 bg-[#f3c64f]" : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            {/* Package Details */}
            <div className="mt-3">
              <h4 className="font-display text-lg font-bold text-white tracking-wide truncate">
                {currentPkg.title}
              </h4>

              {/* Badges / Specs */}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5 text-[#f3c64f]" />
                  <span>{currentPkg.duration_days || 12} Hari</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-[#f3c64f]" />
                  <span>Madinah: {currentPkg.hotel_madinah || "Taiba Hills"}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-[#f3c64f]" />
                  <span>Makkah: {currentPkg.hotel_makkah || "Badr Al Massa"}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Pricing & Daftar Sekarang Button */}
          <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/10">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                Biaya Paket Mulai
              </span>
              <span className="font-display text-xl font-extrabold text-[#f3c64f]">
                {currentPkg.price_label}
              </span>
            </div>

            <a
              href={waLink(`pendaftaran ${currentPkg.title}`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3c64f] to-[#e6b940] px-5 py-2 text-xs font-bold text-black shadow-lg shadow-[#f3c64f]/20 hover:opacity-95 transition-transform hover:scale-105 active:scale-95"
            >
              <span>Daftar Sekarang</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* CARD 2: LOKASI & INFORMASI (approx 3.8 cols)         */}
        {/* ---------------------------------------------------- */}
        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0d121e]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-2xl transition-all hover:border-[#f3c64f]/30 lg:col-span-4">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-lg bg-[#f3c64f]/20 text-[#f3c64f]">
                  <MapPin className="size-3.5" />
                </div>
                <h3 className="font-display text-base font-bold text-white tracking-wide">
                  Lokasi &amp; Informasi
                </h3>
              </div>
            </div>

            {/* Stylized Regional / World Map Graphic */}
            <div className="relative mt-4 h-48 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#070a12] flex items-center justify-center">
              {/* Map SVG silhouette with glowing pin */}
              <svg
                viewBox="0 0 320 180"
                className="w-full h-full opacity-60"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f3c64f" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#f3c64f" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* World outlines stylized */}
                <path
                  d="M20,60 Q40,40 70,50 T120,40 T150,70 T130,120 T80,110 T30,90 Z"
                  fill="rgba(255,255,255,0.06)"
                />
                <path
                  d="M160,50 Q180,30 220,40 T270,70 T240,130 T180,110 Z"
                  fill="rgba(255,255,255,0.08)"
                />
                {/* Saudi Arabia area */}
                <path
                  d="M170,75 L195,80 L205,105 L180,115 L165,95 Z"
                  fill="rgba(243, 198, 79, 0.18)"
                  stroke="rgba(243, 198, 79, 0.4)"
                  strokeWidth="1"
                />
                {/* Indonesia / Southeast Asia */}
                <path
                  d="M250,115 Q265,120 280,125 T300,135"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Curved flight trajectory line */}
                <path
                  d="M280,125 Q235,80 185,92"
                  fill="none"
                  stroke="#f3c64f"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Glow circle behind Holy Pin */}
                <circle cx="185" cy="92" r="22" fill="url(#mapGlow)" />
              </svg>

              {/* Glowing Golden Map Pin in Center */}
              <div className="absolute top-[48%] left-[58%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="relative flex size-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#d4af37] to-[#ffd978] text-black shadow-xl shadow-[#f3c64f]/40 animate-pulse">
                  <MapPin className="size-5 fill-black" />
                </div>
              </div>
            </div>

            {/* Destination Info */}
            <div className="mt-4">
              <h4 className="font-display text-base font-bold text-white tracking-wide">
                Makkah, Arab Saudi
              </h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Tanah Suci, Destinasi Iman Kita &bull; Hotel Bintang 4 Dekat Masjidil Haram
              </p>
            </div>
          </div>

          {/* Button: Lihat Detail */}
          <div className="mt-5 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setLocationModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 py-2.5 text-xs font-semibold text-white hover:bg-white/10 hover:border-white/35 transition-all active:scale-95"
            >
              <span>Lihat Detail</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* CARD 3: AKTIVITAS TERBARU (approx 3.2 cols)          */}
        {/* ---------------------------------------------------- */}
        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0d121e]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-2xl transition-all hover:border-[#f3c64f]/30 lg:col-span-3">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-lg bg-[#f3c64f]/20 text-[#f3c64f]">
                  <Zap className="size-3.5" />
                </div>
                <h3 className="font-display text-base font-bold text-white tracking-wide">
                  Aktivitas Terbaru
                </h3>
              </div>
              <a
                href="#paket"
                className="text-xs font-semibold text-[#f3c64f] hover:underline"
              >
                Lihat Semua &rarr;
              </a>
            </div>

            {/* Activity List Items */}
            <div className="mt-5 space-y-4">
              {/* Activity 1: Pendaftaran Baru */}
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-[#f3c64f]">
                  <Plane className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate">
                    Pendaftaran umroh baru
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    2 menit yang lalu &bull; Jamaah Gresik
                  </div>
                </div>
              </div>

              {/* Activity 2: Pembayaran Berhasil */}
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/20 text-[#25D366]">
                  <Wallet className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate">
                    Pembayaran berhasil
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    5 menit yang lalu &bull; DP Seat Terkunci
                  </div>
                </div>
              </div>

              {/* Activity 3: Jadwal Keberangkatan Update */}
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
                  <Calendar className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate">
                    Jadwal keberangkatan update
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    10 menit yang lalu &bull; Tiket Saudia
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Kicker */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-center text-[11px] text-muted-foreground">
              Terhubung sistem resmi <strong className="text-white">SISKOPATUH Kemenag RI</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Detail Lokasi Makkah & Kantor Gresik */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-[#0f1422] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <MapPin className="size-5 text-[#f3c64f]" />
                <h3 className="font-display text-lg font-bold text-white">
                  Informasi Lokasi &amp; Fasilitas
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLocationModalOpen(false)}
                className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs sm:text-sm text-muted-foreground">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Compass className="size-4 text-[#f3c64f]" />
                  Makkah Al-Mukarramah
                </h4>
                <p className="mt-1 leading-relaxed">
                  Hotel Badr Al Massa / Olayan Ajyad berlokasi strategis berjarak jalan kaki singkat ke pelataran Masjidil Haram. Memudahkan jamaah melakukan thawaf, sholat berjamaah, dan ibadah sunnah setiap waktu.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Building2 className="size-4 text-[#f3c64f]" />
                  Kantor Cabang Gresik
                </h4>
                <p className="mt-1 leading-relaxed">
                  <strong>{SITE.company} ({SITE.branch})</strong>
                  <br />
                  {SITE.address}
                  <br />
                  Hotline / WhatsApp: <span className="text-[#f3c64f] font-semibold">{SITE.phoneDisplay}</span>
                  <br />
                  Izin Resmi PPIU No. {SITE.ppiu}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setLocationModalOpen(false)}
                className="rounded-full border border-white/15 px-4 py-2 text-xs text-white hover:bg-white/10"
              >
                Tutup
              </button>
              <a
                href={waLink("konsultasi lokasi kantor dan paket umrah")}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#f3c64f] px-5 py-2 text-xs font-bold text-black hover:opacity-95"
              >
                Hubungi Kami via WhatsApp &rarr;
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
