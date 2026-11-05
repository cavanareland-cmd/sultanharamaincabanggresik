import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, CalendarDays, Download, ExternalLink, Eye, EyeOff, Image as ImageIcon, Pencil, Plus, Printer, Save, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type ModuleTab = "Itinerary" | "Panduan Umrah" | "Spanduk";
type RecordRow = {
  id: string;
  title: string;
  starts_at?: string | null;
  location?: string;
  details?: string;
  category?: string;
  content?: string;
  attachment_url?: string;
  subtitle?: string;
  image_url?: string;
  target_url?: string;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
};
type Draft = {
  title: string;
  starts_at: string;
  location: string;
  details: string;
  category: string;
  content: string;
  attachment_url: string;
  subtitle: string;
  image_url: string;
  target_url: string;
  is_published: boolean;
};
const emptyDraft: Draft = {
  title: "", starts_at: "", location: "", details: "", category: "Panduan Umrah",
  content: "", attachment_url: "", subtitle: "", image_url: "", target_url: "", is_published: false,
};
const tableByTab: Record<ModuleTab, string> = {
  Itinerary: "label_center_itinerary",
  "Panduan Umrah": "label_center_guides",
  Spanduk: "label_center_banners",
};

export function LabelCenterModules({ tab, isAdmin }: { tab: string; isAdmin: boolean }) {
  const moduleTab = tab as ModuleTab;
  const table = tableByTab[moduleTab];
  const [rows, setRows] = useState<RecordRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState("");
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    if (!table) return;
    setLoading(true);
    let query = (supabase as any).from(table).select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
    if (!isAdmin) query = query.eq("is_published", true);
    const { data, error } = await query;
    if (error) {
      toast.error("Gagal memuat " + tab + ": " + error.message);
      setRows([]);
    } else {
      setRows((data ?? []) as RecordRow[]);
    }
    setLoading(false);
  }, [isAdmin, table, tab]);

  useEffect(() => { void load(); }, [load]);

  const updateDraft = (key: keyof Draft, value: string | boolean) => setDraft((current) => ({ ...current, [key]: value }));
  const reset = () => { setEditingId(""); setDraft(emptyDraft); };

  const edit = (row: RecordRow) => {
    setEditingId(row.id);
    setDraft({
      ...emptyDraft,
      title: row.title ?? "",
      starts_at: row.starts_at ? new Date(row.starts_at).toISOString().slice(0, 16) : "",
      location: row.location ?? "",
      details: row.details ?? "",
      category: row.category ?? "Panduan Umrah",
      content: row.content ?? "",
      attachment_url: row.attachment_url ?? "",
      subtitle: row.subtitle ?? "",
      image_url: row.image_url ?? "",
      target_url: row.target_url ?? "",
      is_published: Boolean(row.is_published),
    });
  };

  const upload = async (file?: File) => {
    if (!file || !isAdmin) return;
    setUploading(true);
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const path = moduleTab.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "/" + Date.now() + "-" + safeName;
    const { error } = await supabase.storage.from("label-center-assets").upload(path, file, { upsert: true });
    setUploading(false);
    if (error) { toast.error("Upload gagal: " + error.message); return; }
    const { data } = supabase.storage.from("label-center-assets").getPublicUrl(path);
    updateDraft(moduleTab === "Panduan Umrah" ? "attachment_url" : "image_url", data.publicUrl);
    toast.success("File berhasil diunggah.");
  };

  const save = async () => {
    if (!draft.title.trim()) { toast.error("Judul wajib diisi."); return; }
    setSaving(true);
    const { data: auth } = await supabase.auth.getUser();
    let payload: Record<string, unknown> = { title: draft.title.trim(), sort_order: rows.length, is_published: draft.is_published, updated_by: auth.user?.id ?? null, updated_at: new Date().toISOString() };
    if (moduleTab === "Itinerary") payload = { ...payload, starts_at: draft.starts_at ? new Date(draft.starts_at).toISOString() : null, location: draft.location.trim(), details: draft.details.trim() };
    if (moduleTab === "Panduan Umrah") payload = { ...payload, category: draft.category.trim() || "Panduan Umrah", content: draft.content.trim(), attachment_url: draft.attachment_url.trim() };
    if (moduleTab === "Spanduk") payload = { ...payload, subtitle: draft.subtitle.trim(), image_url: draft.image_url.trim(), target_url: draft.target_url.trim() };
    const result = editingId
      ? await (supabase as any).from(table).update(payload).eq("id", editingId).select("*").single()
      : await (supabase as any).from(table).insert({ ...payload, created_by: auth.user?.id ?? null }).select("*").single();
    setSaving(false);
    if (result.error) { toast.error("Gagal menyimpan: " + result.error.message); return; }
    toast.success("Data " + tab + " berhasil disimpan.");
    reset();
    await load();
  };

  const remove = async (id: string) => {
    if (!isAdmin || !window.confirm("Hapus konten ini secara permanen?")) return;
    const { error } = await (supabase as any).from(table).delete().eq("id", id);
    if (error) { toast.error("Gagal menghapus: " + error.message); return; }
    toast.success("Konten berhasil dihapus.");
    if (editingId === id) reset();
    await load();
  };

  const orderedRows = useMemo(() => rows.slice().sort((a, b) => a.sort_order - b.sort_order), [rows]);
  if (!table) return null;

  const textInput = "mt-1 w-full rounded-xl border border-[#e7ddd7] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#bd9149]";
  const label = "block text-xs font-semibold text-[#65452e]";
  return (
    <section className="space-y-4 rounded-xl bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="flex items-center gap-2 font-bold text-[#45230f]">{moduleTab === "Itinerary" ? <CalendarDays className="size-5"/> : moduleTab === "Panduan Umrah" ? <BookOpen className="size-5"/> : <ImageIcon className="size-5"/>}{moduleTab}</h2><p className="mt-1 text-xs text-[#8b786d]">{isAdmin ? "Kelola konten, preview, publikasi, dan urutan tampil." : "Informasi resmi yang dipublikasikan oleh admin."}</p></div>
        <div className="flex gap-2"><button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1 rounded-lg border border-[#e7d7c5] px-3 py-2 text-xs font-semibold text-[#684b35]"><Printer className="size-4"/>Cetak</button>{isAdmin && <button type="button" onClick={() => { reset(); }} className="inline-flex items-center gap-1 rounded-lg bg-[#17613b] px-3 py-2 text-xs font-semibold text-white"><Plus className="size-4"/>Tambah</button>}</div>
      </div>

      {isAdmin && (
        <div className="rounded-xl border border-[#eadfce] bg-[#fffaf3] p-4">
          <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-bold text-[#513327]">{editingId ? "Edit" : "Tambah"} {moduleTab}</h3>{editingId && <button type="button" onClick={reset} className="text-xs text-[#8b5b24]"><X className="mr-1 inline size-3"/>Batal edit</button>}</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={label}>Judul<input className={textInput} value={draft.title} onChange={(e) => updateDraft("title", e.target.value)} placeholder="Masukkan judul"/></label>
            {moduleTab === "Itinerary" && <>
              <label className={label}>Tanggal & waktu<input type="datetime-local" className={textInput} value={draft.starts_at} onChange={(e) => updateDraft("starts_at", e.target.value)}/></label>
              <label className={label}>Lokasi<input className={textInput} value={draft.location} onChange={(e) => updateDraft("location", e.target.value)} placeholder="Lokasi kegiatan"/></label>
              <label className={label + " sm:col-span-2"}>Keterangan<textarea className={textInput} rows={4} value={draft.details} onChange={(e) => updateDraft("details", e.target.value)} placeholder="Rincian jadwal, titik kumpul, dan catatan"/></label>
            </>}
            {moduleTab === "Panduan Umrah" && <>
              <label className={label}>Kategori<input className={textInput} value={draft.category} onChange={(e) => updateDraft("category", e.target.value)}/></label>
              <label className={label + " sm:col-span-2"}>Materi panduan<textarea className={textInput} rows={6} value={draft.content} onChange={(e) => updateDraft("content", e.target.value)} placeholder="Tulis materi panduan umrah di sini"/></label>
              <label className={label + " sm:col-span-2"}>Lampiran (PDF atau gambar)<input type="file" accept="application/pdf,image/png,image/jpeg,image/webp" disabled={uploading} className={textInput} onChange={(e) => void upload(e.target.files?.[0])}/><span className="mt-1 block break-all font-normal text-[#8b786d]">{uploading ? "Mengunggah..." : draft.attachment_url}</span></label>
            </>}
            {moduleTab === "Spanduk" && <>
              <label className={label}>Subjudul<input className={textInput} value={draft.subtitle} onChange={(e) => updateDraft("subtitle", e.target.value)} placeholder="Teks pendukung"/></label>
              <label className={label}>Tautan tujuan<input className={textInput} value={draft.target_url} onChange={(e) => updateDraft("target_url", e.target.value)} placeholder="https://... (opsional)"/></label>
              <label className={label + " sm:col-span-2"}>Gambar spanduk<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" disabled={uploading} className={textInput} onChange={(e) => void upload(e.target.files?.[0])}/><input className={textInput} value={draft.image_url} onChange={(e) => updateDraft("image_url", e.target.value)} placeholder="Atau masukkan URL gambar"/><span className="mt-1 block break-all font-normal text-[#8b786d]">{uploading ? "Mengunggah..." : draft.image_url}</span></label>
              {draft.image_url && <div className="sm:col-span-2"><p className="mb-1 text-xs font-semibold text-[#65452e]">Preview spanduk</p><img src={draft.image_url} alt={draft.title || "Preview spanduk"} className="max-h-64 w-full rounded-lg border border-[#eadfce] object-contain"/></div>}
            </>}
            <label className="flex items-center gap-2 text-xs font-semibold text-[#65452e] sm:col-span-2"><input type="checkbox" checked={draft.is_published} onChange={(e) => updateDraft("is_published", e.target.checked)}/>Tampilkan untuk pengunjung publik</label>
          </div>
          <div className="mt-4 flex justify-end gap-2"><button type="button" onClick={reset} className="rounded-lg border border-[#e7d7c5] px-4 py-2 text-xs font-semibold text-[#684b35]">Reset</button><button type="button" disabled={saving || uploading} onClick={() => void save()} className="inline-flex items-center gap-2 rounded-lg bg-[#17613b] px-4 py-2 text-xs font-bold text-white disabled:opacity-60"><Save className="size-4"/>{saving ? "Menyimpan..." : "Simpan"}</button></div>
        </div>
      )}

      {loading ? <p className="py-8 text-center text-sm text-[#8b786d]">Memuat konten...</p> : orderedRows.length === 0 ? <div className="rounded-xl border border-dashed border-[#ddc9aa] bg-[#fffaf2] p-8 text-center text-sm text-[#947e6c]">Belum ada {moduleTab.toLowerCase()} yang {isAdmin ? "dibuat" : "dipublikasikan"}.</div> : (
        <div className="grid gap-3">
          {orderedRows.map((row) => (
            <article key={row.id} className="rounded-xl border border-[#eadfce] bg-[#fffdf9] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {moduleTab === "Spanduk" && row.image_url && <img src={row.image_url} alt={row.title} className="mb-3 max-h-64 w-full rounded-lg object-contain"/>}
                  <div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-[#45230f]">{row.title}</h3>{isAdmin && <span className={"rounded-full px-2 py-1 text-[10px] font-bold " + (row.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>{row.is_published ? "Publik" : "Draft"}</span>}</div>
                  {moduleTab === "Itinerary" && <><p className="mt-1 text-xs font-semibold text-[#8b5b24]">{row.starts_at ? new Date(row.starts_at).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" }) : "Waktu belum ditentukan"}{row.location ? " · " + row.location : ""}</p>{row.details && <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#72594b]">{row.details}</p>}</>}
                  {moduleTab === "Panduan Umrah" && <><p className="mt-1 text-xs font-semibold text-[#8b5b24]">{row.category}</p>{row.content && <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#72594b]">{row.content}</p>}{row.attachment_url && <a href={row.attachment_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#17613b]"><Download className="size-4"/>Buka / unduh lampiran</a>}</>}
                  {moduleTab === "Spanduk" && <>{row.subtitle && <p className="mt-1 text-sm text-[#72594b]">{row.subtitle}</p>}{row.target_url && <a href={row.target_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#17613b]"><ExternalLink className="size-4"/>Tautan tujuan</a>}{row.image_url && <a href={row.image_url} download className="ml-3 mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#17613b]"><Download className="size-4"/>Unduh gambar</a>}</>}
                </div>
                {isAdmin && <div className="flex shrink-0 gap-1"><button type="button" onClick={() => edit(row)} title="Edit" className="rounded-lg border border-[#e7d7c5] p-2 text-[#684b35]"><Pencil className="size-4"/></button><button type="button" onClick={() => void remove(row.id)} title="Hapus" className="rounded-lg border border-red-100 p-2 text-red-600"><Trash2 className="size-4"/></button></div>}
              </div>
            </article>
          ))}
        </div>
      )}
      <p className="text-right text-[10px] text-[#9a8171]">{orderedRows.length} konten · {isAdmin ? "perubahan tersimpan di Supabase" : "konten publik"}</p>
    </section>
  );
}
