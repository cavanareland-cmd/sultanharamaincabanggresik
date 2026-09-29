import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Award,
  Check,
  ChevronRight,
  Facebook,
  Instagram,
  Menu,
  MessageCircle,
  Music2,
  Play,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import heroImage from "@/assets/hero-haramain.jpg";
import logoAsset from "@/assets/logo.png.asset.json";
import { Reveal } from "@/components/site/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SITE, waLink } from "@/lib/site";

const TITLE = "Badal Umroh Gresik Terpercaya | Sultan Haramain";
const DESCRIPTION =
  "Layanan Badal Umroh terpercaya untuk keluarga yang telah wafat atau uzur. Sertifikat eksklusif, video pelaksanaan, dan satu jiwa untuk satu pelaksanaan.";
const CANONICAL = `${SITE.url}/badal-umroh`;

const SECTION_LINKS = [
  { label: "Apa Itu Badal Umroh?", href: "#pengertian" },
  { label: "Dalil", href: "#dalil" },
  { label: "Fasilitas", href: "#fasilitas" },
  { label: "Syarat", href: "#syarat" },
  { label: "Harga", href: "#harga" },
] as const;

const FACILITIES = [
  {
    icon: Award,
    title: "Sertifikat Eksklusif",
    description: "Sertifikat Badal Umroh eksklusif sebagai dokumentasi pelaksanaan ibadah.",
  },
  {
    icon: Play,
    title: "Video Pelaksanaan",
    description: "Cuplikan video saat pelaksanaan ibadah Badal Umroh di Tanah Suci.",
  },
  {
    icon: UserRound,
    title: "Satu Jiwa, Satu Pelaksanaan",
    description: "Setiap pelaksanaan hanya membadalkan satu jiwa, sesuai tuntunan syariat.",
  },
] as const;

const FAQS = [
  {
    question: "Kapan pelaksanaan Badal Umroh dilakukan?",
    answer:
      "Jadwal pelaksanaan akan diinformasikan oleh admin setelah data dan pembayaran terverifikasi.",
  },
  {
    question: "Apakah video pelaksanaan akan dikirimkan secara langsung?",
    answer:
      "Dokumentasi video akan dikirimkan kepada keluarga setelah pelaksanaan selesai dan berkas telah diproses.",
  },
  {
    question: "Bagaimana cara pembayarannya?",
    answer:
      "Admin akan mengirimkan informasi rekening resmi perusahaan. Jangan melakukan pembayaran ke rekening pribadi.",
  },
] as const;

export const Route = createFileRoute("/badal-umroh")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Layanan Badal Umroh",
          description: DESCRIPTION,
          provider: {
            "@type": "TravelAgency",
            name: `${SITE.company} - ${SITE.branch}`,
            telephone: `+${SITE.phoneIntl}`,
            url: SITE.url,
          },
          areaServed: "Gresik, Jawa Timur",
          offers: {
            "@type": "Offer",
            price: 1500000,
            priceCurrency: "IDR",
            url: CANONICAL,
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }),
      },
    ],
  }),
  component: BadalUmrohPage,
});

function BadalUmrohPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const registerLink = waLink("pendaftaran Badal Umroh");

  return (
    <div className="badal-light min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Sultan Haramain Gresik">
            <img
              src={logoAsset.url}
              alt="Logo Sultan Haramain Gresik"
              width={44}
              height={44}
              className="size-10 shrink-0 object-contain"
            />
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-lg font-semibold text-gradient-gold">
                SULTAN HARAMAIN
              </span>
              <span className="block text-[10px] uppercase text-muted-foreground">Cabang Gresik</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-5 xl:flex" aria-label="Navigasi Badal Umroh">
            {SECTION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-medium text-foreground/75 transition-colors hover:text-gold"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="whatsapp" size="sm" className="hidden sm:inline-flex">
              <a href={registerLink} target="_blank" rel="noreferrer">
                <MessageCircle /> Hubungi Admin
              </a>
            </Button>
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outlineGold" size="icon" className="xl:hidden" aria-label="Buka menu">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[86vw] border-border bg-surface sm:w-80">
                <SheetTitle className="font-display text-xl text-gradient-gold">BADAL UMROH</SheetTitle>
                <nav className="mt-7 flex flex-col" aria-label="Navigasi seluler Badal Umroh">
                  {SECTION_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between border-b border-border/60 py-4 text-sm font-medium text-foreground/85"
                    >
                      {link.label} <ChevronRight className="size-4 text-gold" />
                    </a>
                  ))}
                </nav>
                <Button asChild variant="whatsapp" className="mt-7 w-full">
                  <a href={registerLink} target="_blank" rel="noreferrer">
                    <MessageCircle /> Hubungi Admin
                  </a>
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        <section className="relative flex min-h-[calc(92svh-4rem)] items-end overflow-hidden pb-16 pt-24 sm:items-center sm:py-24">
          <img
            src={heroImage}
            alt="Masjidil Haram dan Ka'bah di Tanah Suci"
            width={1920}
            height={1088}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-white/65" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-white/45" aria-hidden="true" />
          <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="max-w-4xl border-l-2 border-gold pl-5 sm:pl-8">
              <p className="mb-5 inline-flex items-center gap-2 border border-gold/40 bg-background/55 px-3 py-2 text-xs font-semibold uppercase text-gold backdrop-blur-sm">
                <ShieldCheck className="size-4" /> Layanan ibadah terpercaya
              </p>
              <h1 className="max-w-4xl font-display text-4xl font-bold leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
                Tunaikan Hak Umroh Orang Tersayang Anda dengan Layanan Badal Umroh Terpercaya.
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-foreground/85 sm:text-lg">
                Wujudkan niat suci umroh untuk keluarga yang telah tiada atau uzur fisik bersama PT Sultan Barokah Haramain.
              </p>
              <Button asChild variant="gold" size="lg" className="mt-8 w-full sm:w-auto">
                <a href={registerLink} target="_blank" rel="noreferrer">
                  Daftar Badal Umroh Sekarang <ChevronRight />
                </a>
              </Button>
              <div className="mt-8 flex flex-wrap gap-3 text-xs text-foreground/80">
                <span className="border border-foreground/20 bg-background/45 px-3 py-2 backdrop-blur-sm">AMITRA Sharia Financing</span>
                <span className="border border-foreground/20 bg-background/45 px-3 py-2 backdrop-blur-sm">SISKOPATUH</span>
                <span className="border border-foreground/20 bg-background/45 px-3 py-2 backdrop-blur-sm">PPIU {SITE.ppiu}</span>
              </div>
            </div>
          </div>
        </section>

        <section id="pengertian" className="scroll-mt-20 border-b border-border/60 py-20 sm:py-28">
          <Reveal className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
            <div>
              <SectionLabel>Memahami Ibadah</SectionLabel>
              <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Apa Itu Badal Umroh?</h2>
              <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
                Badal umrah adalah ibadah umrah yang diwakilkan kepada orang lain atas nama orang yang telah meninggal dunia atau orang hidup yang sakit permanen, lumpuh, atau tua renta.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <InfoLine>Untuk keluarga yang telah wafat</InfoLine>
                <InfoLine>Untuk yang sakit permanen atau uzur</InfoLine>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden border border-gold/30 sm:aspect-[5/4] lg:aspect-[4/5]">
              <img
                src={heroImage}
                alt="Suasana Masjidil Haram sebagai gambaran pelaksanaan Badal Umroh"
                width={1920}
                height={1088}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-royal/20" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 border-r border-t border-gold/40 bg-background/90 px-5 py-4">
                <p className="font-display text-2xl font-semibold text-gold">Amanah & Sesuai Syariat</p>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="dalil" className="scroll-mt-20 bg-surface/50 py-20 sm:py-28">
          <Reveal className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="border border-gold/30 bg-background/70 p-6 shadow-deep sm:p-10 lg:p-14">
              <SectionLabel>Landasan Syariat</SectionLabel>
              <blockquote className="mt-7 font-display text-2xl leading-relaxed text-foreground sm:text-3xl">
                “Dari Abu Ruzain Al-’Uqaili, ia mendatangi Nabi Muhammad SAW dan berkata: ‘Wahai Rasulullah, sesungguhnya ayahku sudah sangat tua, tidak mampu menunaikan haji, umrah, maupun melakukan perjalanan (safar).’ Beliau bersabda: ‘Hajikanlah ayahmu dan umrahkanlah dia.’”
              </blockquote>
              <p className="mt-7 border-t border-border/60 pt-5 text-sm leading-6 text-muted-foreground">
                HR. Abu Dawud no. 1810, Tirmidzi no. 930, An-Nasa’i no. 2621; dishahihkan oleh Syaikh Al-Albani.
              </p>
            </div>
          </Reveal>
        </section>

        <section id="fasilitas" className="scroll-mt-20 py-20 sm:py-28">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <SectionLabel>Bukti Pelaksanaan</SectionLabel>
              <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Fasilitas & Pelayanan</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {FACILITIES.map((facility, index) => (
                <article key={facility.title} className="border border-border bg-surface p-6 sm:p-8">
                  <div className="flex items-start justify-between">
                    <facility.icon className="size-9 text-gold" strokeWidth={1.5} />
                    <span className="font-display text-3xl text-gold/35">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-semibold">{facility.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{facility.description}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="syarat" className="scroll-mt-20 border-y border-border/60 bg-surface/50 py-20 sm:py-28">
          <Reveal className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <SectionLabel>Proses Mudah</SectionLabel>
              <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Persyaratan Pendaftaran</h2>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">Tim kami akan mendampingi keluarga pada setiap tahap pendaftaran.</p>
            </div>
            <ol className="space-y-4">
              <Requirement number="01">Mengisi Formulir Badal Umroh.</Requirement>
              <Requirement number="02">Membayar lunas biaya Badal Umroh.</Requirement>
              <Requirement number="03">Status yang dibadalkan dalam keadaan meninggal dunia atau sakit keras/uzur.</Requirement>
            </ol>
          </Reveal>
        </section>

        <section id="harga" className="scroll-mt-20 py-20 sm:py-28">
          <Reveal className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="border border-gold/40 bg-gradient-surface p-6 text-center shadow-gold sm:p-10 lg:p-14">
              <SectionLabel>Harga & Keamanan Transaksi</SectionLabel>
              <p className="mt-7 text-sm font-semibold uppercase text-muted-foreground">Hanya</p>
              <p className="mt-2 font-display text-5xl font-bold text-gradient-gold sm:text-7xl">Rp 1.500.000</p>
              <p className="mt-2 text-lg font-semibold text-foreground/80">per jiwa</p>
              <Button asChild variant="gold" size="lg" className="mt-8 w-full sm:w-auto">
                <a href={registerLink} target="_blank" rel="noreferrer">
                  Daftar Badal Umroh <MessageCircle />
                </a>
              </Button>
              <div className="mt-10 border border-destructive/50 bg-destructive/10 p-5 text-left sm:p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 size-6 shrink-0 text-destructive" />
                  <p className="text-sm leading-7 text-foreground/90">
                    <strong>PENTING! Hati-hati terhadap penipuan.</strong> Pembayaran sah jika uang masuk melalui rekening resmi perusahaan. Pastikan pendaftaran hanya melalui kantor resmi kami.
                  </p>
                </div>
              </div>
              <p className="mx-auto mt-5 max-w-3xl text-xs leading-6 text-muted-foreground">
                Harga sewaktu-waktu bisa berubah sesuai kebijakan Arab Saudi, KSA, Indonesia, dan Dollar yang berlaku tanpa mengurangi kekhusyukan beribadah.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="border-y border-border/60 bg-surface/50 py-20 sm:py-28">
          <Reveal className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center">
              <SectionLabel>Informasi Tambahan</SectionLabel>
              <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Pertanyaan yang Sering Diajukan</h2>
            </div>
            <Accordion type="single" collapsible className="mt-10 border-t border-border">
              {FAQS.map((faq, index) => (
                <AccordionItem key={faq.question} value={`faq-${index}`}>
                  <AccordionTrigger className="py-5 text-base hover:no-underline sm:text-lg">{faq.question}</AccordionTrigger>
                  <AccordionContent className="pr-8 text-sm leading-7 text-muted-foreground sm:text-base">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </section>

        <section className="py-20 text-center sm:py-24">
          <Reveal className="mx-auto max-w-3xl px-4 sm:px-6">
            <ShieldCheck className="mx-auto size-10 text-gold" />
            <h2 className="mt-5 font-display text-4xl font-semibold sm:text-5xl">Titipkan Niat Suci dengan Tenang</h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">Hubungi admin Sultan Haramain Gresik untuk konsultasi dan proses pendaftaran Badal Umroh.</p>
            <Button asChild variant="whatsapp" size="lg" className="mt-8 w-full sm:w-auto">
              <a href={registerLink} target="_blank" rel="noreferrer"><MessageCircle /> Hubungi Admin</a>
            </Button>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-border bg-surface/70">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-semibold text-gradient-gold">PT SULTAN BAROKAH HARAMAIN</p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{SITE.branch}<br />{SITE.address}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Kontak Resmi</p>
            <a href={`tel:+${SITE.phoneIntl}`} className="mt-3 block text-sm text-muted-foreground hover:text-gold">Hotline {SITE.phoneDisplay}</a>
            <p className="mt-2 text-xs text-muted-foreground">Izin PPIU {SITE.ppiu}</p>
          </div>
          <div className="md:text-right">
            <p className="text-sm font-semibold text-foreground">Ikuti Kami</p>
            <div className="mt-3 flex gap-2 md:justify-end">
              <SocialLink href={SITE.instagram} label="Instagram"><Instagram /></SocialLink>
              <SocialLink href={SITE.tiktok} label="TikTok"><Music2 /></SocialLink>
              <SocialLink href={SITE.facebook} label="Facebook"><Facebook /></SocialLink>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">@sultanharamaingresikofficial</p>
          </div>
        </div>
        <div className="border-t border-border/60 px-4 py-5 text-center text-xs text-muted-foreground">
          © 2026 PT Sultan Barokah Haramain. Seluruh hak cipta dilindungi.
        </div>
      </footer>

      <Button asChild variant="whatsapp" size="icon" className="fixed bottom-5 right-5 z-40 size-14 rounded-full shadow-deep" aria-label="Hubungi admin melalui WhatsApp">
        <a href={registerLink} target="_blank" rel="noreferrer"><MessageCircle className="size-6" /></a>
      </Button>
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <p className="text-xs font-bold uppercase text-gold">{children}</p>;
}

function InfoLine({ children }: { children: string }) {
  return <p className="flex items-start gap-2 text-sm text-foreground/85"><Check className="mt-0.5 size-4 shrink-0 text-gold" />{children}</p>;
}

function Requirement({ number, children }: { number: string; children: string }) {
  return (
    <li className="flex gap-4 border border-border bg-background/70 p-5 sm:items-center">
      <span className="font-display text-2xl font-semibold text-gold">{number}</span>
      <p className="flex-1 text-sm leading-7 text-foreground/90 sm:text-base">{children}</p>
      <Check className="hidden size-5 shrink-0 text-gold sm:block" />
    </li>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <Button asChild variant="outlineGold" size="icon" aria-label={label}>
      <a href={href} target="_blank" rel="noreferrer">{children}</a>
    </Button>
  );
}