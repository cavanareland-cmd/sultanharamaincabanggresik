import { BadgeCheck, HandCoins, Hotel, PlaneTakeoff, Users, Utensils } from "lucide-react";

const ITEMS = [
  {
    icon: BadgeCheck,
    title: "Resmi Berizin PPIU",
    body: "Terdaftar resmi Kemenag dengan No. Izin PPIU 04042300022560003 dan tercatat di SISKOPATUH.",
  },
  {
    icon: Hotel,
    title: "Hotel Dekat Haramain",
    body: "Hotel bintang 3-4 dengan jarak tempuh singkat ke Masjidil Haram & Masjid Nabawi.",
  },
  {
    icon: PlaneTakeoff,
    title: "Maskapai Terbaik",
    body: "Saudia, Emirates, Qatar Airways, Turkish Airlines, dan Garuda Indonesia.",
  },
  {
    icon: Users,
    title: "Muthawwif Berpengalaman",
    body: "Pembimbing ibadah berpengalaman mendampingi jamaah dari keberangkatan hingga kepulangan.",
  },
  {
    icon: Utensils,
    title: "Menu Indonesia 3x Sehari",
    body: "Katering cita rasa Nusantara agar ibadah tetap nyaman dan bertenaga.",
  },
  {
    icon: HandCoins,
    title: "Pembayaran Fleksibel",
    body: "DP mulai Rp 5 Juta dan opsi pembiayaan syariah melalui AMITRA.",
  },
];

export function Advantages() {
  return (
    <section id="keunggulan" className="border-y border-border/60 bg-surface/50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          Keunggulan <span className="text-gradient-gold">Sultan Haramain Gresik</span>
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Pengalaman ibadah premium dengan pelayanan penuh amanah untuk jamaah Gresik dan sekitarnya.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-border/70 bg-gradient-surface p-6 shadow-deep"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-xl border border-gold/40 bg-background/60 text-gold">
                <item.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
