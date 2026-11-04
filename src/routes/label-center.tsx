import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, CalendarDays, Check, Download, Image as ImageIcon, Luggage, MessageCircle, Printer, Search, Settings2, ShieldCheck, Share2, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { JamaahDatabase } from "@/lib/jamaah.types";

type PublicJamaah = {
  id: string;
  full_name: string;
  label_number: string | null;
  tour_leader: string;
  whatsapp_number: string;
  room_makkah: string;
  room_madinah: string;
  label_color: string;
  label_status: string;
  sort_order: number;
  gender: string | null;
  room_group: string | null;
};
type Draft = { name: string; number: string; leader: string; phone: string; makkah: string; madinah: string; color: string; roomTitle: string };
const publicDb = supabase as unknown as SupabaseClient<any>;
const adminDb = supabase as SupabaseClient<JamaahDatabase>;
const palette = ["#4b210d", "#f4e8c9", "#d9ad54", "#a58acb", "#16733e", "#2789c9", "#24518b"];

export const Route = createFileRoute("/label-center")({
  ssr: false,
  head: () => ({ meta: [
    { title: "Download Perlengkapan Jamaah Umrah | Sultan Haramain Gresik" },
    { name: "description", content: "Cari dan unduh label koper serta informasi kamar jamaah Sultan Haramain Gresik." },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: PublicLabelCenterPage,
});

function PublicLabelCenterPage() {
  const [people, setPeople] = useState<PublicJamaah[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState("Label Koper");
  const [draft, setDraft] = useState<Draft>({ name: "", number: "", leader: "", phone: "", makkah: "", madinah: "", color: "#b6a6d5", roomTitle: "ROOM NUMBER" });
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const centerCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const [{ data: auth }, { data, error: queryError }] = await Promise.all([
        supabase.auth.getUser(),
        publicDb.from("jamaah_public").select("id,full_name,label_number,tour_leader,whatsapp_number,room_makkah,room_madinah,label_color,label_status,sort_order,gender,room_group").order("sort_order").order("full_name"),
      ]);
      let admin = false;
      if (auth.user) {
        const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", auth.user.id).eq("role", "admin").maybeSingle();
        admin = Boolean(role);
      }
      if (!active) return;
      setIsAdmin(admin);
      if (queryError) setError("Data jamaah belum dapat dimuat. Silakan muat ulang halaman.");
      else {
        const rows = (data ?? []) as PublicJamaah[];
        setPeople(rows);
        if (rows[0]) {
          setSelectedId(rows[0].id);
          setDraft({ name: rows[0].full_name, number: rows[0].label_number ?? "", leader: rows[0].tour_leader ?? "", phone: rows[0].whatsapp_number ?? "", makkah: rows[0].room_makkah ?? "", madinah: rows[0].room_madinah ?? "", color: rows[0].label_color || "#b6a6d5", roomTitle: "ROOM NUMBER" });
        }
      }
      setLoading(false);
    };
    void load();
    return () => { active = false; };
  }, []);

  const selected = people.find((p) => p.id === selectedId);
  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase("id");
    return people.filter((p) => !q || p.full_name.toLocaleLowerCase("id").includes(q) || (p.label_number ?? "").includes(q));
  }, [people, search]);
  const choose = (p: PublicJamaah) => {
    setSelectedId(p.id);
    setDraft({ name: p.full_name, number: p.label_number ?? "", leader: p.tour_leader ?? "", phone: p.whatsapp_number ?? "", makkah: p.room_makkah ?? "", madinah: p.room_madinah ?? "", color: p.label_color || "#b6a6d5", roomTitle: "ROOM NUMBER" });
  };
  const update = (key: keyof Draft, value: string) => setDraft((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = new Image();
    image.src = "/assets/label-koper-template.png";
    image.onload = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx.drawImage(image, 0, 0);
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const rgb = draft.color.match(/[0-9a-f]{2}/gi)?.map((v) => parseInt(v, 16)) ?? [182, 166, 213];
      for (let i = 0; i < pixels.data.length; i += 4) {
        const r = pixels.data[i], g = pixels.data[i + 1], b = pixels.data[i + 2];
        if (b > r * 1.04 && b > g * 1.02 && r > 135 && g > 115 && b > 150 && r - g < 45) {
          pixels.data[i] = rgb[0]; pixels.data[i + 1] = rgb[1]; pixels.data[i + 2] = rgb[2];
        }
      }
      ctx.putImageData(pixels, 0, 0);
      const panel = ctx.createLinearGradient(0, 1720, 0, 2048);
      panel.addColorStop(0, "#321608"); panel.addColorStop(.55, "#241006"); panel.addColorStop(1, "#180b05");
      ctx.fillStyle = panel; ctx.fillRect(30, 1718, 250, 330);
      ctx.strokeStyle = "rgba(207,164,91,.42)"; ctx.lineWidth = 1; ctx.strokeRect(35, 1724, 240, 318);
      ctx.textBaseline = "alphabetic"; ctx.textAlign = "left"; ctx.fillStyle = "#f4e5ca"; ctx.font = "bold 17px Arial";
      ctx.fillText("BARANG INI", 43, 1753); ctx.fillText("MILIK :", 43, 1774);
      ctx.textAlign = "right"; ctx.fillStyle = "#e8b95e"; ctx.font = "bold 56px Arial"; ctx.fillText(draft.number || "—", 268, 1777, 108);
      ctx.textAlign = "left"; ctx.fillStyle = "#f4e5ca";
      const words = (draft.name || "NAMA JAMAAH").trim().split(/\s+/);
      let lines: string[] = []; let fontSize = 28;
      for (const size of [28, 26, 24, 22, 20]) {
        ctx.font = "bold " + size + "px Arial"; lines = []; let line = "";
        for (const word of words) { const next = line ? line + " " + word : word; if (ctx.measureText(next).width > 220 && line) { lines.push(line); line = word; } else line = next; }
        if (line) lines.push(line); fontSize = size; if (lines.length <= 3) break;
      }
      ctx.font = "bold " + fontSize + "px Arial";
      const lineHeight = Math.min(34, fontSize + 7), nameY = 1835;
      lines.slice(0, 3).forEach((line, index) => ctx.fillText(line, 43, nameY + index * lineHeight));
      const footerY = Math.max(1944, nameY + Math.min(lines.length, 3) * lineHeight + 12);
      ctx.strokeStyle = "#c99b50"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(43, footerY); ctx.lineTo(268, footerY); ctx.stroke();
      ctx.fillStyle = "#f4e5ca"; ctx.font = "bold 13px Arial"; ctx.textAlign = "left"; ctx.fillText("TL : " + (draft.leader || "—"), 43, footerY + 28, 225);
      ctx.font = "bold 14px Arial"; ctx.fillText("☎ " + (draft.phone || "—"), 43, footerY + 62, 225);
      ctx.save(); ctx.translate(155, 430); ctx.rotate(Math.PI); ctx.fillStyle = "#4b210d"; ctx.font = "italic bold 18px Georgia"; ctx.textAlign = "center"; ctx.fillText(draft.madinah || "Madinah", 0, 0, 210); ctx.restore();
      ctx.save(); ctx.translate(155, 595); ctx.rotate(Math.PI); ctx.fillStyle = "#4b210d"; ctx.font = "italic bold 18px Georgia"; ctx.textAlign = "center"; ctx.fillText(draft.makkah || "Mekah", 0, 0, 210); ctx.restore();
      ctx.save(); ctx.translate(155, 625); ctx.rotate(Math.PI); ctx.fillStyle = "#35190d"; ctx.font = "bold 42px Arial"; ctx.textAlign = "center"; ctx.fillText(draft.roomTitle, 0, 0, 250); ctx.restore();
      const centerCanvas = centerCanvasRef.current;
      if (centerCanvas) { centerCanvas.width = canvas.width; centerCanvas.height = canvas.height; const centerCtx = centerCanvas.getContext("2d"); centerCtx?.drawImage(canvas, 0, 0); }
    };
    image.onerror = () => setError("Template label koper tidak dapat dimuat.");
  }, [draft]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a"); a.href = canvas.toDataURL("image/png"); a.download = "label-koper-" + (draft.number || "jamaah") + ".png"; a.click();
  };
  const share = () => {
    const text = "Assalamu'alaikum, berikut informasi label koper jamaah " + draft.name + ", nomor " + draft.number + ".";
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener,noreferrer");
  };
  const save = async () => {
    if (!isAdmin || !selected) return;
    setSaving(true);
    const { data: auth } = await supabase.auth.getUser();
    const { error: saveError } = await adminDb.from("jamaah").update({
      full_name: draft.name.trim(), label_number: draft.number.trim() || null, tour_leader: draft.leader.trim(),
      whatsapp_number: draft.phone.trim(), room_makkah: draft.makkah.trim(), room_madinah: draft.madinah.trim(),
      label_color: draft.color, updated_by: auth.user?.id ?? null,
    }).eq("id", selected.id);
    setSaving(false);
    if (saveError) { toast.error("Gagal menyimpan perubahan: " + saveError.message); return; }
    setPeople((rows) => rows.map((p) => p.id === selected.id ? { ...p, full_name: draft.name, label_number: draft.number || null, tour_leader: draft.leader, whatsapp_number: draft.phone, room_makkah: draft.makkah, room_madinah: draft.madinah, label_color: draft.color } : p));
    toast.success("Perubahan jamaah berhasil disimpan.");
  };

  const inputClass = "mt-2 h-12 w-full rounded-xl border border-[#eee8e4] bg-white px-4 text-sm font-semibold text-[#635b70] shadow-sm outline-none focus:border-[#c49a52] focus:ring-2 focus:ring-[#c49a52]/15 disabled:opacity-100";
  const tabs = [{ label: "Label Koper", icon: Luggage }, { label: "Itinerary", icon: CalendarDays }, { label: "Panduan Umrah", icon: BookOpen }, { label: "Spanduk", icon: ImageIcon }];

  return (
    <main className="min-h-screen bg-[#faf5f3] text-[#32190f]">
      <header className="relative overflow-hidden bg-[#f7f2ef]">
        <div className="absolute inset-y-0 right-0 w-[54%] bg-[linear-gradient(90deg,#f7f2ef_0%,rgba(247,242,239,.15)_38%,rgba(247,242,239,0)_100%),url('https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1800')] bg-cover bg-center"/>
        <div className="relative mx-auto flex min-h-[132px] max-w-[1600px] items-center px-5 py-7 sm:px-8">
          <h1 className="max-w-2xl font-display text-3xl font-extrabold leading-[1.02] tracking-wide text-[#35190d] drop-shadow-sm sm:text-4xl">DOWNLOAD PERLENGKAPAN<br/>JAMA’AH UMRAH</h1>
        </div>
      </header>
      <div className="mx-auto max-w-[1600px] px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-0 overflow-hidden rounded-xl border border-[#f0dfc8] bg-[#fff7eb] text-[10px] font-semibold text-[#67452d] shadow-sm">
            <span className="px-4 py-3">Fitur Unggulan<br/>untuk Jamaah</span>
            <span className="border-l border-[#d8bd95] px-3 py-3"><Check className="mr-1 inline size-4 text-emerald-700"/>Edit Desain<br/>Langsung</span>
            <span className="border-l border-[#d8bd95] px-3 py-3"><Download className="mr-1 inline size-4 text-emerald-700"/>Download<br/>PDF & PNG</span>
            <span className="border-l border-[#d8bd95] px-3 py-3"><Share2 className="mr-1 inline size-4 text-emerald-700"/>Share ke<br/>WhatsApp</span>
            <span className="border-l border-[#d8bd95] px-3 py-3"><Printer className="mr-1 inline size-4 text-emerald-700"/>Print Layout<br/>Profesional</span>
            <span className="border-l border-[#d8bd95] px-3 py-3"><ShieldCheck className="mr-1 inline size-4 text-emerald-700"/>Data Aman<br/>& Terpercaya</span>
          </div>
          <p className="font-display text-xl font-bold text-[#5a4036] sm:text-2xl">Keberangkatan 17 November 2026</p>
        </div>

        <div className="grid items-start gap-5 xl:grid-cols-[.92fr_1.04fr_1.35fr]">
          <section className="min-w-0">
            <h2 className="mb-6 flex items-center gap-3 px-2 text-lg font-bold text-[#4b2d1c]"><Users className="size-7 text-[#8b4e18]"/>Daftar Jamaah</h2>
            <label className="relative mb-4 block"><Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#8a8494]"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama jamaah..." className="h-11 w-full rounded-xl border border-[#e8e0e2] bg-white pl-11 pr-3 text-sm shadow-sm outline-none focus:border-[#c49a52]"/></label>
            <div className="max-h-[690px] space-y-3 overflow-y-auto pr-1">
              {loading ? <p className="py-8 text-center text-sm text-[#8b7769]">Memuat data jamaah...</p> : error ? <p className="py-8 text-center text-sm text-red-700">{error}</p> : filtered.map((person, index) => (
                <button key={person.id} onClick={() => choose(person)} className={"flex w-full items-center gap-2 rounded-xl border-2 bg-white p-1.5 text-left shadow-sm transition " + (selectedId === person.id ? "border-[#c99b50]" : "border-[#e9dfd6] hover:border-[#d4b783]")}>
                  <span className="flex size-12 shrink-0 flex-col items-center justify-center rounded-t-[18px] rounded-b-md border border-[#d9b35e] bg-[#17110d] text-[7px] font-bold text-[#e5c47c]">Label Koper<strong className="text-xl leading-5 text-white">{person.label_number || String(index + 1).padStart(2, "0")}</strong></span>
                  <span className="min-w-0 flex-1 truncate px-1 text-xs font-bold text-[#4b2d1c]">{person.full_name}</span>
                  {person.label_status === "Selesai" && <Check className="mr-2 size-4 shrink-0 text-emerald-700"/>}
                </button>
              ))}
            </div>
            <p className="mt-4 border-t border-[#eee4dc] pt-3 text-xs text-[#8a796f]">{filtered.length} dari {people.length} jamaah</p>
          </section>

          <section className="min-w-0">
            <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-white p-1.5 shadow-sm sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">
              {tabs.map(({ label, icon: Icon }) => <button key={label} onClick={() => setTab(label)} className={"flex min-h-10 items-center justify-center gap-1 rounded-lg px-2 text-[10px] font-bold " + (tab === label ? "bg-[#f5e8d4] text-[#65452e]" : "text-[#65564e] hover:bg-[#faf6f3]")}><Icon className="size-4"/>{label}</button>)}
            </div>
            {tab === "Label Koper" ? <div className="rounded-xl bg-transparent px-1 py-1">
              <h2 className="mb-5 flex items-center gap-3 text-lg font-bold text-black"><Settings2 className="size-7 fill-[#3c2416] text-[#3c2416]"/>Edit Data Jama’ah</h2>
              <div className="space-y-3.5">
                {([{ key: "name", label: "Nama Jama’ah", icon: Users }, { key: "number", label: "Nomor Label Koper", icon: Luggage }, { key: "leader", label: "Tour Leader", icon: Users }, { key: "phone", label: "Nomor Whatsapp", icon: MessageCircle }] as const).map(({ key, label, icon: Icon }) => <label key={key} className="block text-sm font-semibold text-black">{label}<span className="relative mt-2 block"><Icon className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#777086]"/><input value={draft[key]} onChange={(e) => update(key, e.target.value)} disabled={!isAdmin} className={inputClass + " pl-11"}/></span></label>)}
                <div><span className="text-sm font-semibold text-black">Warna Label</span><div className="mt-3 flex flex-wrap items-center gap-2.5 rounded-lg bg-white/70 px-3 py-2">{palette.map((color) => <button key={color} type="button" onClick={() => isAdmin && update("color", color)} disabled={!isAdmin} aria-label={"Pilih warna " + color} title={color} className={"size-6 rounded-full border border-black/10 shadow-sm " + (draft.color.toLowerCase() === color.toLowerCase() ? "ring-2 ring-[#8b6846] ring-offset-2" : "")} style={{ backgroundColor: color }}/>) }<label className="ml-1 flex items-center gap-2 text-[11px] font-semibold text-[#6c5848]">Warna khusus<input aria-label="Pilih warna background label" type="color" value={/^#[0-9a-f]{6}$/i.test(draft.color) ? draft.color : "#b6a6d5"} onChange={(e) => update("color", e.target.value)} disabled={!isAdmin} className="h-8 w-10 cursor-pointer rounded border border-[#dfd3c6] bg-white p-0.5 disabled:cursor-not-allowed"/></label><span className="text-[10px] font-semibold uppercase tracking-wide text-[#806d61]">{draft.color}</span></div></div>
                <div className="grid grid-cols-2 gap-3"><label className="block text-sm font-semibold text-black">Kamar Makkah<input value={draft.makkah} onChange={(e) => update("makkah", e.target.value)} disabled={!isAdmin} className={inputClass}/></label><label className="block text-sm font-semibold text-black">Kamar Madinah<input value={draft.madinah} onChange={(e) => update("madinah", e.target.value)} disabled={!isAdmin} className={inputClass}/></label></div>
                <p className="text-[10px] leading-relaxed text-[#806d61]">{isAdmin ? "Edit teks dan warna latar, lalu simpan perubahan." : "Informasi jamaah ditampilkan untuk seluruh pengunjung. Pengubahan data hanya tersedia bagi admin."}</p>
                {isAdmin && <button onClick={() => void save()} disabled={saving || !selected} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#17613b] to-[#0f7041] text-sm font-bold text-white shadow-lg disabled:opacity-60"><Check className="size-5"/>{saving ? "Menyimpan..." : "Simpan Perubahan"}</button>}
                <div className="grid grid-cols-2 gap-2"><button onClick={download} className="flex items-center justify-center gap-2 rounded-lg border border-[#c69a56] bg-white px-3 py-3 text-xs font-bold text-[#694a30]"><Download className="size-4"/>Download PNG</button><button onClick={share} className="flex items-center justify-center gap-2 rounded-lg bg-[#17613b] px-3 py-3 text-xs font-bold text-white"><MessageCircle className="size-4"/>Share WhatsApp</button></div>
              </div>
            </div> : <div className="min-h-80 rounded-xl bg-white p-5"><h2 className="font-bold">{tab}</h2><p className="mt-2 text-sm text-[#806d61]">Konten {tab} akan ditampilkan di modul ini.</p></div>}
          </section>

          <section className="min-w-0 rounded-2xl bg-[#eeebef] p-4 shadow-sm sm:p-5">
            <h2 className="mb-4 text-sm font-bold text-black">Preview</h2>
            <div className="grid grid-cols-3 items-start gap-2 sm:gap-3">
              <div className="overflow-hidden rounded-sm bg-white/40"><canvas ref={canvasRef} className="block h-auto w-full"/></div>
              <div className="overflow-hidden rounded-sm bg-white/40"><canvas ref={centerCanvasRef} className="block h-auto w-full"/></div>
              <div className="flex min-h-[260px] flex-col items-center justify-center rounded-sm bg-[#b6a6d5] px-2 py-5 text-center text-[#35190d]"><span className="mb-5 text-xl font-black leading-tight">{draft.roomTitle}</span><div className="mb-3 w-full rounded-xl border-4 border-[#8b5b24] bg-white px-2 py-4 font-serif text-sm italic">{draft.madinah || "Madinah"}</div><div className="w-full rounded-xl border-4 border-[#4b210d] bg-white px-2 py-4 font-serif text-sm italic">{draft.makkah || "Mekah"}</div><span className="mt-5 text-[9px] font-bold">SULTAN BAROKAH HARAMAIN</span></div>
            </div>
            <h3 className="mb-3 mt-6 text-center text-sm font-bold text-black">Contoh Penggunaan</h3>
            <div className="overflow-hidden rounded-md bg-white"><img src="/assets/label-koper-template.png" alt="Template label koper Sultan Haramain" className="mx-auto max-h-72 w-auto object-contain"/></div>
            <div className="mt-3 flex items-center justify-between gap-2 text-[10px] text-[#706777]"><span>{draft.name || "Nama jamaah"} · No. {draft.number || "-"}</span><span className="font-semibold">{selected?.room_group || "QUAD"}</span></div>
          </section>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-[#8b7769]"><Link to="/" className="font-semibold text-[#81531d]">Kembali ke Beranda</Link>{isAdmin && <Link to="/label-center-admin" className="font-semibold text-[#17613b]">Buka pengelolaan lengkap admin</Link>}<span>· {people.length} data jamaah</span></div>
      </div>
    </main>
  );
}
