import { Quote, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "H. Abdul Rahman",
    city: "Gresik",
    text: "Alhamdulillah pelayanan sangat memuaskan. Hotel dekat Masjidil Haram, muthawwif sabar membimbing ibadah kami.",
  },
  {
    name: "Hj. Siti Aminah",
    city: "Manyar, Gresik",
    text: "Dari manasik sampai kepulangan semua tertata. Makanan Indonesia bikin ibadah terasa nyaman.",
  },
  {
    name: "Bapak Yusuf Hidayat",
    city: "Surabaya",
    text: "Ambil paket plus Dubai, jadwal tepat waktu dan komunikasi CS sangat responsif. Insya Allah berangkat lagi.",
  },
];

export function Testimonials() {
  return (
    <section id="testimoni" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <h2 className="font-display text-3xl font-bold sm:text-4xl">
        Testimoni <span className="text-gradient-gold">Jamaah Kami</span>
      </h2>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((item) => (
          <figure
            key={item.name}
            className="rounded-2xl border border-border/70 bg-gradient-surface p-6 shadow-deep"
          >
            <Quote className="size-6 text-gold" />
            <blockquote className="mt-3 text-sm text-foreground/85">"{item.text}"</blockquote>
            <figcaption className="mt-4 border-t border-border/60 pt-3">
              <span className="block font-semibold">{item.name}</span>
              <span className="block text-xs text-muted-foreground">{item.city}</span>
              <span className="mt-2 flex gap-0.5 text-gold" aria-label="5 dari 5 bintang">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="size-3.5 fill-current" />
                ))}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
