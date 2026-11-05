import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, CalendarDays, Check, ChevronLeft, ChevronRight, Download, Image as ImageIcon, Luggage, MessageCircle, Palette, Printer, RotateCcw, Save, Search, Settings2, ShieldCheck, Sparkles, Trash2, Users, X, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { JamaahDatabase } from "@/lib/jamaah.types";
import { LabelCenterModules } from "@/components/label-center-modules";

// Reuse the managed client and session; only extend the local schema typing.
const jamaahClient = supabase as SupabaseClient<JamaahDatabase>;

export const Route = createFileRoute("/_authenticated/label-center-admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin Label Koper | Sultan Haramain" }, { name: "description", content: "Pengelolaan identitas dan label koper jamaah Sultan Haramain Gresik." }, { property: "og:title", content: "Perlengkapan Jamaah | Sultan Haramain Gresik" }, { property: "og:description", content: "Pengelolaan identitas dan label koper jamaah Sultan Haramain Gresik." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { name: "robots", content: "noindex" }] }),
  component: LabelCenterPage,
});

type Person = { id: string; name: string; number: string; leader: string; phone: string; status: string; labelColor: string; roomMakkah: string; roomMadinah: string };
const initialPeople: Person[] = [];
const colors = ["#4b210d", "#f4e8c9", "#d9ad54", "#a58acb", "#16733e", "#2789c9", "#24518b"] as const;

function LabelCenterPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("Label Koper");
  const [view, setView] = useState("Preview");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [leader, setLeader] = useState("");
  const [phone, setPhone] = useState("");
  const [roomMakkah, setRoomMakkah] = useState("");
  const [roomMadinah, setRoomMadinah] = useState("");
  const [labelColor, setLabelColor] = useState<string>("#b6a6d5");
  const [roomTitle, setRoomTitle] = useState("ROOM NUMBER");
  const previewCanvas = useRef<HTMLCanvasElement | null>(null);
  const [saved, setSaved] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(1);\n  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { if (active) setIsAdmin(false); return; }
      const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).eq("role", "admin").maybeSingle();
      if (active) setIsAdmin(Boolean(role));
      if (role && active) {
        const { data: rows, error } = await jamaahClient.from("jamaah").select("*").order("sort_order").order("full_name");
        if (error) { toast.error("Gagal memuat data jamaah: " + error.message); return; }
        if (!active) return;
        const mapped = (rows ?? []).map((row) => ({ id: row.id, name: row.full_name, number: row.label_number ?? "", leader: row.tour_leader, phone: row.whatsapp_number, status: row.label_status, labelColor: row.label_color, roomMakkah: row.room_makkah, roomMadinah: row.room_madinah }));
        setPeople(mapped);
        if (mapped[0]) { setSelectedId(mapped[0].id); setName(mapped[0].name); setNumber(mapped[0].number); setLeader(mapped[0].leader); setPhone(mapped[0].phone); setLabelColor(mapped[0].labelColor); setRoomMakkah(mapped[0].roomMakkah); setRoomMadinah(mapped[0].roomMadinah); }
      }
    });
    return () => { active = false; };
  }, []);

  const selected = people.find((person) => person.id === selectedId);
  const filtered = useMemo(() => people.filter((person) => person.name.toLowerCase().includes(search.toLowerCase()) || person.number.includes(search)), [people, search]);\n  const pageSize = 8;\n  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));\n  const visiblePeople = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const choose = (person: Person) => { setSelectedId(person.id); setName(person.name); setNumber(person.number); setLeader(person.leader); setPhone(person.phone); setLabelColor(person.labelColor); setRoomMakkah(person.roomMakkah); setRoomMadinah(person.roomMadinah); setSaved(false); };
  const cancel = () => { if (selected) choose(selected); else { setName(""); setNumber(""); setLeader(""); setPhone(""); setRoomMakkah(""); setRoomMadinah(""); setLabelColor("#b6a6d5"); } setSaved(false); toast.info("Perubahan dibatalkan."); };
  const restore = () => { setLabelColor("#b6a6d5"); setRoomTitle("ROOM NUMBER"); toast.success("Warna dan teks template dikembalikan ke default."); };
  const save = async () => {
    if (!name.trim()) { toast.error("Nama jamaah wajib diisi."); return; }
    const { data: userData } = await supabase.auth.getUser();
    const payload = { full_name: name.trim(), label_number: number.trim() || null, tour_leader: leader.trim(), whatsapp_number: phone.trim(), room_makkah: roomMakkah.trim(), room_madinah: roomMadinah.trim(), label_color: labelColor, label_status: "Selesai", updated_by: userData.user?.id ?? null };
    const result = selectedId
      ? await jamaahClient.from("jamaah").update(payload).eq("id", selectedId).select("*").single()
      : await jamaahClient.from("jamaah").insert({ ...payload, created_by: userData.user?.id ?? null }).select("*").single();
    if (result.error) { toast.error("Gagal menyimpan: " + result.error.message); return; }
    const row = result.data;
    if (!row) { toast.error("Data jamaah belum dapat dibaca kembali."); return; }
    const savedPerson: Person = { id: row.id, name: row.full_name, number: row.label_number ?? "", leader: row.tour_leader, phone: row.whatsapp_number, status: row.label_status, labelColor: row.label_color, roomMakkah: row.room_makkah, roomMadinah: row.room_madinah };
    setPeople((rows) => selectedId ? rows.map((person) => person.id === selectedId ? savedPerson : person) : [...rows, savedPerson]);
    setSelectedId(row.id); setSaved(true); toast.success("Data jamaah berhasil disimpan ke database.");
  };
  const addPerson = () => { const used = new Set(people.map((person) => Number.parseInt(person.number, 10)).filter((value) => Number.isFinite(value) && value > 0)); let next = 1; while (used.has(next)) next += 1; setSelectedId(""); setName(""); setNumber(String(next).padStart(2, "0")); setLeader(""); setPhone(""); setRoomMakkah(""); setRoomMadinah(""); setLabelColor("#b6a6d5"); setSaved(false); };\n  const removePerson = async (person: Person) => { if (!window.confirm("Hapus data jamaah " + person.name + "?")) return; const { error } = await jamaahClient.from("jamaah").delete().eq("id", person.id); if (error) { toast.error("Gagal menghapus data: " + error.message); return; } setPeople((rows) => rows.filter((row) => row.id !== person.id)); if (selectedId === person.id) { setSelectedId(""); setName(""); setNumber(""); setLeader(""); setPhone(""); setRoomMakkah(""); setRoomMadinah(""); } toast.success("Data jamaah berhasil dihapus."); };
  const renderTemplate = () => {
    const canvas = previewCanvas.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const image = new Image();
    image.src = "/assets/label-koper-template.png";
    image.onload = () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx.drawImage(image, 0, 0);
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const target = labelColor.match(/[0-9a-f]{2}/gi)?.map((v) => parseInt(v, 16)) ?? [182,166,213];
      for (let i = 0; i < pixels.data.length; i += 4) {
        const rr = pixels.data[i], gg = pixels.data[i + 1], bb = pixels.data[i + 2];
        if (bb > rr * 1.04 && bb > gg * 1.02 && rr > 135 && gg > 115 && bb > 150 && rr - gg < 45) {
          pixels.data[i] = target[0]; pixels.data[i + 1] = target[1]; pixels.data[i + 2] = target[2];
        }
      }
      ctx.putImageData(pixels, 0, 0);
      // Replace only the inner writable panel; keep the original patterned side borders,
      // gold frame, logos and decorative artwork from the supplied master image intact.
      const panel = ctx.createLinearGradient(0, 1720, 0, 2048);
      panel.addColorStop(0, "#321608");
      panel.addColorStop(0.55, "#241006");
      panel.addColorStop(1, "#180b05");
      ctx.fillStyle = panel;
      ctx.fillRect(30, 1718, 250, 330);
      ctx.strokeStyle = "rgba(207,164,91,.42)";
      ctx.lineWidth = 1;
      ctx.strokeRect(35, 1724, 240, 318);
      // Subtle geometric linework echoes the template without covering its border ornaments.
      ctx.globalAlpha = 0.16;
      ctx.strokeStyle = "#c99b50";
      for (let y = 1810; y < 2040; y += 34) {
        ctx.beginPath(); ctx.moveTo(42, y); ctx.lineTo(268, y); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "left";
      ctx.fillStyle = "#f4e5ca";
      ctx.font = "bold 17px Arial";
      ctx.fillText("BARANG INI", 43, 1753);
      ctx.fillText("MILIK :", 43, 1774);
      ctx.textAlign = "right";
      ctx.fillStyle = "#e8b95e";
      ctx.font = "bold 56px Arial";
      ctx.fillText(number || "—", 268, 1777, 108);
      ctx.textAlign = "left";
      ctx.fillStyle = "#f4e5ca";
      const nameWords = (name || "NAMA JAMAAH").trim().split(/\s+/);
      const nameLines: string[] = [];
      let nameLine = "";
      let nameFont = 28;
      const maxNameWidth = 220;
      for (const candidateSize of [28, 26, 24, 22, 20]) {
        ctx.font = "bold " + candidateSize + "px Arial";
        nameLines.length = 0;
        nameLine = "";
        for (const word of nameWords) {
          const candidate = nameLine ? nameLine + " " + word : word;
          if (ctx.measureText(candidate).width > maxNameWidth && nameLine) {
            nameLines.push(nameLine);
            nameLine = word;
          } else nameLine = candidate;
        }
        if (nameLine) nameLines.push(nameLine);
        nameFont = candidateSize;
        if (nameLines.length <= 3) break;
      }
      ctx.font = "bold " + nameFont + "px Arial";
      const nameStartY = 1835;
      const nameLineHeight = Math.min(34, nameFont + 7);
      nameLines.slice(0, 3).forEach((text, index) => ctx.fillText(text, 43, nameStartY + index * nameLineHeight));
      const footerY = Math.max(1944, nameStartY + Math.min(nameLines.length, 3) * nameLineHeight + 12);
      ctx.strokeStyle = "#c99b50";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(43, footerY); ctx.lineTo(268, footerY); ctx.stroke();
      ctx.fillStyle = "#f4e5ca";
      ctx.font = "bold 13px Arial";
      ctx.textAlign = "left";
      ctx.fillText("TL : " + (leader || "—"), 43, footerY + 28, 225);
      ctx.font = "bold 14px Arial";
      ctx.fillText("☎ " + (phone || "—"), 43, footerY + 62, 225);
      ctx.save();
      ctx.translate(155, 430);
      ctx.rotate(Math.PI);
      ctx.fillStyle = "#4b210d";
      ctx.font = "italic bold 18px Georgia";
      ctx.textAlign = "center";
      ctx.fillText(roomMadinah || "Madinah", 0, 0, 210);
      ctx.restore();
      ctx.save();
      ctx.translate(155, 595);
      ctx.rotate(Math.PI);
      ctx.fillStyle = "#4b210d";
      ctx.font = "italic bold 18px Georgia";
      ctx.textAlign = "center";
      ctx.fillText(roomMakkah || "Mekah", 0, 0, 210);
      ctx.restore();
      ctx.save();
      ctx.translate(155, 625);
      ctx.rotate(Math.PI);
      ctx.fillStyle = "#35190d";
      ctx.font = "bold 42px Arial";
      ctx.textAlign = "center";
      ctx.fillText(roomTitle, 0, 0, 250);
      ctx.restore();
    };
    image.onerror = () => toast.error("Template Label Koper tidak dapat dimuat.");
  };
  useEffect(() => { renderTemplate(); }, [name, number, leader, phone, roomMakkah, roomMadinah, labelColor, roomTitle, view]);

  const download = () => {
    const canvas = previewCanvas.current;
    if (!canvas) { toast.error("Preview template belum siap."); return; }
    const anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = "label-koper-" + (number || "jamaah") + ".png";
    anchor.click();
    toast.success("Label PNG siap cetak berhasil diunduh.");
  };
  const share = () => { const message = "Assalamu'alaikum, berikut detail label koper Umrah atas nama " + name + ", nomor " + number + ". Kontak: " + phone; window.open("https://wa.me/?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer"); };

  if (isAdmin === null) return <div className="flex min-h-screen items-center justify-center bg-[#faf6f3] text-sm text-[#65402d]">Memeriksa akses admin...</div>;
  if (!isAdmin) return <div className="flex min-h-screen items-center justify-center bg-[#faf6f3] px-5 text-center"><div className="rounded-2xl border border-[#e6d6c5] bg-white p-8"><ShieldCheck className="mx-auto size-10 text-[#8b5b24]"/><h1 className="mt-3 text-xl font-bold text-[#45230f]">Akses khusus admin</h1><p className="mt-2 text-sm text-[#806b5e]">Masuk menggunakan akun admin Sultan Haramain.</p><Link to="/auth" className="mt-5 inline-flex rounded-xl bg-[#155c35] px-5 py-3 text-sm font-semibold text-white">Masuk Admin</Link></div></div>;

  const field = "mt-2 h-12 w-full rounded-xl border border-[#e7ddd7] bg-white px-4 text-sm text-[#51445b] outline-none focus:border-[#bd9149] focus:ring-2 focus:ring-[#bd9149]/15";
  const tabs = [{ label: "Label Koper", icon: Luggage }, { label: "Itinerary", icon: CalendarDays }, { label: "Panduan Umrah", icon: BookOpen }, { label: "Spanduk", icon: ImageIcon }];

  return (
    <main className="min-h-screen bg-[#faf6f3] text-[#35190d]">
      <header className="border-b border-[#eadfce] bg-white/95"><div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-3 lg:px-8"><Link to="/admin" className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-full border border-[#d7b56d] bg-[#fff8e8] text-[#81531d]"><Sparkles className="size-5"/></span><span><strong className="block text-sm tracking-wide">SULTAN BAROKAH</strong><span className="text-xs font-semibold text-[#8b6a43]">HARAMAIN · GRESIK</span></span></Link><div className="hidden items-center gap-5 text-xs font-semibold text-[#62483b] md:flex"><span>Operasional Jamaah</span><span className="text-[#b68b42]">Label & Identitas</span><Link to="/admin">Dashboard Admin</Link></div><Link to="/admin" className="rounded-full border border-[#e8d8bd] px-4 py-2 text-xs font-semibold text-[#65452e]">Kembali ke Admin</Link></div></header>
      <section className="relative isolate overflow-hidden border-b border-[#e5d6c2] bg-[#f4ece4]"><div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#faf5ed_0%,rgba(250,245,237,.96)_38%,rgba(250,245,237,.18)_100%),url('https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1800')] bg-cover bg-center"/><div className="mx-auto flex max-w-[1600px] flex-col gap-5 px-5 py-8 sm:py-10 lg:flex-row lg:items-end lg:justify-between lg:px-8"><div className="max-w-2xl"><span className="rounded-full bg-[#d5b46e] px-3 py-1 text-xs font-bold text-white">OPERASIONAL JAMAAH</span><h1 className="mt-3 font-display text-3xl font-bold leading-[1.02] text-[#47230f] sm:text-5xl">DOWNLOAD PERLENGKAPAN<br/>JAMA’AH UMRAH</h1><p className="mt-3 text-sm text-[#72594b]">Kelola label koper, nomor kamar, dan perlengkapan perjalanan jamaah dalam satu tempat.</p></div><div className="rounded-2xl border border-white/70 bg-white/85 px-5 py-4 shadow-lg backdrop-blur"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#98703b]">Jadwal Keberangkatan</p><p className="mt-1 flex items-center gap-2 font-display text-xl font-bold text-[#513327]"><CalendarDays className="size-5 text-[#a77c36]"/>17 November 2026</p></div></div></section>
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-[#f0dfc8] bg-[#fff7eb] px-4 py-3 text-[11px] font-semibold text-[#67452d]"><strong className="text-[#885a22]">Fitur Unggulan untuk Jamaah</strong><span className="inline-flex items-center gap-1"><Check className="size-4 text-emerald-700"/> Edit desain langsung</span><span className="inline-flex items-center gap-1"><Download className="size-4 text-emerald-700"/> Download PNG</span><span className="inline-flex items-center gap-1"><MessageCircle className="size-4 text-emerald-700"/> Share WhatsApp</span><span className="inline-flex items-center gap-1"><Printer className="size-4 text-emerald-700"/> Print layout</span><span className="inline-flex items-center gap-1"><ShieldCheck className="size-4 text-emerald-700"/> Data aman</span></div>
        <div className="grid items-start gap-5 xl:grid-cols-[.95fr_1.03fr_1.3fr]">
          <section className="rounded-2xl border border-[#eaded5] bg-white p-4 shadow-sm"><div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><Users className="size-5 text-[#986021]"/>Daftar Jamaah</h2><span className="text-[10px] text-[#9a8171]">Database produksi</span></div><label className="relative block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#91829a]"/><input value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} placeholder="Cari nama jamaah..." className="h-11 w-full rounded-xl border border-[#e8dfe4] pl-10 pr-3 text-sm outline-none focus:border-[#bd9149]"/></label><div className="mt-4 space-y-2">{visiblePeople.map((person) => <div key={person.id} className={"flex items-center gap-1 rounded-xl border p-1 " + (selectedId === person.id ? "border-[#c69a4d] bg-[#fffaf0] shadow-sm" : "border-[#eee7e2]")}><button onClick={() => choose(person)} className="flex min-w-0 flex-1 items-center gap-2 p-1 text-left"><span className="flex size-10 shrink-0 flex-col items-center justify-center rounded-lg border border-[#c59b50] bg-[#21140e] text-[9px] font-semibold text-[#e8c77e]">LABEL<strong className="text-base text-white">{person.number.padStart(2, "0")}</strong></span><span className="min-w-0 flex-1"><strong className="block truncate text-xs text-[#4b2d1c]">{person.name}</strong><span className="text-[10px] text-[#8b786d]">No. Label: {person.number || "Belum ada"}</span></span>{person.status === "Selesai" ? <Check className="size-4 text-emerald-600"/> : <span className="rounded-full bg-[#fff0dc] px-2 py-1 text-[9px] font-bold text-[#a65b19]">Belum</span>}</button><button type="button" onClick={() => void removePerson(person)} title={"Hapus " + person.name} aria-label={"Hapus " + person.name} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 className="size-4"/></button></div>)}</div><div className="mt-4 flex items-center justify-between border-t border-[#f0e8e1] pt-3 text-xs text-[#8a796f]"><span>{filtered.length} jamaah · Halaman {currentPage}/{pageCount}</span><span className="flex items-center gap-2"><button type="button" disabled={currentPage <= 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="rounded p-1 disabled:opacity-30" aria-label="Halaman sebelumnya"><ChevronLeft className="size-4"/></button><button type="button" disabled={currentPage >= pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} className="rounded p-1 disabled:opacity-30" aria-label="Halaman berikutnya"><ChevronRight className="size-4"/></button></span></div><button onClick={addPerson} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#d7a45c] bg-[#fffaf3] px-3 py-3 text-xs font-bold text-[#81521f]"><Download className="size-4"/>Tambah Jamaah</button></section>
          <section className="overflow-hidden rounded-2xl border border-[#eaded5] bg-white shadow-sm"><div className="grid grid-cols-2 gap-1 border-b border-[#eee4dc] bg-[#fbf8f5] p-2 sm:grid-cols-4">{tabs.map(({ label, icon: Icon }) => <button key={label} onClick={() => setTab(label)} className={"flex min-h-10 items-center justify-center gap-1 rounded-lg px-2 text-[10px] font-bold sm:text-xs " + (tab === label ? "bg-[#17613b] text-white shadow" : "text-[#65564e] hover:bg-white")}><Icon className="size-4"/>{label}</button>)}</div>{tab === "Label Koper" ? <div className="p-4 sm:p-5"><h2 className="mb-5 flex items-center gap-2 font-bold"><Settings2 className="size-5"/>Edit Data Jama’ah</h2><div className="space-y-4"><label className="block text-sm font-semibold">Nama Jama’ah<input className={field} value={name} onChange={(event) => { setName(event.target.value); setSaved(false); }}/></label><label className="block text-sm font-semibold">Nomor Label Koper<input className={field} value={number} onChange={(event) => { setNumber(event.target.value); setSaved(false); }}/></label><label className="block text-sm font-semibold">Tour Leader<input className={field} value={leader} onChange={(event) => { setLeader(event.target.value); setSaved(false); }}/></label><label className="block text-sm font-semibold">Nomor WhatsApp<input className={field} value={phone} onChange={(event) => { setPhone(event.target.value); setSaved(false); }}/></label><div className="grid grid-cols-2 gap-3"><label className="block text-sm font-semibold">Kamar Mekah<input className={field} value={roomMakkah} onChange={(event) => { setRoomMakkah(event.target.value); setSaved(false); }}/></label><label className="block text-sm font-semibold">Kamar Madinah<input className={field} value={roomMadinah} onChange={(event) => { setRoomMadinah(event.target.value); setSaved(false); }}/></label></div><div><label className="block text-sm font-semibold">Warna Background Template<input type="color" value={labelColor} onChange={(event) => { setLabelColor(event.target.value); setSaved(false); }} className="mt-2 h-12 w-full cursor-pointer rounded-xl border border-[#e7ddd7] bg-white p-1"/></label><label className="mt-4 block text-sm font-semibold">Teks Judul Room Number<input className={field} value={roomTitle} onChange={(event) => setRoomTitle(event.target.value.toUpperCase())}/></label><p className="mt-2 text-[11px] text-[#8b7769]">Hanya teks dan warna latar yang dapat disesuaikan. Ornamen, logo, bingkai, dan elemen grafis mengikuti template asli.</p></div><div className="rounded-xl bg-[#f4f7fa] px-4 py-3 text-xs leading-relaxed text-[#596b80]">ⓘ Perubahan teks akan langsung terlihat pada preview. Data tersimpan di database produksi dan hanya dapat dikelola admin.</div></div></div> : <LabelCenterModules tab={tab} isAdmin={true}/>}</section>
          <section className="min-w-0 rounded-2xl border border-[#e9e1e4] bg-[#f0edef] p-4 shadow-sm"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="font-bold">Preview</h2><div className="flex rounded-lg bg-white p-1 text-[10px] font-bold">{["Preview", "Mockup", "Cetak"].map((mode) => <button key={mode} onClick={() => setView(mode)} className={"rounded-md px-2.5 py-2 " + (view === mode ? "bg-[#17613b] text-white" : "text-[#65564e]")}>{mode}</button>)}</div></div><div className="mb-2 flex items-center justify-between gap-2 rounded-lg bg-white px-2 py-1.5"><span className="text-[10px] font-semibold text-[#786b70]">Perbesar / perkecil preview</span><div className="flex items-center gap-1"><button type="button" onClick={() => setPreviewZoom((z) => Math.max(0.5, Math.round((z - 0.1) * 10) / 10))} aria-label="Zoom out" title="Zoom out" className="flex size-8 items-center justify-center rounded-md border border-[#e8dfd8] text-[#65452e] hover:bg-[#fff7eb]"><ZoomOut className="size-4"/></button><span className="w-12 text-center text-[10px] font-bold tabular-nums text-[#65452e]">{Math.round(previewZoom * 100)}%</span><button type="button" onClick={() => setPreviewZoom((z) => Math.min(2.5, Math.round((z + 0.1) * 10) / 10))} aria-label="Zoom in" title="Zoom in" className="flex size-8 items-center justify-center rounded-md border border-[#e8dfd8] text-[#65452e] hover:bg-[#fff7eb]"><ZoomIn className="size-4"/></button><button type="button" onClick={() => setPreviewZoom(1)} className="rounded-md px-2 py-2 text-[10px] font-bold text-[#17613b] hover:bg-[#f4f7f4]">Reset</button></div></div><div className="max-h-[75vh] overflow-auto rounded-lg bg-[#e8e2ed] p-3"><div className="flex min-w-max justify-center"><canvas ref={previewCanvas} className="block h-auto max-w-none rounded-md shadow-xl" style={{ width: `${310 * previewZoom}px`, aspectRatio: "310 / 2048" }}/></div></div><div className="mt-3 flex items-center justify-between text-[10px] text-[#786b70]"><span>{view === "Cetak" ? "Simulasi hasil cetak" : view === "Mockup" ? "Simulasi label pada koper" : "Desain label digital"}</span><span className="flex items-center gap-1"><Palette className="size-3"/>Live update</span></div></section>
        </div>
        <div className="sticky bottom-3 z-20 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#ead8bd] bg-white/95 p-3 shadow-xl backdrop-blur"><div className="flex flex-wrap gap-2"><button onClick={cancel} className="inline-flex items-center gap-2 rounded-xl border border-[#d9a44f] px-4 py-3 text-xs font-bold text-[#88551c]"><X className="size-4"/>Batal</button><button onClick={restore} className="inline-flex items-center gap-2 rounded-xl border border-[#d9a44f] px-4 py-3 text-xs font-bold text-[#88551c]"><RotateCcw className="size-4"/>Restore Default</button></div><div className="flex flex-wrap gap-2"><button onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-[#17613b] px-5 py-3 text-xs font-bold text-white"><Save className="size-4"/>{saved ? "Tersimpan" : "Simpan Perubahan"}</button><button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl border border-[#d9a44f] px-4 py-3 text-xs font-bold text-[#70421d]"><Printer className="size-4"/>Cetak</button><button onClick={download} className="inline-flex items-center gap-2 rounded-xl border border-[#d9a44f] px-4 py-3 text-xs font-bold text-[#70421d]"><Download className="size-4"/>Download PNG</button><button onClick={share} className="inline-flex items-center gap-2 rounded-xl bg-[#159b58] px-4 py-3 text-xs font-bold text-white"><MessageCircle className="size-4"/>Share WhatsApp</button></div></div>
        <p className="mt-4 text-center text-[10px] text-[#a18b7d]">Jamaah Identity & Label Center · Data terhubung ke Supabase produksi.</p>
      </div>
    </main>
  );
}
