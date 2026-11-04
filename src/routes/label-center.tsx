import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Download, ExternalLink, Luggage, MessageCircle, Search, ShieldCheck, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

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

const publicDb = supabase as unknown as SupabaseClient<any>;

export const Route = createFileRoute("/label-center")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Label Koper Jamaah | Sultan Haramain Gresik" },
      { name: "description", content: "Cari informasi label koper dan kamar jamaah Sultan Haramain Gresik." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PublicLabelCenterPage,
});

function PublicLabelCenterPage() {
  const [people, setPeople] = useState<PublicJamaah[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const [{ data: authData }, { data, error: queryError }] = await Promise.all([
        supabase.auth.getUser(),
        publicDb.from("jamaah_public").select("id,full_name,label_number,tour_leader,whatsapp_number,room_makkah,room_madinah,label_color,label_status,sort_order,gender,room_group").order("sort_order").order("full_name"),
      ]);
      let admin = false;
      if (authData.user) {
        const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", authData.user.id).eq("role", "admin").maybeSingle();
        admin = Boolean(role);
      }
      if (!active) return;
      setIsAdmin(admin);
      if (queryError) setError("Data label belum dapat dimuat. Silakan coba beberapa saat lagi.");
      else {
        const rows = (data ?? []) as PublicJamaah[];
        setPeople(rows);
        setSelectedId(rows[0]?.id ?? "");
      }
      setLoading(false);
    };
    void load();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("id");
    if (!term) return people;
    return people.filter((person) =>
      person.full_name.toLocaleLowerCase("id").includes(term) ||
      (person.label_number ?? "").toLocaleLowerCase("id").includes(term)
    );
  }, [people, search]);
  const selected = people.find((person) => person.id === selectedId);

  const downloadLabel = () => {
    if (!selected) return;
    const safe = (value: string) => value.replace(/[<>&"]/g, "");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1400" viewBox="0 0 900 1400"><rect width="900" height="1400" fill="#f1e5c8"/><rect x="28" y="28" width="844" height="1344" rx="30" fill="none" stroke="#c39a4a" stroke-width="12"/><text x="450" y="150" text-anchor="middle" font-family="Arial" font-size="54" font-weight="bold" fill="#4b210d">SULTAN BAROKAH HARAMAIN</text><text x="450" y="220" text-anchor="middle" font-family="Arial" font-size="34" fill="#a82018">INDONESIA</text><rect x="90" y="310" width="720" height="920" rx="28" fill="${safe(selected.label_color || "#4b210d")}"/><text x="140" y="420" font-family="Arial" font-size="38" fill="#f6e8c9">BARANG INI MILIK:</text><text x="760" y="510" text-anchor="end" font-family="Arial" font-size="92" fill="#e1b65d">${safe(selected.label_number || "")}</text><text x="140" y="650" font-family="Arial" font-size="62" font-weight="bold" fill="#fff">${safe(selected.full_name)}</text><text x="140" y="760" font-family="Arial" font-size="34" fill="#fff">TL: ${safe(selected.tour_leader || "-")}</text><text x="140" y="930" font-family="Arial" font-size="34" fill="#fff">WhatsApp: ${safe(selected.whatsapp_number || "-")}</text><text x="140" y="1050" font-family="Arial" font-size="32" fill="#fff">Makkah: ${safe(selected.room_makkah || "-")}</text><text x="140" y="1120" font-family="Arial" font-size="32" fill="#fff">Madinah: ${safe(selected.room_madinah || "-")}</text></svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `label-koper-${selected.label_number || "jamaah"}.svg`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#faf6f3] text-[#35190d]">
      <header className="border-b border-[#eadfce] bg-white/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-full border border-[#d7b56d] bg-[#fff8e8] text-[#81531d]"><Luggage className="size-5"/></span><span><strong className="block text-sm tracking-wide">SULTAN BAROKAH</strong><span className="text-xs font-semibold text-[#8b6a43]">HARAMAIN · GRESIK</span></span></Link>
          <div className="flex items-center gap-3"><Link to="/" className="text-sm font-semibold text-[#684c3a] hover:text-[#9b6b27]">Beranda</Link>{isAdmin && <Link to="/label-center-admin" className="rounded-full bg-[#17613b] px-4 py-2 text-xs font-bold text-white">Kelola Data</Link>}</div>
        </div>
      </header>
      <section className="bg-[linear-gradient(115deg,#f4ece4,#fffaf2)]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:py-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e7d3a9] px-3 py-1 text-xs font-bold text-[#68451e]"><Luggage className="size-3.5"/> LAYANAN JAMAAH</span>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight text-[#47230f] sm:text-5xl">Label Koper & Informasi Kamar Jamaah</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#72594b] sm:text-base">Temukan data label koper, nomor WhatsApp, dan informasi kamar Makkah serta Madinah jamaah Sultan Haramain Gresik.</p>
          <div className="mt-7 flex flex-wrap gap-3 text-xs font-semibold text-[#684c3a]"><span className="inline-flex items-center gap-2 rounded-full border border-[#e7d8c5] bg-white/80 px-3 py-2"><Users className="size-4"/> Direktori jamaah</span><span className="inline-flex items-center gap-2 rounded-full border border-[#e7d8c5] bg-white/80 px-3 py-2"><ShieldCheck className="size-4"/> Data dari database resmi</span></div>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[.85fr_1.15fr]">
        <section className="rounded-2xl border border-[#eaded5] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><Users className="size-5 text-[#986021]"/> Daftar Jamaah</h2><span className="text-xs text-[#9a8171]">{people.length} data</span></div>
          <label className="relative mt-4 block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#91829a]"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama atau nomor label..." className="h-12 w-full rounded-xl border border-[#e8dfe4] pl-10 pr-3 text-sm outline-none focus:border-[#bd9149]"/></label>
          {loading ? <p className="py-10 text-center text-sm text-[#806b5e]">Memuat data jamaah...</p> : error ? <p className="py-10 text-center text-sm text-red-700">{error}</p> : filtered.length === 0 ? <p className="py-10 text-center text-sm text-[#806b5e]">Tidak ada jamaah yang cocok dengan pencarian.</p> : <div className="mt-4 max-h-[560px] space-y-2 overflow-y-auto">{filtered.map((person) => <button key={person.id} onClick={() => setSelectedId(person.id)} className={"flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition " + (selectedId === person.id ? "border-[#c69a4d] bg-[#fff8e8]" : "border-[#eee6df] hover:bg-[#faf6f3]")}><span className="min-w-0"><strong className="block truncate text-sm text-[#45230f]">{person.full_name}</strong><span className="mt-1 block text-xs text-[#8b7769]">No. Label: {person.label_number || "-"}</span></span><span className="shrink-0 rounded-lg bg-[#f4ece4] px-3 py-2 text-xs font-bold text-[#81531d]">Lihat</span></button>)}</div>}
        </section>
        <section className="rounded-2xl border border-[#eaded5] bg-white p-5 shadow-sm sm:p-7">
          {selected ? <><div className="flex flex-wrap items-start justify-between gap-3"><div><span className="text-xs font-bold uppercase tracking-[.16em] text-[#98703b]">Detail Jamaah</span><h2 className="mt-2 text-2xl font-bold text-[#45230f]">{selected.full_name}</h2><p className="mt-1 text-sm text-[#8b7769]">Nomor label: {selected.label_number || "-"}</p><p className="mt-1 text-xs font-semibold text-[#98703b]">{selected.gender === "F" ? "Perempuan" : selected.gender === "M" ? "Laki-laki" : "Jenis kelamin belum diisi"} · {selected.room_group || "Kelompok kamar belum diisi"}</p></div><span className="rounded-full bg-[#edf5ee] px-3 py-1 text-xs font-bold text-[#17613b]">{selected.label_status || "Jamaah"}</span></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-[#faf6f3] p-4"><span className="text-xs text-[#8b7769]">Nomor WhatsApp</span><a href={selected.whatsapp_number ? "https://wa.me/" + selected.whatsapp_number.replace(/\D/g, "") : undefined} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-2 break-all text-sm font-bold text-[#17613b]"><MessageCircle className="size-4 shrink-0"/>{selected.whatsapp_number || "-"}</a></div><div className="rounded-xl bg-[#faf6f3] p-4"><span className="text-xs text-[#8b7769]">Ketua Rombongan</span><p className="mt-2 text-sm font-bold text-[#45230f]">{selected.tour_leader || "-"}</p></div><div className="rounded-xl border border-[#ead9bc] bg-[#fffaf0] p-4"><span className="text-xs text-[#8b7769]">Kamar Makkah</span><p className="mt-2 text-2xl font-bold text-[#81531d]">{selected.room_makkah || "-"}</p></div><div className="rounded-xl border border-[#ead9bc] bg-[#fffaf0] p-4"><span className="text-xs text-[#8b7769]">Kamar Madinah</span><p className="mt-2 text-2xl font-bold text-[#81531d]">{selected.room_madinah || "-"}</p></div></div>
            <div className="mt-6 flex flex-wrap gap-3"><button onClick={downloadLabel} className="inline-flex items-center gap-2 rounded-xl bg-[#17613b] px-5 py-3 text-sm font-bold text-white"><Download className="size-4"/> Download Label SVG</button>{selected.whatsapp_number && <a href={"https://wa.me/" + selected.whatsapp_number.replace(/\D/g, "")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[#d9c7ae] px-5 py-3 text-sm font-bold text-[#65452e]"><MessageCircle className="size-4"/> Hubungi Jamaah</a>}</div>
          </> : <div className="flex min-h-72 flex-col items-center justify-center text-center text-[#806b5e]"><CalendarDays className="size-9"/><p className="mt-3 text-sm">Pilih nama jamaah untuk melihat informasi label dan kamar.</p></div>}
        </section>
      </div>
      <footer className="border-t border-[#eadfce] bg-white py-6 text-center text-xs text-[#9a8171]">Label Koper Jamaah · Sultan Haramain Cabang Gresik <Link to="/" className="ml-2 inline-flex items-center gap-1 font-semibold text-[#81531d]">Kembali ke beranda <ExternalLink className="size-3"/></Link></footer>
    </main>
  );
}
