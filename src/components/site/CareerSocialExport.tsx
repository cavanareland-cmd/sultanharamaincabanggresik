import { useMemo, useState } from "react";
import {
  Check,
  Download,
  Facebook,
  Image as ImageIcon,
  Instagram,
  Linkedin,
  MonitorDown,
  Smartphone,
  Sparkles,
  MapPin,
  MessageCircle,
} from "lucide-react";

import heroImage from "@/assets/hero-haramain.jpg";
import logoAsset from "@/assets/logo.png.asset.json";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";

type ExportFormat = {
  id: string;
  label: string;
  subtitle: string;
  width: number;
  height: number;
  platform: "Instagram" | "Facebook" | "LinkedIn" | "TikTok";
  icon: typeof Instagram;
};

const FORMATS: ExportFormat[] = [
  {
    id: "instagram-feed",
    label: "Instagram Feed",
    subtitle: "1080 × 1080 px · 1:1",
    width: 1080,
    height: 1080,
    platform: "Instagram",
    icon: Instagram,
  },
  {
    id: "instagram-story",
    label: "Instagram Story",
    subtitle: "1080 × 1920 px · 9:16",
    width: 1080,
    height: 1920,
    platform: "Instagram",
    icon: Smartphone,
  },
  {
    id: "facebook",
    label: "Facebook Post",
    subtitle: "1200 × 630 px · 1.91:1",
    width: 1200,
    height: 630,
    platform: "Facebook",
    icon: Facebook,
  },
  {
    id: "linkedin",
    label: "LinkedIn Post",
    subtitle: "1200 × 627 px · 1.91:1",
    width: 1200,
    height: 627,
    platform: "LinkedIn",
    icon: Linkedin,
  },
  {
    id: "tiktok",
    label: "TikTok",
    subtitle: "1080 × 1920 px · 9:16",
    width: 1080,
    height: 1920,
    platform: "TikTok",
    icon: Smartphone,
  },
];

const RESPONSIBILITY_SUMMARY = [
  "Kelola konten media sosial",
  "Desain dasar Canva / CapCut",
  "Administrasi & laporan",
];

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapText(text: string, maxChars: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function svgToPng(svg: string, width: number, height: number) {
  return new Promise<Blob>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");

      if (!context) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas tidak tersedia di browser ini."));
        return;
      }

      context.drawImage(image, 0, 0, width, height);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Gagal membuat gambar PNG."));
      }, "image/png");
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gagal memuat aset gambar untuk export."));
    };

    image.src = url;
  });
}

function buildPosterSvg(format: ExportFormat) {
  const { width, height } = format;
  const isPortrait = height > width;
  const isSquare = width === height;
  const padding = isPortrait ? 68 : 64;
  const navy = "#0b2944";
  const navySoft = "#163d5f";
  const beige = "#f4efe4";
  const beigeSoft = "#e9dfcd";
  const gold = "#c9a24b";
  const green = "#168a4b";
  const titleSize = isPortrait ? 76 : isSquare ? 70 : 60;
  const roleSize = isPortrait ? 42 : isSquare ? 36 : 32;
  const bodySize = isPortrait ? 27 : 22;
  const photoHeight = isPortrait ? 500 : 300;
  const role = SITE.careers.role;
  const email = SITE.careers.email;
  const phone = SITE.phoneDisplay;
  const summary = [
    "Kelola konten media sosial",
    "Desain dasar Canva / CapCut",
    "Administrasi & laporan",
  ];

  const titleLines = wrapText("WE'RE HIRING", isPortrait ? 12 : 18);
  const titleY = isPortrait ? photoHeight + 118 : 122;
  const roleY = titleY + titleSize + 18;
  const roleLines = wrapText(role, isPortrait ? 24 : isSquare ? 25 : 34);
  const roleMarkup = roleLines.map((line, index) =>
    '<text x="' + padding + '" y="' + (roleY + index * (roleSize + 8)) + '" font-size="' + roleSize + '" font-weight="800" fill="' + navySoft + '">' + escapeXml(line) + '</text>'
  ).join("");
  const titleMarkup = titleLines.map((line, index) =>
    '<text x="' + padding + '" y="' + (titleY + index * (titleSize + 8)) + '" font-size="' + titleSize + '" font-weight="800" letter-spacing="' + (isPortrait ? 1 : 2) + '" fill="' + navy + '">' + escapeXml(line) + '</text>'
  ).join("");

  const companyY = roleY + roleLines.length * (roleSize + 8) + 30;
  const summaryY = companyY + 94;
  const summaryMarkup = summary.map((item, index) =>
    '<g transform="translate(' + (padding + 24) + ', ' + (summaryY + 50 + index * (bodySize + 22)) + ')"><circle cx="0" cy="-8" r="8" fill="' + gold + '"/><text x="22" y="0" font-size="' + bodySize + '" font-weight="600" fill="' + navy + '">' + escapeXml(item) + '</text></g>'
  ).join("");
  const ctaHeight = isPortrait ? 76 : 62;
  const ctaY = height - padding - ctaHeight;
  const summaryBoxY = summaryY - 30;
  const summaryBoxHeight = summary.length * (bodySize + 22) + 88;
  const footerY = summaryBoxY - 28;

  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '">'
    + '<defs>'
    + '<linearGradient id="photoShade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="' + navy + '" stop-opacity="0.10"/><stop offset="100%" stop-color="' + navy + '" stop-opacity="0.55"/></linearGradient>'
    + '</defs>'
    + '<rect width="' + width + '" height="' + height + '" fill="' + beige + '"/>'
    + '<rect x="0" y="0" width="' + width + '" height="' + photoHeight + '" fill="' + navy + '"/>'
    + '<image href="' + escapeXml(heroImage) + '" x="0" y="0" width="' + width + '" height="' + photoHeight + '" preserveAspectRatio="xMidYMid slice" opacity="0.92"/>'
    + '<rect x="0" y="0" width="' + width + '" height="' + photoHeight + '" fill="url(#photoShade)"/>'
    + '<rect x="' + padding + '" y="54" width="300" height="52" rx="26" fill="' + beige + '" opacity="0.96"/>'
    + '<image href="' + escapeXml(logoAsset.url) + '" x="' + (padding + 12) + '" y="66" width="30" height="30" preserveAspectRatio="xMidYMid meet"/>'
    + '<text x="' + (padding + 54) + '" y="86" font-size="17" font-weight="800" fill="' + navy + '">SULTAN HARAMAIN</text>'
    + '<text x="' + (padding + 54) + '" y="103" font-size="10" font-weight="700" letter-spacing="1.5" fill="' + gold + '">CABANG GRESIK</text>'
    + '<rect x="0" y="' + photoHeight + '" width="' + width + '" height="' + (height - photoHeight) + '" fill="' + beige + '"/>'
    + titleMarkup
    + roleMarkup
    + '<text x="' + padding + '" y="' + companyY + '" font-size="' + bodySize + '" font-weight="700" fill="' + navy + '">' + escapeXml(SITE.company) + ' · ' + escapeXml(SITE.branch) + '</text>'
    + '<text x="' + padding + '" y="' + (companyY + 34) + '" font-size="' + (bodySize - 3) + '" fill="' + navySoft + '">Gresik · On-site · Full-time</text>'
    + '<rect x="' + padding + '" y="' + summaryBoxY + '" width="' + (width - padding * 2) + '" height="' + summaryBoxHeight + '" rx="26" fill="' + beigeSoft + '" opacity="0.82"/>'
    + '<text x="' + (padding + 24) + '" y="' + (summaryY + 18) + '" font-size="' + (bodySize - 3) + '" font-weight="800" fill="' + navy + '">YANG AKAN ANDA KERJAKAN</text>'
    + summaryMarkup
    + '<rect x="' + padding + '" y="' + ctaY + '" width="' + (width - padding * 2) + '" height="' + ctaHeight + '" rx="' + (ctaHeight / 2) + '" fill="' + green + '"/>'
    + '<text x="' + (width / 2) + '" y="' + (ctaY + ctaHeight * 0.43) + '" text-anchor="middle" font-size="' + (isPortrait ? 24 : 20) + '" font-weight="800" fill="#ffffff">LAMAR VIA WHATSAPP · ' + escapeXml(phone) + '</text>'
    + '<text x="' + (width / 2) + '" y="' + (ctaY + ctaHeight * 0.73) + '" text-anchor="middle" font-size="' + (isPortrait ? 15 : 13) + '" fill="#eaf7ef">CV + Portofolio · ' + escapeXml(email) + '</text>'
    + '<rect x="' + padding + '" y="' + footerY + '" width="190" height="5" rx="2.5" fill="' + gold + '"/>'
    + '<text x="' + padding + '" y="' + (footerY - 10) + '" font-size="' + (isPortrait ? 18 : 15) + '" font-weight="700" fill="' + navy + '">WAJIB BERDOMISILI GRESIK</text>'
    + '</svg>';
}
export function CareerSocialExport() {
  const [selectedId, setSelectedId] = useState(FORMATS[0].id);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const selected = useMemo(
    () => FORMATS.find((format) => format.id === selectedId) ?? FORMATS[0],
    [selectedId],
  );

  const previewSvg = useMemo(() => buildPosterSvg(selected), [selected]);

  async function handleExport() {
    setBusy(true);
    setStatus("");

    try {
      const svg = buildPosterSvg(selected);
      const blob = await svgToPng(svg, selected.width, selected.height);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `sultan-haramain-karir-${selected.id}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setStatus("Gambar berhasil dibuat dan diunduh.");
    } catch {
      setStatus("Export gagal. Silakan coba lagi di browser terbaru.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="export-sosial" className="border-y border-border/60 bg-surface/50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-background/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            <ImageIcon className="size-3.5" />
            Social Media Export
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            Jadikan Lowongan <span className="text-gradient-gold">Postingan Sosial Media</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Pilih ukuran platform, lihat preview, lalu unduh gambar PNG siap posting. Tidak perlu screenshot manual dan tidak perlu aplikasi desain tambahan.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-[2rem] border border-border/70 bg-background/60 p-5 shadow-deep sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Preview</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selected.width} × {selected.height} px
                </p>
              </div>
              <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                <MonitorDown className="size-4 text-gold" />
                PNG
              </div>
            </div>

            <div className="mt-5 flex min-h-[360px] items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/20 p-4">
              <div
                className="w-full max-w-[620px] overflow-hidden rounded-[1.5rem] border border-gold/20 bg-[#071a2d] p-2 shadow-deep"
                style={{ aspectRatio: `${selected.width} / ${selected.height}` }}
              >
                <img
                  src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(previewSvg)}`}
                  alt={`Preview export ${selected.label}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-border/70 bg-background/80 p-5 shadow-deep sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gold/10 text-gold">
                <Sparkles className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold">Pilih Format</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Preset premium navy · gold · white, dioptimalkan untuk setiap rasio.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {FORMATS.map((format) => {
                const Icon = format.icon;
                const active = format.id === selected.id;

                return (
                  <button
                    key={format.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(format.id);
                      setStatus("");
                    }}
                    className={`group flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                      active
                        ? "border-gold bg-gold/10 shadow-[0_10px_30px_rgba(216,173,82,0.08)]"
                        : "border-border/70 bg-background/40 hover:-translate-y-0.5 hover:border-gold/50 hover:bg-gold/[0.04]"
                    }`}
                  >
                    <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                      active ? "bg-gold text-background" : "bg-muted text-muted-foreground"
                    }`}>
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">{format.label}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{format.subtitle}</span>
                    </span>
                    {active ? <Check className="size-5 text-gold" /> : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
                <MapPin className="mb-2 size-4 text-gold" />
                <span className="font-medium text-foreground">Gresik</span>
                <span className="mt-0.5 block">On-site · Full-time</span>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
                <MessageCircle className="mb-2 size-4 text-[#168a4b]" />
                <span className="font-medium text-foreground">WhatsApp</span>
                <span className="mt-0.5 block">Siap dibagikan</span>
              </div>
            </div>

            <Button
              type="button"
              size="lg"
              className="mt-4 w-full rounded-2xl font-semibold shadow-lg"
              onClick={handleExport}
              disabled={busy}
            >
              <Download className="size-4" />
              {busy ? "Membuat Gambar..." : "Export PNG"}
            </Button>

            {status ? (
              <p className="mt-3 text-center text-xs text-muted-foreground" role="status">
                {status}
              </p>
            ) : null}

            <div className="mt-5 rounded-2xl border border-gold/20 bg-gold/[0.04] p-4">
              <p className="text-xs font-semibold text-foreground">Preset desain</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Mengikuti referensi Adobe Express: komposisi foto + panel beige, headline besar, aksen gold, dan CTA hijau yang kontras.</p>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Export dibuat langsung di browser Anda. Data lamaran dan informasi kontak tidak dikirim ke server tambahan.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
