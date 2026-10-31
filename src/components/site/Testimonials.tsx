import { CheckCircle2, MessageSquareQuote, Sparkles, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "H. Abdul Rahman",
    city: "Kebomas, Gresik",
    program: "Paket Milad 12 Hari",
    text: "Alhamdulillah pelayanan Sultan Haramain sangat memuaskan dan amanah. Hotel dekat sekali dengan Masjidil Haram, muthawwif sabar membimbing ibadah keluarga kami sampai tuntas.",
    rating: 5,
  },
  {
    name: "Hj. Siti Aminah",
    city: "Manyar, Gresik",
    program: "Paket November Harmoni",
    text: "Dari bimbingan manasik di Gresik sampai kepulangan ke tanah air semua tertata rapi. Katering masakan Indonesia cocok sekali di lidah, ibadah jadi terasa sangat khusyuk dan nyaman.",
    rating: 5,
  },
  {
    name: "Bapak Yusuf Hidayat",
    city: "Surabaya",
    program: "Paket Umrah Plus Dubai",
    text: "Ikut paket plus keliling kota Dubai, jadwal pesawat dan visa terbit tepat waktu. Komunikasi staf kantor cabang Gresik sangat responsif dan ramah. Insya Allah berangkat lagi bersama Sultan Haramain.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimoni" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="max-w-2xl">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f3c64f] uppercase tracking-[0.2em]">
          <Sparkles className="size-3.5" />
          <span>Pengalaman Nyata Jamaah</span>
        </div>
        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Testimoni & <span className="text-gradient-gold">Kisah Jamaah Kami</span>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Kepuasan dan kekhusyukan ibadah jamaah adalah amanah terbesar yang senantiasa kami jaga.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((item) => (
          <figure
            key={item.name}
            className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0e1320]/80 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-[#f3c64f]/40 hover:-translate-y-1"
          >
            <div>
              {/* Star Rating & Program Tag */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-[#f3c64f]" aria-label="Rating 5 dari 5 bintang">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                  {item.program}
                </span>
              </div>

              {/* Quote text */}
              <blockquote className="mt-4 text-xs sm:text-sm leading-relaxed text-foreground/90 font-sans italic">
                "{item.text}"
              </blockquote>
            </div>

            {/* Author Footer */}
            <figcaption className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <div>
                <span className="block font-display text-base font-bold text-white">
                  {item.name}
                </span>
                <span className="block text-[11px] text-muted-foreground">{item.city}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-medium text-[#25D366]">
                <CheckCircle2 className="size-3.5" />
                <span>Terverifikasi</span>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
