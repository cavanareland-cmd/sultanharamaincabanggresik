import {
  Briefcase,
  CheckCircle2,
  ClipboardList,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Monitor,
  PenLine,
} from "lucide-react";

import heroImage from "@/assets/hero-haramain.jpg";
import { Button } from "@/components/ui/button";
import { careersMailto, SITE, waApplyLink } from "@/lib/site";

const HIGHLIGHTS = [
  {
    icon: MapPin,
    label: "Penempatan",
    text: "Kantor Cabang Gresik (Wajib berdomisili di Gresik)",
  },
  {
    icon: PenLine,
    label: "Keahlian",
    text: "Manajemen Konten Medsos & Desain Dasar (Canva/CapCut)",
  },
  {
    icon: ClipboardList,
    label: "Administrasi",
    text: "Terbiasa dengan Pengelolaan Data & Laporan Harian",
  },
];

const RESPONSIBILITIES = [
  "Mengelola dan merencanakan konten kreatif untuk seluruh platform media sosial perusahaan (Instagram, TikTok, dll.).",
  "Menjadwalkan postingan, membalas komentar serta Direct Message (DM), dan aktif berinteraksi dengan followers.",
  "Mendesain materi visual/postingan sederhana dan menyusun caption yang menarik serta persuasif.",
  "Menangani tugas-tugas administrasi kantor: input data, pembuatan laporan harian/bulanan, serta pengarsipan dokumen.",
  "Berkoordinasi erat dengan tim Marketing dan operasional untuk mengeksekusi strategi promosi.",
  "Memantau tren media sosial terkini dan menganalisis aktivitas kompetitor.",
  "Menyusun laporan performa media sosial secara berkala (mingguan dan bulanan).",
];

const REQUIREMENTS = [
  {
    highlight: true,
    text: "WAJIB berdomisili di wilayah Gresik dan sekitarnya (Filter Utama).",
  },
  {
    highlight: false,
    text: "Memiliki pengalaman minimal 1 tahun di bidang pengelolaan media sosial atau administrasi perkantoran.",
  },
  {
    highlight: false,
    text: "Paham mendalam mengenai tren media sosial terkini serta menguasai dasar-dasar desain grafis (menggunakan Canva, CapCut, atau aplikasi pendukung serupa).",
  },
  {
    highlight: false,
    text: "Memiliki kemampuan komunikasi yang baik, kreatif, teliti, dan cekatan.",
  },
  {
    highlight: false,
    text: "Mampu bekerja cepat, adaptif, mandiri, maupun dalam tim (multitasking).",
  },
  {
    highlight: false,
    text: "Terbiasa mengoperasikan Microsoft Office (Word, Excel) dan Google Drive dengan baik.",
  },
  {
    highlight: false,
    text: "Kemampuan berbahasa Inggris aktif/pasif akan menjadi nilai tambah yang sangat baik.",
  },
  {
    highlight: false,
    text: "Siap bekerja secara on-site (penuh waktu di kantor) di Kantor Cabang Gresik.",
  },
];

export function CareersLanding() {
  const applyWa = waApplyLink();
  const applyMail = careersMailto();

  return (
    <>
      <section className="relative overflow-hidden">
        <img
          src={heroImage}
          alt="Masjid Nabawi Madinah dan Masjidil Haram Makkah pada malam hari"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-night)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="max-w-3xl border-l-2 border-gold/70 pl-5 sm:pl-8">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-background/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-gold">
              <Briefcase className="size-3.5" />
              {SITE.company} - {SITE.branch}
            </p>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-gold">
              We&apos;re Hiring!
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
              <span className="text-gradient-gold">{SITE.careers.role}</span>
            </h1>
            <ul className="mt-8 space-y-3">
              {HIGHLIGHTS.map((item) => (
                <li key={item.label} className="flex gap-3 text-sm text-foreground/85 sm:text-base">
                  <item.icon className="mt-0.5 size-4 shrink-0 text-gold" />
                  <span>
                    <span className="font-semibold text-gold">{item.label}:</span> {item.text}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="whatsapp" size="lg">
                <a href={applyWa} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-4" />
                  Kirim CV & Portofolio Sekarang
                </a>
              </Button>
              <Button asChild variant="outlineGold" size="lg">
                <a href={applyMail}>
                  <Mail className="size-4" />
                  Kirim via Email
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-surface/50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Mengenal <span className="text-gradient-gold">Lebih Dekat</span>
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {SITE.company} - {SITE.branch} adalah biro perjalanan penyelenggara ibadah Umrah resmi
            dan terpercaya yang telah berizin resmi dari Kemenag RI. Kami berkomitmen untuk
            memberikan pelayanan terbaik bagi para jemaah. Saat ini, kami membuka kesempatan bagi
            talenta muda profesional yang berdomisili di Gresik untuk bergabung dan bertumbuh
            bersama tim dinamis kami.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Apa yang Akan <span className="text-gradient-gold">Anda Kerjakan?</span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Tanggung jawab utama posisi {SITE.careers.role} di {SITE.branch}.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RESPONSIBILITIES.map((task, index) => (
              <article
                key={task}
                className="rounded-2xl border border-border/70 bg-gradient-surface p-6 shadow-deep"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl border border-gold/40 bg-background/60 font-display text-lg font-semibold text-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-4 text-sm leading-relaxed text-foreground/85">{task}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-surface/50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Kualifikasi yang <span className="text-gradient-gold">Kami Cari</span>
          </h2>
          <ul className="mt-10 space-y-3">
            {REQUIREMENTS.map((item) => (
              <li
                key={item.text}
                className={
                  item.highlight
                    ? "flex gap-3 rounded-2xl border border-gold/50 bg-background/60 p-4 sm:p-5"
                    : "flex gap-3 rounded-2xl border border-border/70 bg-background/30 p-4 sm:p-5"
                }
              >
                {item.highlight ? (
                  <MapPin className="mt-0.5 size-5 shrink-0 text-gold" />
                ) : (
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold" />
                )}
                <span className="text-sm text-foreground/90 sm:text-base">
                  {item.highlight ? (
                    <span className="mr-2 inline-flex rounded-full border border-gold/40 bg-background/60 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                      Filter utama
                    </span>
                  ) : null}
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Siap Bergabung <span className="text-gradient-gold">Bersama Kami?</span>
          </h2>
          <p className="mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base">
            Kirimkan berkas lamaran lengkap berupa CV terbaru, portofolio kreatif/desain, dan pas
            foto terbaru Anda melalui:
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-border/70 bg-gradient-surface p-6 shadow-deep">
              <span className="inline-flex size-11 items-center justify-center rounded-xl border border-gold/40 bg-background/60 text-gold">
                <Mail className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">Email</h3>
              <a className="mt-2 block text-sm text-gold hover:underline" href={applyMail}>
                {SITE.careers.email}
              </a>
            </article>
            <article className="rounded-2xl border border-border/70 bg-gradient-surface p-6 shadow-deep">
              <span className="inline-flex size-11 items-center justify-center rounded-xl border border-gold/40 bg-background/60 text-gold">
                <MessageCircle className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">WhatsApp Rekrutmen</h3>
              <a
                className="mt-2 block text-sm text-gold hover:underline"
                href={applyWa}
                target="_blank"
                rel="noreferrer"
              >
                {SITE.phoneDisplay}
              </a>
              <p className="mt-2 text-xs text-muted-foreground">
                Format: LAMAR_ADMIN_GRESIK_[Nama Lengkap]
              </p>
            </article>
          </div>
          <p className="mt-6 flex gap-3 text-sm text-muted-foreground">
            <FileText className="mt-0.5 size-4 shrink-0 text-gold" />
            Hanya kandidat yang memenuhi kualifikasi (khususnya domisili Gresik) yang akan diproses
            lebih lanjut.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="whatsapp" size="lg">
              <a href={applyWa} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" />
                Lamar via WhatsApp
              </a>
            </Button>
            <Button asChild variant="gold" size="lg">
              <a href={applyMail}>
                <Monitor className="size-4" />
                Kirim Email
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
