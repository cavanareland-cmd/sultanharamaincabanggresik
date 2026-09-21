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

import posterAsset from "@/assets/poster-lowongan-admin-socmed-shg.png.asset.json";
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

const DEFAULT_FORMAT: ExportFormat = {
  id: "instagram-feed",
  label: "Instagram Feed",
  subtitle: "1080 × 1080 px · 1:1",
  width: 1080,
  height: 1080,
  platform: "Instagram",
  icon: Instagram,
};

const FORMATS: ExportFormat[] = [
  DEFAULT_FORMAT,
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

function posterToPng(width: number, height: number) {
  return new Promise<Blob>((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Canvas tidak tersedia di browser ini."));
        return;
      }

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);

      const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
      const renderedWidth = image.naturalWidth * scale;
      const renderedHeight = image.naturalHeight * scale;
      const x = (width - renderedWidth) / 2;
      const y = (height - renderedHeight) / 2;

      context.drawImage(image, x, y, renderedWidth, renderedHeight);

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Gagal membuat gambar PNG."));
      }, "image/png");
    };

    image.onerror = () => {
      reject(new Error("Gagal memuat template poster untuk export."));
    };

    image.src = posterAsset.url;
  });
}
export function CareerSocialExport() {
  const [selectedId, setSelectedId] = useState(DEFAULT_FORMAT.id);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const selected = useMemo(
    () => FORMATS.find((format) => format.id === selectedId) ?? DEFAULT_FORMAT,
    [selectedId],
  );

  async function handleExport() {
    setBusy(true);
    setStatus("");

    try {
      const blob = await posterToPng(selected.width, selected.height);
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
            Pilih ukuran platform, lihat preview template resmi, lalu unduh gambar PNG siap posting. Seluruh teks dan foto tetap sama pada setiap format.
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
                className="w-full max-w-[620px] overflow-hidden rounded-[1.5rem] border border-gold/20 bg-background p-2 shadow-deep"
                style={{ aspectRatio: `${selected.width} / ${selected.height}` }}
              >
                <img
                  src={posterAsset.url}
                  alt={`Preview export ${selected.label}`}
                  className="h-full w-full bg-white object-contain"
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
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Template resmi yang sama, disesuaikan tanpa memotong isi untuk setiap rasio.</p>
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
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Menggunakan poster lowongan resmi beserta seluruh teks, logo, dan foto aslinya.</p>
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
