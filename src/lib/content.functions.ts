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

function serverClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
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
}

export const getHomeContent = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverClient();
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

  const packages: UmrahPackage[] = (packagesRes.data ?? []).map((row) => ({
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
  }));

  const content: SiteContentMap = {};
  for (const row of contentRes.data ?? []) content[row.key] = row.value;

  const gallery: GalleryImageRow[] = (galleryRes.data ?? []).map((row) => ({
    id: row.id,
    image_url: row.image_url,
    caption: row.caption ?? "",
  }));

  return { packages, content, gallery };
});
