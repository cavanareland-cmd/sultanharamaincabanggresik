export type GalleryImage = {
  id: string;
  image_url: string;
  caption: string;
};

export function Gallery({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) return null;

  return (
    <section id="galeri" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Galeri</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-gradient-gold sm:text-4xl">
          Momen Jamaah Sultan Haramain
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          Dokumentasi perjalanan ibadah jamaah kami bersama tim muthawwif berpengalaman.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <figure
            key={image.id}
            className="group overflow-hidden rounded-2xl border border-border/70 bg-gradient-surface"
          >
            <img
              src={image.image_url}
              alt={image.caption || "Dokumentasi jamaah umrah Sultan Haramain Gresik"}
              loading="lazy"
              className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {image.caption ? (
              <figcaption className="px-4 py-3 text-xs text-muted-foreground">
                {image.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  );
}
