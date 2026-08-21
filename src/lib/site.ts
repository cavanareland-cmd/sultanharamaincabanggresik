export const SITE = {
  /** Canonical production domain (Vercel custom domain). */
  url: "https://www.sultanharamaingresik.com",
  company: "PT Sultan Barokah Haramain",
  branch: "Kantor Cabang Gresik",
  ppiu: "04042300022560003",
  phoneDisplay: "0811-3107-707",
  phoneIntl: "628113107707",
  address: "Jl. Samanhudi No. 37, Gresik, Jawa Timur",
  instagram: "https://instagram.com/sultanharamaingresikofficial",
  facebook: "https://facebook.com/sultanharamaingresik",
  tiktok: "https://tiktok.com/@sultanharamaingresik",
  mapsEmbed:
    "https://www.google.com/maps?q=Jl.%20Samanhudi%20No.%2037%20Gresik%20Jawa%20Timur&output=embed",
} as const;

/** WhatsApp deep link with a pre-filled question about a package/topic. */
export function waLink(topic = "paket umrah") {
  const text = `Halo Sultan Haramain Gresik, saya ingin bertanya mengenai ${topic}`;
  return `https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent(text)}`;
}

export const NAV_LINKS = [
  { label: "Beranda", hash: "#beranda" },
  { label: "Paket Umrah", hash: "#paket" },
  { label: "Keunggulan", hash: "#keunggulan" },
  { label: "Galeri", hash: "#galeri" },
  { label: "Testimoni", hash: "#testimoni" },
  { label: "Kontak", hash: "#kontak" },
] as const;
