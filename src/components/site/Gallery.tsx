import { Image as ImageIcon, Sparkles } from "lucide-react";

export type GalleryImage = {
  id: string;
  image_url: string;
  caption: string;
};

export function Gallery({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) return null;

  return (
    <section id="galeri" className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f3c64f] uppercase tracking-[0.2em]">
          <Sparkles className="size-3.5" />
          <span>Dokumentasi Jamaah</span>
        </div>
        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Momen Ibadah di <span className="text-gradient-gold">Tanah Suci</span>
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
          Dokumentasi perjalanan ibadah jamaah Sultan Barokah Haramain bersama pembimbing ibadah (muthawwif) di Tanah Suci Makkah dan Madinah.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <figure
            key={image.id}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0e1320]/80 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-[#f3c64f]/40"
          >
            <div className="overflow-hidden h-60 w-full">
              <img
                src={image.image_url}
                alt={image.caption || "Dokumentasi jamaah umrah Sultan Haramain Gresik"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            {image.caption ? (
              <figcaption className="p-4 text-xs font-medium text-foreground/85 border-t border-white/10 bg-[#0e1320]/90">
                {image.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  );
}
