import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { LogOut, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin, claimFirstAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Sultan Haramain Gresik" },
      { name: "description", content: "Kelola paket umrah, konten, dan galeri website." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Dashboard | Sultan Haramain Gresik" },
      { property: "og:description", content: "Kelola konten website Sultan Haramain Gresik." },
    ],
  }),
  component: AdminPage,
});

type PackageRow = {
  id: string;
  title: string;
  price_label: string;
  price_numeric: number | null;
  duration_days: number | null;
  departure_date_label: string | null;
  departure_month: string | null;
  departure_city: string | null;
  airlines: string | null;
  hotel_makkah: string | null;
  hotel_madinah: string | null;
  includes: string[];
  excludes: string[];
  badges: string[];
  notes: string | null;
  image_url: string | null;
  is_published: boolean;
  sort_order: number;
};

const emptyPackage = {
  title: "",
  price_label: "",
  price_numeric: "",
  duration_days: "",
  departure_date_label: "",
  departure_month: "",
  departure_city: "",
  airlines: "",
  hotel_makkah: "",
  hotel_madinah: "",
  includes: "",
  excludes: "",
  badges: "",
  notes: "",
  image_url: "",
  is_published: true,
  sort_order: "0",
};

type FormState = typeof emptyPackage;

function toForm(row: PackageRow): FormState {
  return {
    title: row.title,
    price_label: row.price_label ?? "",
    price_numeric: row.price_numeric === null ? "" : String(row.price_numeric),
    duration_days: row.duration_days === null ? "" : String(row.duration_days),
    departure_date_label: row.departure_date_label ?? "",
    departure_month: row.departure_month ?? "",
    departure_city: row.departure_city ?? "",
    airlines: row.airlines ?? "",
    hotel_makkah: row.hotel_makkah ?? "",
    hotel_madinah: row.hotel_madinah ?? "",
    includes: (row.includes ?? []).join("\n"),
    excludes: (row.excludes ?? []).join("\n"),
    badges: (row.badges ?? []).join(", "),
    notes: row.notes ?? "",
    image_url: row.image_url ?? "",
    is_published: row.is_published,
    sort_order: String(row.sort_order),
  };
}

function toPayload(form: FormState) {
  const lines = (value: string) =>
    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  return {
    title: form.title.trim(),
    price_label: form.price_label.trim(),
    price_numeric: form.price_numeric ? Number(form.price_numeric) : null,
    duration_days: form.duration_days ? Number(form.duration_days) : null,
    departure_date_label: form.departure_date_label.trim(),
    departure_month: form.departure_month.trim(),
    departure_city: form.departure_city.trim(),
    airlines: form.airlines.trim(),
    hotel_makkah: form.hotel_makkah.trim(),
    hotel_madinah: form.hotel_madinah.trim(),
    includes: lines(form.includes),
    excludes: lines(form.excludes),
    badges: form.badges
      .split(",")
      .map((badge) => badge.trim())
      .filter(Boolean),
    notes: form.notes.trim(),
    image_url: form.image_url.trim(),
    is_published: form.is_published,
    sort_order: Number(form.sort_order) || 0,
  };
}

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const verifyAdmin = useServerFn(checkIsAdmin);
  const claimAdmin = useServerFn(claimFirstAdmin);

  const runVerify = () =>
    void verifyAdmin()
      .then((result) => setIsAdmin(result.isAdmin))
      .catch((error: unknown) => {
        toast.error(error instanceof Error ? error.message : "Gagal memuat akses admin.");
        setIsAdmin(false);
      });

  useEffect(() => {
    runVerify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClaimAdmin = async () => {
    try {
      const result = await claimAdmin();
      if (result.isAdmin) {
        toast.success("Akses admin berhasil diklaim.");
        runVerify();
      } else {
        toast.error("Akses admin tidak dapat diklaim. Hubungi admin utama.");
        setIsAdmin(false);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal mengklaim admin. Lakukan klaim pertama dari preview Lovable.",
      );
    }
  };

  const packagesQuery = useQuery({
    queryKey: ["admin-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as unknown as PackageRow[];
    },
  });

  const contentQuery = useQuery({
    queryKey: ["admin-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*").order("key");
      if (error) throw error;
      return data;
    },
  });

  const galleryQuery = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const refreshAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-packages"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-content"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] }),
      queryClient.invalidateQueries({ queryKey: ["home-content"] }),
    ]);
  };

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-surface/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <h1 className="font-display text-2xl font-semibold text-gradient-gold">
              Admin Dashboard
            </h1>
            <p className="text-xs text-muted-foreground">Sultan Haramain Gresik CMS</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outlineGold" size="sm">
              <Link to="/">Lihat Website</Link>
            </Button>
            <Button variant="secondary" size="sm" onClick={signOut}>
              <LogOut className="size-4" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {isAdmin === false ? (
          <div className="mb-6 space-y-3 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm">
            <p>
              Akun ini belum memiliki akses admin. Jika ini akun pertama, klaim akses admin di
              bawah (dilakukan dari preview Lovable). Hubungi admin utama untuk diberi akses.
            </p>
            <Button variant="gold" size="sm" onClick={handleClaimAdmin}>
              Klaim Akses Admin
            </Button>
          </div>
        ) : null}

        <Tabs defaultValue="packages">
          <TabsList>
            <TabsTrigger value="packages">Paket Umrah</TabsTrigger>
            <TabsTrigger value="content">Konten Website</TabsTrigger>
            <TabsTrigger value="gallery">Galeri</TabsTrigger>
          </TabsList>

          <TabsContent value="packages" className="mt-6 space-y-4">
            <div className="flex justify-end">
              <PackageDialog
                onSaved={refreshAll}
                trigger={
                  <Button variant="gold">
                    <Plus className="size-4" />
                    Tambah Paket
                  </Button>
                }
              />
            </div>

            {packagesQuery.isLoading ? <p className="text-sm text-muted-foreground">Memuat...</p> : null}

            <div className="space-y-3">
              {(packagesQuery.data ?? []).map((row) => (
                <Card key={row.id} className="border-border/70 bg-gradient-surface">
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                    <div>
                      <p className="font-semibold">{row.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {row.price_label} · {row.departure_date_label} · urutan {row.sort_order}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={row.is_published ? "gold" : "secondary"}>
                        {row.is_published ? "Tampil" : "Draft"}
                      </Badge>
                      <PackageDialog
                        row={row}
                        onSaved={refreshAll}
                        trigger={
                          <Button variant="outlineGold" size="sm">
                            Edit
                          </Button>
                        }
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          if (!window.confirm(`Hapus paket "${row.title}"?`)) return;
                          const { error } = await supabase.from("packages").delete().eq("id", row.id);
                          if (error) {
                            toast.error(error.message);
                            return;
                          }
                          toast.success("Paket dihapus");
                          await refreshAll();
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="content" className="mt-6 space-y-4">
            {(contentQuery.data ?? []).map((row) => (
              <ContentEditor key={row.key} row={row} onSaved={refreshAll} />
            ))}
          </TabsContent>

          <TabsContent value="gallery" className="mt-6 space-y-4">
            <GalleryForm onSaved={refreshAll} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(galleryQuery.data ?? []).map((row) => (
                <Card key={row.id} className="overflow-hidden border-border/70 bg-gradient-surface">
                  <img src={row.image_url} alt={row.caption ?? ""} loading="lazy" className="h-40 w-full object-cover" />
                  <CardContent className="flex items-center justify-between gap-2 py-3">
                    <p className="text-xs text-muted-foreground">{row.caption}</p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        const { error } = await supabase
                          .from("gallery_images")
                          .delete()
                          .eq("id", row.id);
                        if (error) {
                          toast.error(error.message);
                          return;
                        }
                        await refreshAll();
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function PackageDialog({
  row,
  trigger,
  onSaved,
}: {
  row?: PackageRow;
  trigger: React.ReactNode;
  onSaved: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(row ? toForm(row) : emptyPackage);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof FormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const payload = toPayload(form);
    const { error } = row
      ? await supabase.from("packages").update(payload).eq("id", row.id)
      : await supabase.from("packages").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(row ? "Paket diperbarui" : "Paket ditambahkan");
    setOpen(false);
    if (!row) setForm(emptyPackage);
    await onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {row ? "Edit Paket" : "Tambah Paket"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={save} className="space-y-4">
          <Field label="Judul Paket">
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Harga (label)">
              <Input
                value={form.price_label}
                onChange={(e) => set("price_label", e.target.value)}
                placeholder="Rp 29,9 Juta"
              />
            </Field>
            <Field label="Harga (angka, untuk filter)">
              <Input
                type="number"
                value={form.price_numeric}
                onChange={(e) => set("price_numeric", e.target.value)}
                placeholder="29900000"
              />
            </Field>
            <Field label="Durasi (hari)">
              <Input
                type="number"
                value={form.duration_days}
                onChange={(e) => set("duration_days", e.target.value)}
              />
            </Field>
            <Field label="Tanggal Keberangkatan">
              <Input
                value={form.departure_date_label}
                onChange={(e) => set("departure_date_label", e.target.value)}
                placeholder="12 September 2026"
              />
            </Field>
            <Field label="Bulan (untuk filter)">
              <Input
                value={form.departure_month}
                onChange={(e) => set("departure_month", e.target.value)}
                placeholder="September 2026"
              />
            </Field>
            <Field label="Kota Keberangkatan">
              <Input
                value={form.departure_city}
                onChange={(e) => set("departure_city", e.target.value)}
              />
            </Field>
            <Field label="Maskapai">
              <Input value={form.airlines} onChange={(e) => set("airlines", e.target.value)} />
            </Field>
            <Field label="Urutan tampil">
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) => set("sort_order", e.target.value)}
              />
            </Field>
            <Field label="Hotel Madinah">
              <Input
                value={form.hotel_madinah}
                onChange={(e) => set("hotel_madinah", e.target.value)}
              />
            </Field>
            <Field label="Hotel Makkah">
              <Input
                value={form.hotel_makkah}
                onChange={(e) => set("hotel_makkah", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Include (satu per baris)">
            <Textarea
              rows={4}
              value={form.includes}
              onChange={(e) => set("includes", e.target.value)}
            />
          </Field>
          <Field label="Exclude (satu per baris)">
            <Textarea
              rows={3}
              value={form.excludes}
              onChange={(e) => set("excludes", e.target.value)}
            />
          </Field>
          <Field label="Promo Badge (pisahkan dengan koma)">
            <Input value={form.badges} onChange={(e) => set("badges", e.target.value)} />
          </Field>
          <Field label="Catatan">
            <Textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </Field>
          <Field label="URL Banner Image">
            <Input
              value={form.image_url}
              onChange={(e) => set("image_url", e.target.value)}
              placeholder="https://..."
            />
          </Field>
          <div className="flex items-center gap-3">
            <Switch
              id="published"
              checked={form.is_published}
              onCheckedChange={(checked) => set("is_published", checked)}
            />
            <Label htmlFor="published">Tampilkan di website</Label>
          </div>
          <Button type="submit" variant="gold" className="w-full" disabled={saving}>
            <Save className="size-4" />
            {saving ? "Menyimpan..." : "Simpan Paket"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ContentEditor({
  row,
  onSaved,
}: {
  row: { key: string; value: string; label: string | null };
  onSaved: () => Promise<void>;
}) {
  const [value, setValue] = useState(row.value);
  const [saving, setSaving] = useState(false);

  return (
    <Card className="border-border/70 bg-gradient-surface">
      <CardHeader className="pb-2">
        <p className="font-semibold">{row.label || row.key}</p>
        <p className="text-xs text-muted-foreground">{row.key}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea rows={2} value={value} onChange={(event) => setValue(event.target.value)} />
        <Button
          variant="gold"
          size="sm"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            const { error } = await supabase
              .from("site_content")
              .update({ value })
              .eq("key", row.key);
            setSaving(false);
            if (error) {
              toast.error(error.message);
              return;
            }
            toast.success("Konten disimpan");
            await onSaved();
          }}
        >
          <Save className="size-4" />
          Simpan
        </Button>
      </CardContent>
    </Card>
  );
}

function GalleryForm({ onSaved }: { onSaved: () => Promise<void> }) {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");

  return (
    <Card className="border-border/70 bg-gradient-surface">
      <CardContent className="grid gap-3 py-4 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
        <Field label="URL Gambar">
          <Input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} />
        </Field>
        <Field label="Keterangan">
          <Input value={caption} onChange={(event) => setCaption(event.target.value)} />
        </Field>
        <Button
          variant="gold"
          onClick={async () => {
            if (!imageUrl.trim()) {
              toast.error("URL gambar wajib diisi");
              return;
            }
            const { error } = await supabase
              .from("gallery_images")
              .insert({ image_url: imageUrl.trim(), caption: caption.trim() });
            if (error) {
              toast.error(error.message);
              return;
            }
            setImageUrl("");
            setCaption("");
            await onSaved();
          }}
        >
          <Plus className="size-4" />
          Tambah
        </Button>
      </CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
