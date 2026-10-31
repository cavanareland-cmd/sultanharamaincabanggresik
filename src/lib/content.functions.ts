import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

export type PackageVariant = {
  name: string;
  price_label: string;
  hotel_madinah?: string;
  hotel_makkah?: string;
};

export type UmrahPackage = {
  id: string;
  title: string;
  price_label: string;
  price_numeric: number | null;
  duration_days: number | null;
  departure_date_label: string;
  departure_month: string;
  departure_city: string;
  airlines: string;
  hotel_makkah: string;
  hotel_madinah: string;
  includes: string[];
  excludes: string[];
  badges: string[];
  variants: PackageVariant[];
  notes: string;
  image_url: string;
  is_published: boolean;
  sort_order: number;
};

export type GalleryImageRow = {
  id: string;
  image_url: string;
  caption: string;
};

export type SiteContentMap = Record<string, string>;

const FALLBACK_SITE_CONTENT: SiteContentMap = {
  announcement: "Pendaftaran Umrah 2026/2027 telah dibuka - Hubungi CS kami di 0811-3107-707",
  hero_title: "Perjalanan Ibadah Umrah Mewah, Nyaman, & Terpercaya",
  hero_subtitle: "PT Sultan Barokah Haramain Cabang Gresik - No. Izin PPIU 04042300022560003",
  contact_phone: "0811-3107-707",
  contact_address: "Jl. Samanhudi No. 37, Gresik, Jawa Timur",
  contact_email: "sultanharamaingresik@gmail.com",
  contact_hours: "Senin - Sabtu, 08.00 - 17.00 WIB",
};

const FALLBACK_PACKAGES: UmrahPackage[] = [
  {
    id: "pkg-1",
    title: "Paket Umrah Milad 12 Hari",
    price_label: "Rp 29,9 Juta",
    price_numeric: 29900000,
    duration_days: 12,
    departure_date_label: "Akhir September 2026",
    departure_month: "September 2026",
    departure_city: "Surabaya & Jakarta",
    airlines: "Saudia / Setaraf",
    hotel_makkah: "Badr Al Massa / Setaraf",
    hotel_madinah: "Taiba Hills / Setaraf",
    includes: [
      "Tiket pesawat internasional",
      "Visa Umrah",
      "Hotel bintang 4 dekat Masjidil Haram",
      "Makan 3x sehari menu Indonesia",
      "Muthawwif berpengalaman",
      "Perlengkapan Umrah",
      "Manasik & City Tour",
    ],
    excludes: [
      "Paspor & suntik meningitis",
      "Pembuatan dokumen pribadi",
      "Kelebihan bagasi",
      "Pengeluaran pribadi",
    ],
    badges: ["Milad", "Best Seller"],
    variants: [],
    notes: "Kuota terbatas, DP untuk mengunci seat.",
    image_url: "",
    is_published: true,
    sort_order: 1,
  },
  {
    id: "pkg-2",
    title: "Paket Umrah Plus Keliling Dubai 12 Hari",
    price_label: "Rp 35,9 Juta",
    price_numeric: 35900000,
    duration_days: 12,
    departure_date_label: "12 September 2026",
    departure_month: "September 2026",
    departure_city: "Jakarta",
    airlines: "Emirates",
    hotel_makkah: "Ramada / Grand Al Massa",
    hotel_madinah: "Emaar Taiba / Setaraf",
    includes: [
      "Tiket Emirates",
      "Visa Umrah & Visa Dubai",
      "City Tour Dubai (Burj Khalifa area, Dubai Mall, Palm Jumeirah)",
      "Hotel bintang 4",
      "Makan 3x sehari",
      "Muthawwif berpengalaman",
    ],
    excludes: ["Paspor & suntik meningitis", "Pengeluaran pribadi", "Kelebihan bagasi"],
    badges: ["Plus Dubai", "Emirates"],
    variants: [],
    notes: "Termasuk keliling kota Dubai.",
    image_url: "",
    is_published: true,
    sort_order: 2,
  },
  {
    id: "pkg-3",
    title: "Paket Umrah Oktober Harmony 12 Hari",
    price_label: "Rp 33,9 Juta",
    price_numeric: 33900000,
    duration_days: 12,
    departure_date_label: "29 Oktober 2026",
    departure_month: "Oktober 2026",
    departure_city: "Jakarta",
    airlines: "Qatar Airways",
    hotel_makkah: "Nada Ajyad / Setaraf",
    hotel_madinah: "Emaar Taiba / Setaraf",
    includes: [
      "Tiket Qatar Airways",
      "Visa Umrah",
      "Hotel bintang 4",
      "Makan 3x sehari",
      "Muthawwif berpengalaman",
      "City Tour Makkah & Madinah",
    ],
    excludes: ["Paspor & suntik meningitis", "Pengeluaran pribadi", "Kelebihan bagasi"],
    badges: ["Qatar Airways"],
    variants: [],
    notes: "",
    image_url: "",
    is_published: true,
    sort_order: 3,
  },
  {
    id: "pkg-4",
    title: "Paket Umrah Plus Türkiye Pesona Musim Gugur 12 Hari",
    price_label: "Rp 39,9 Juta",
    price_numeric: 39900000,
    duration_days: 12,
    departure_date_label: "25 September 2026",
    departure_month: "September 2026",
    departure_city: "Jakarta",
    airlines: "Saudia / Emirates / Qatar / Turkish",
    hotel_makkah: "Nada Ajyad / Setaraf",
    hotel_madinah: "Al Nusk / Setaraf",
    includes: [
      "Tiket pesawat internasional",
      "Visa Umrah & Visa Türkiye",
      "Tour Istanbul: Blue Mosque, Hagia Sophia, Bosphorus Cruise",
      "Hotel bintang 4",
      "Makan 3x sehari",
      "Muthawwif berpengalaman",
    ],
    excludes: ["Paspor & suntik meningitis", "Pengeluaran pribadi", "Kelebihan bagasi"],
    badges: ["Plus Türkiye", "Musim Gugur"],
    variants: [],
    notes: "Nikmati pesona musim gugur Türkiye.",
    image_url: "",
    is_published: true,
    sort_order: 4,
  },
  {
    id: "pkg-5",
    title: "Paket Umrah Plus Garuda Mendunia 9 Hari",
    price_label: "Rp 27,9 Juta",
    price_numeric: 27900000,
    duration_days: 9,
    departure_date_label: "7 & 17 Januari 2027",
    departure_month: "Januari 2027",
    departure_city: "Jakarta",
    airlines: "Garuda Indonesia",
    hotel_makkah: "Hotel bintang 4 / Setaraf",
    hotel_madinah: "Hotel bintang 4 / Setaraf",
    includes: [
      "Tiket Garuda Indonesia",
      "Visa Umrah",
      "Free Jersey Timnas",
      "Free Syal Timnas",
      "Free Tiket Nonton Timnas",
      "Makan 3x sehari",
      "Muthawwif berpengalaman",
    ],
    excludes: ["Paspor & suntik meningitis", "Pengeluaran pribadi", "Kelebihan bagasi"],
    badges: ["Free Tiket Timnas", "Garuda"],
    variants: [],
    notes: "Match: Jepang vs Indonesia & Thailand vs Indonesia.",
    image_url: "",
    is_published: true,
    sort_order: 5,
  },
  {
    id: "pkg-6",
    title: "Paket Umrah Bulan November 2026 - 13 Hari",
    price_label: "Mulai Rp 36,9 Juta",
    price_numeric: 36900000,
    duration_days: 13,
    departure_date_label: "19 November 2026",
    departure_month: "November 2026",
    departure_city: "Jakarta",
    airlines: "Saudia / Setaraf",
    hotel_makkah: "Olayan Ajyad 4★ / Wahad Ajyad 3★",
    hotel_madinah: "Al Saha 4★ / Al Mukhtara Golden 3★",
    includes: [
      "2x Sholat Jumat di Haramain",
      "Free City Tour Thaif",
      "Free Kereta Cepat Haramain",
      "Visa Umrah & tiket pesawat",
      "Makan 3x sehari",
      "Muthawwif berpengalaman",
    ],
    excludes: ["Paspor & suntik meningitis", "Pengeluaran pribadi", "Kelebihan bagasi"],
    badges: ["Gold & Silver", "DP Rp 5 Juta"],
    variants: [
      {
        name: "Gold",
        price_label: "Rp 41,9 Juta",
        hotel_madinah: "Al Saha 4★",
        hotel_makkah: "Olayan Ajyad 4★",
      },
      {
        name: "Silver",
        price_label: "Rp 36,9 Juta",
        hotel_madinah: "Al Mukhtara Golden 3★",
        hotel_makkah: "Wahad Ajyad 3★",
      },
    ],
    notes: "DP Rp 5 Juta untuk mengunci seat.",
    image_url: "",
    is_published: true,
    sort_order: 6,
  },
];

function serverClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  const url = process.env["SUPABASE_URL"];
  if (!key || !url) return null;

  try {
    return createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });
  } catch {
    return null;
  }
}

export const getHomeContent = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverClient();

  if (!supabase) {
    return {
      packages: FALLBACK_PACKAGES,
      content: FALLBACK_SITE_CONTENT,
      gallery: [],
    };
  }

  try {
    const [packagesRes, contentRes, galleryRes] = await Promise.all([
      supabase
        .from("packages")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true }),
      supabase.from("site_content").select("key, value"),
      supabase
        .from("gallery_images")
        .select("id, image_url, caption")
        .order("sort_order", { ascending: true }),
    ]);

    const packages: UmrahPackage[] =
      packagesRes.data && packagesRes.data.length > 0
        ? packagesRes.data.map((row) => ({
            id: row.id,
            title: row.title,
            price_label: row.price_label ?? "",
            price_numeric: row.price_numeric === null ? null : Number(row.price_numeric),
            duration_days: row.duration_days ?? null,
            departure_date_label: row.departure_date_label ?? "",
            departure_month: row.departure_month ?? "",
            departure_city: row.departure_city ?? "",
            airlines: row.airlines ?? "",
            hotel_makkah: row.hotel_makkah ?? "",
            hotel_madinah: row.hotel_madinah ?? "",
            includes: row.includes ?? [],
            excludes: row.excludes ?? [],
            badges: row.badges ?? [],
            variants: (row.variants as PackageVariant[] | null) ?? [],
            notes: row.notes ?? "",
            image_url: row.image_url ?? "",
            is_published: row.is_published,
            sort_order: row.sort_order,
          }))
        : FALLBACK_PACKAGES;

    const content: SiteContentMap = { ...FALLBACK_SITE_CONTENT };
    for (const row of contentRes.data ?? []) content[row.key] = row.value;

    const gallery: GalleryImageRow[] = (galleryRes.data ?? []).map((row) => ({
      id: row.id,
      image_url: row.image_url,
      caption: row.caption ?? "",
    }));

    return { packages, content, gallery };
  } catch (error) {
    console.warn("[Content] Failed to fetch from Supabase, using fallback:", error);
    return {
      packages: FALLBACK_PACKAGES,
      content: FALLBACK_SITE_CONTENT,
      gallery: [],
    };
  }
});
