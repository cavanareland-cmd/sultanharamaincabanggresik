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
  careers: {
    email: "karir@sultanharamaingresik.com",
    role: "Social Media & Admin Officer",
  },
} as const;

/** WhatsApp deep link with a pre-filled question about a package/topic. */
export function waLink(topic = "paket umrah") {
  const text = `Halo Sultan Haramain Gresik, saya ingin bertanya mengenai ${topic}`;
  return `https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent(text)}`;
}

/** WhatsApp apply link; candidate appends their full name after the prefix. */
export function waApplyLink() {
  return `https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent("LAMAR_ADMIN_GRESIK_")}`;
}

export function careersMailto() {
  const subject = `Lamaran ${SITE.careers.role} — Kantor Cabang Gresik`;
  const body = `Assalamu'alaikum,\n\nSaya ingin mengirim lamaran untuk posisi ${SITE.careers.role} di ${SITE.branch}.\nTerlampir CV terbaru, portofolio kreatif/desain, dan pas foto terbaru.\n\nNama lengkap:\nDomisili:\n`;
  return `mailto:${SITE.careers.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const NAV_LINKS = [
  { label: "Beranda", href: "/#beranda" },
  { label: "Paket Umrah", href: "/#paket" },
  { label: "Keunggulan", href: "/#keunggulan" },
  { label: "Galeri", href: "/#galeri" },
  { label: "Testimoni", href: "/#testimoni" },
  { label: "Kontak", href: "/#kontak" },
  { label: "Karir", href: "/karir" },
] as const;
