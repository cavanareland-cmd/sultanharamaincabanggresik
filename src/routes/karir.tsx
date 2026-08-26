import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { CareersLanding } from "@/components/site/CareersLanding";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { SITE, waApplyLink } from "@/lib/site";

const TITLE = `Lowongan ${SITE.careers.role} Gresik | Sultan Haramain`;
const DESCRIPTION = `Kami membuka lowongan ${SITE.careers.role} on-site di ${SITE.branch}. Wajib berdomisili Gresik. Kirim CV dan portofolio ke ${SITE.careers.email} atau WhatsApp ${SITE.phoneDisplay}.`;
const CANONICAL = `${SITE.url}/karir`;

export const Route = createFileRoute("/karir")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: CANONICAL },
      { property: "og:site_name", content: `${SITE.company} ${SITE.branch}` },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title: SITE.careers.role,
          description: DESCRIPTION,
          employmentType: "FULL_TIME",
          hiringOrganization: {
            "@type": "Organization",
            name: `${SITE.company} - ${SITE.branch}`,
            sameAs: SITE.url,
          },
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Jl. Samanhudi No. 37",
              addressLocality: "Gresik",
              addressRegion: "Jawa Timur",
              addressCountry: "ID",
            },
          },
          applicantLocationRequirements: {
            "@type": "City",
            name: "Gresik",
          },
          jobLocationType: "ON_SITE",
          directApply: true,
        }),
      },
    ],
  }),
  component: KarirPage,
});

function KarirPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <CareersLanding />
      </main>
      <Footer content={{}} />
      <a
        href={waApplyLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="Lamar via WhatsApp"
        className="fixed bottom-5 right-5 z-50 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-primary-foreground shadow-deep transition-transform hover:scale-105"
      >
        <MessageCircle className="size-6" />
      </a>
    </div>
  );
}
