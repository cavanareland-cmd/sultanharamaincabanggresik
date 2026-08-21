import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
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

const homeQuery = queryOptions({
  queryKey: ["home-content"],
  queryFn: () => getHomeContent(),
});

const TITLE = "Travel Umrah Gresik Resmi | Sultan Haramain";
const DESCRIPTION =
  "Paket Umrah mewah & terpercaya dari PT Sultan Barokah Haramain Cabang Gresik. Izin PPIU 04042300022560003. Hotel dekat Haramain, muthawwif berpengalaman.";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(homeQuery),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Home,
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center p-6 text-center" role="alert">
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-6">
      <p className="text-sm text-muted-foreground">Konten belum tersedia.</p>
    </div>
  ),
});

function Home() {
  const { data } = useSuspenseQuery(homeQuery);
  const content = data.content;

  return (
    <div className="min-h-screen bg-background">
      {content["announcement"] ? (
        <div className="bg-gradient-gold px-4 py-2 text-center text-xs font-semibold text-primary-foreground sm:text-sm">
          {content["announcement"]}
        </div>
      ) : null}

      <Navbar />

      <main>
        <Hero
          title={content["hero_title"] ?? "Perjalanan Ibadah Umrah Mewah, Nyaman, & Terpercaya"}
          subtitle={
            content["hero_subtitle"] ??
            `${SITE.company} ${SITE.branch} - No. Izin PPIU ${SITE.ppiu}`
          }
        />
        <PackagesSection packages={data.packages} />
        <Advantages />
        <TrustBanner />
        <Gallery images={data.gallery} />
        <Testimonials />
      </main>

      <Footer content={content} />

      <a
        href={waLink("paket umrah")}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat WhatsApp"
        className="fixed bottom-5 right-5 z-50 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-primary-foreground shadow-deep transition-transform hover:scale-105"
      >
        <MessageCircle className="size-6" />
      </a>
    </div>
  );
}
