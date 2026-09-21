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
  const compact = width <= 1200 && !isPortrait;
  const padding = isPortrait ? 76 : 68;
  const titleSize = isPortrait ? 82 : compact ? 64 : 70;
  const bodySize = isPortrait ? 34 : 28;
  const cardRadius = isPortrait ? 34 : 28;
  const maxTitleChars = isPortrait ? 17 : 28;
  const titleLines = wrapText("Bergabung Bersama Kami", maxTitleChars);
  const role = SITE.careers.role;

  const titleY = isPortrait ? 390 : 215;
  const imageHeight = isPortrait ? 620 : 300;
  const cardY = isPortrait ? 1060 : 350;
  const cardHeight = isPortrait ? 500 : 210;

  const titleMarkup = titleLines
    .map(
      (line, index) =>
        `<text x="${padding}" y="${titleY + index * (titleSize + 10)}" font-size="${titleSize}" font-weight="700" fill="#ffffff">${escapeXml(line)}</text>`,
    )
    .join("");

  const summaryStart = cardY + (isPortrait ? 88 : 68);
  const summaryMarkup = RESPONSIBILITY_SUMMARY.map(
    (item, index) =>
      `<g transform="translate(${padding + 12}, ${summaryStart + index * (isPortrait ? 88 : 48)})"><circle cx="0" cy="-9" r="11" fill="#d8ad52"/><text x="28" y="0" font-size="${bodySize}" fill="#17304a">${escapeXml(item)}</text></g>`,
  ).join("");

  const footerY = height - (isPortrait ? 150 : 90);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#071a2d"/>
        <stop offset="55%" stop-color="#0d3557"/>
        <stop offset="100%" stop-color="#071a2d"/>
      </linearGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#c99535"/>
        <stop offset="100%" stop-color="#f1d487"/>
      </linearGradient>
      <clipPath id="heroClip"><rect x="0" y="0" width="${width}" height="${imageHeight}" rx="0"/></clipPath>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    <image href="${escapeXml(heroImage)}" x="0" y="0" width="${width}" height="${imageHeight}" preserveAspectRatio="xMidYMid slice" opacity="0.46" clip-path="url(#heroClip)"/>
    <rect width="${width}" height="${imageHeight}" fill="#061a2d" opacity="0.38"/>
    <rect x="${padding}" y="64" width="210" height="56" rx="28" fill="#ffffff" opacity="0.12"/>
    <image href="${escapeXml(logoAsset.url)}" x="${padding + 12}" y="72" width="40" height="40" preserveAspectRatio="xMidYMid meet"/>
    <text x="${padding + 64}" y="97" font-size="20" font-weight="700" fill="#ffffff">SULTAN HARAMAIN</text>
    <text x="${padding + 64}" y="117" font-size="12" fill="#d8ad52">CABANG GRESIK</text>
    <text x="${padding}" y="${titleY - 70}" font-size="${isPortrait ? 24 : 20}" font-weight="700" letter-spacing="4" fill="#d8ad52">WE&apos;RE HIRING</text>
    ${titleMarkup}
    <text x="${padding}" y="${titleY + titleLines.length * (titleSize + 10) + 38}" font-size="${bodySize}" fill="#eef5fb">${escapeXml(role)}</text>
    <rect x="${padding}" y="${cardY}" width="${width - padding * 2}" height="${cardHeight}" rx="${cardRadius}" fill="#ffffff" opacity="0.98"/>
    <text x="${padding + 36}" y="${cardY + 54}" font-size="${isPortrait ? 26 : 24}" font-weight="700" fill="#0d3557">Posisi: ${escapeXml(role)}</text>
    ${summaryMarkup}
    <rect x="${padding + 36}" y="${cardY + cardHeight - (isPortrait ? 82 : 58)}" width="${width - padding * 2 - 72}" height="${isPortrait ? 58 : 44}" rx="22" fill="#138a4b"/>
    <text x="${width / 2}" y="${cardY + cardHeight - (isPortrait ? 43 : 29)}" text-anchor="middle" font-size="${isPortrait ? 26 : 21}" font-weight="700" fill="#ffffff">LAMAR SEKARANG · WHATSAPP ${escapeXml(SITE.phoneDisplay)}</text>
    <text x="${padding}" y="${footerY}" font-size="${isPortrait ? 22 : 18}" fill="#d9e5ee">Wajib berdomisili Gresik · On-site · Full-time</text>
    <text x="${padding}" y="${footerY + (isPortrait ? 36 : 28)}" font-size="${isPortrait ? 20 : 16}" fill="#b8cbd9">${escapeXml(SITE.url.replace("https://", ""))}/karir</text>
    <rect x="${width - padding - 190}" y="${footerY - 10}" width="190" height="4" rx="2" fill="url(#gold)"/>
  </svg>`;
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
          <div className="rounded-3xl border border-border/70 bg-background/60 p-5 shadow-deep sm:p-7">
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
                className="w-full max-w-[620px] overflow-hidden rounded-xl shadow-deep"
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

          <aside className="rounded-3xl border border-border/70 bg-background/80 p-5 shadow-deep sm:p-6">
            <h3 className="font-display text-xl font-semibold">Pilih Format</h3>
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
                    className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${
                      active
                        ? "border-gold bg-gold/10"
                        : "border-border/70 bg-background/40 hover:border-gold/50"
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

            <Button
              type="button"
              size="lg"
              className="mt-6 w-full"
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

            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              Export dibuat langsung di browser Anda. Data lamaran dan informasi kontak tidak dikirim ke server tambahan.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
