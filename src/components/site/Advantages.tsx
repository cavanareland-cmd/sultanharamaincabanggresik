import {
  BadgeCheck,
  HandCoins,
  Hotel,
  PlaneTakeoff,
  Sparkles,
  Users,
  Utensils,
} from "lucide-react";

const ITEMS = [
  {
    icon: BadgeCheck,
    title: "Resmi Berizin PPIU",
    body: "Terdaftar resmi di Kemenag RI dengan No. Izin PPIU 04042300022560003 dan terverifikasi SISKOPATUH.",
  },
  {
    icon: Hotel,
    title: "Hotel Dekat Masjidil Haram",
    body: "Akomodasi bintang 3-4 dengan akses jalan kaki yang dekat ke pelataran Masjidil Haram & Masjid Nabawi.",
  },
  {
    icon: PlaneTakeoff,
    title: "Maskapai Internasional Terbaik",
    body: "Penerbangan terpercaya: Saudia, Emirates, Qatar Airways, Turkish Airlines, dan Garuda Indonesia.",
  },
  {
    icon: Users,
    title: "Muthawwif Khusus & Berpengalaman",
    body: "Dibimbing langsung oleh asatidz dan muthawwif profesional dari manasik hingga tawaf wada'.",
  },
  {
    icon: Utensils,
    title: "Katering Masakan Nusantara",
    body: "Sajian menu Indonesia 3 kali sehari disesuaikan dengan selera jamaah agar stamina ibadah tetap prima.",
  },
  {
    icon: HandCoins,
    title: "Kemudahan Pembayaran Syariah",
    body: "Uang muka (DP) ringan mulai Rp 5 Juta serta fasilitas pembiayaan syariah aman melalui mitra resmi AMITRA.",
  },
];

export function Advantages() {
  return (
    <section id="keunggulan" className="relative border-y border-white/[0.08] bg-[#080c14]/90 py-20 lg:py-28 overflow-hidden">
      {/* Background ambient light */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 h-80 w-80 rounded-full bg-[#f3c64f]/5 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f3c64f] uppercase tracking-[0.2em]">
            <Sparkles className="size-3.5" />
            <span>Standar Layanan Unggulan</span>
          </div>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Kenapa Memilih <span className="text-gradient-gold">Sultan Haramain Gresik?</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Komitmen kami menghadirkan pelayanan ibadah Umrah berkelas dengan jaminan kepastian, kenyamanan, dan bimbingan syar'i untuk jamaah Kabupaten Gresik dan sekitarnya.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item, idx) => (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0e1320]/80 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-[#f3c64f]/40 hover:bg-[#111726]/90"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#f3c64f] shadow-inner transition-transform group-hover:scale-105 group-hover:bg-[#f3c64f]/15">
                  <item.icon className="size-6" />
                </span>
                <span className="font-mono text-xs font-semibold text-muted-foreground/40 group-hover:text-[#f3c64f]/60 transition-colors">
                  0{idx + 1}
                </span>
              </div>

              <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-white group-hover:text-[#f3c64f] transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
