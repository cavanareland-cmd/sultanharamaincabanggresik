import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { Advantages } from "@/components/site/Advantages";
import { Footer } from "@/components/site/Footer";
import { Gallery } from "@/components/site/Gallery";
import { Hero } from "@/components/site/Hero";
import { Navbar } from "@/components/site/Navbar";
import { PackagesSection } from "@/components/site/PackagesSection";
import { Testimonials } from "@/components/site/Testimonials";
import { TrustBanner } from "@/components/site/TrustBanner";
import { getHomeContent } from "@/lib/content.functions";
import { SITE, waLink } from "@/lib/site";

const homeQuery = queryOptions({ queryKey: ["home-content"], queryFn: () => getHomeContent() });
const TITLE = "Travel Umrah Gresik Resmi | Sultan Haramain";
const DESCRIPTION = "Paket Umrah mewah & terpercaya dari PT Sultan Barokah Haramain Cabang Gresik. Izin PPIU 04042300022560003. Hotel dekat Haramain, muthawwif berpengalaman.";
const CANONICAL = `${SITE.url}/`;

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(homeQuery),
  head: ({ loaderData }) => ({
    meta: [
      { title: TITLE }, { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE }, { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: CANONICAL }, { property: "og:site_name", content: `${SITE.company} ${SITE.branch}` },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org", "@type": "TravelAgency", name: `${SITE.company} - ${SITE.branch}`,
        url: CANONICAL, telephone: `+${SITE.phoneIntl}`,
        address: { "@type": "PostalAddress", streetAddress: "Jl. Samanhudi No. 37", addressLocality: "Gresik", addressRegion: "Jawa Timur", addressCountry: "ID" },
        sameAs: [SITE.instagram, SITE.facebook, SITE.tiktok],
      }) },
      ...((loaderData?.packages ?? []).length ? [{ type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org", "@type": "ItemList", name: "Paket Umrah Sultan Haramain Gresik",
        itemListElement: (loaderData?.packages ?? []).map((pkg, index) => ({
          "@type": "ListItem", position: index + 1, item: {
            "@type": "Product", name: pkg.title,
            description: pkg.notes || [pkg.duration_days ? `${pkg.duration_days} hari` : "", pkg.departure_city ? `keberangkatan ${pkg.departure_city}` : "", pkg.hotel_makkah ? `Hotel Makkah ${pkg.hotel_makkah}` : "", pkg.hotel_madinah ? `Hotel Madinah ${pkg.hotel_madinah}` : ""].filter(Boolean).join(", "),
            url: CANONICAL, brand: { "@type": "Brand", name: `${SITE.company} ${SITE.branch}` },
            ...(pkg.price_numeric ? { offers: { "@type": "Offer", price: pkg.price_numeric, priceCurrency: "IDR", availability: "https://schema.org/InStock", url: CANONICAL } } : {}),
          },
        })),
      }) }] : []),
    ],
  }),
  component: Home,
  errorComponent: ({ error }) => <div className="flex min-h-screen items-center justify-center p-6 text-center" role="alert"><p className="text-sm text-muted-foreground">{error instanceof Error ? error.message : "Halaman tidak dapat dimuat."}</p></div>,
  notFoundComponent: () => <div className="flex min-h-screen items-center justify-center p-6"><p className="text-sm text-muted-foreground">Konten belum tersedia.</p></div>,
});

function Home() {
  const { data } = useSuspenseQuery(homeQuery);
  const content = data.content;
  return (
    <div className="dark sh-home min-h-screen bg-background text-foreground">
      {content["announcement"] ? <div className="bg-gradient-gold px-4 py-2 text-center text-xs font-semibold text-primary-foreground sm:text-sm">{content["announcement"]}</div> : null}
      <Navbar />
      <main>
        <Hero title={content["hero_title"] ?? "Perjalanan Ibadah Umrah Mewah & Bermakna"} subtitle={content["hero_subtitle"] ?? `${SITE.company} ${SITE.branch} - No. Izin PPIU ${SITE.ppiu}`} />
        <section className="border-y border-[#d9c59f]/30 bg-gradient-to-r from-[#17130f] via-[#282016] to-[#17130f] px-5 py-7 sm:py-9">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><span className="text-xs font-bold uppercase tracking-[.18em] text-[#d9b66f]">Layanan untuk Jamaah</span><h2 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">Label Koper & Informasi Kamar</h2><p className="mt-1 max-w-2xl text-sm text-white/70">Cari label koper, nomor WhatsApp, serta informasi kamar Makkah dan Madinah jamaah.</p></div>
            <Link to="/label-center" className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#d5b46e] px-6 py-3 text-sm font-bold text-[#39230e] transition hover:bg-[#e8ca88]">Buka Label Center</Link>
          </div>
        </section>
        <div className="sh-content-shell">
          <PackagesSection packages={data.packages} />
          <Advantages />
          <TrustBanner />
          <Gallery images={data.gallery} />
          <Testimonials />
        </div>
      </main>
      <Footer content={content} />
      <a href={waLink("paket umrah")} target="_blank" rel="noreferrer" aria-label="Chat WhatsApp" className="fixed bottom-5 right-5 z-50 inline-flex size-14 items-center justify-center rounded-full border border-white/20 bg-[#1fbd70] text-white shadow-deep transition-transform hover:scale-105"><MessageCircle className="size-6" /></a>
    </div>
  );
}
