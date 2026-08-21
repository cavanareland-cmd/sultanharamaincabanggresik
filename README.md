# Sultan Haramain Elegance

Create a modern, elegant, and fully responsive Umrah & Travel website for "PT Sultan Barokah Haramain - Kantor Cabang Gresik". The design should like Image uploaded use a premium dark-mode theme featuring deep black background, royal gold accents (#D4AF37), and clean white text, reflecting the luxury branding in the uploaded logo and brochures.

### 1. Key Business Details & Legal
- Company Name: PT Sultan Barokah Haramain (Kantor Cabang Gresik)
- PPIU License No: 04042300022560003
- Primary WhatsApp / Hotline: 0811-3107-707 (International format: +628113107707)
- Address: Jl. Samanhudi No. 37, Gresik, Jawa Timur
- Socials: Instagram (@sultanharamaingresikofficial), Facebook (Sultan Haramain Gresik), TikTok (@sultanharamaingresik)

### 2. General Architecture & Features
- Fully responsive across Mobile, Tablet, and Desktop screens.
- Use Lovable Cloud (Supabase backend) for the database and authentication.
- All Call-to-Action (CTA) buttons ("Daftar Sekarang", "Tanya CS", "Konsultasi Free", "Pesan Seat") MUST dynamically redirect to WhatsApp: `https://wa.me/628113107707?text=Halo%20Sultan%20Haramain%20Gresik,%20saya%20ingin%20bertanya%20mengenai%20[Package Name]`
- Integration-ready for GitHub source code export and Vercel deployment.

### 3. CMS Admin Dashboard
Build a protected Admin Route (`/admin`) using Lovable Cloud Auth to manage dynamic content:
- Package Management (CRUD): Title, Price, Duration (days), Departure Date, Departure City, Airlines, Hotels (Makkah & Madinah), Includes, Excludes, Promo Badges, and Banner Image.
- Section Content Management: Hero text, Announcement bar, Contact info, and Gallery images.

### 4. Website Structure & Pages

#### A. Header / Navbar
- Logo: Display the uploaded gold crown diamond logo ("SULTAN HARAMAIN").
- Navigation links: Beranda, Paket Umrah, Keunggulan, Testimoni, Kontak.
- CTA Button: "Hubungi Kami" (Green WhatsApp icon button).
- Mobile: Smooth slide-out mobile drawer menu.

#### B. Hero Section
- High-impact visual of Makkah/Madinah with gold gradient overlays.
- Headline: "Perjalanan Ibadah Umrah Mewah, Nyaman, & Terpercaya"
- Subheadline: "PT Sultan Barokah Haramain Cabang Gresik - No. Izin PPIU 04042300022560003"
- Quick Filter bar: Search packages by Month / Airline / Price.

#### C. Featured Umrah Packages Section (Dynamic Cards)
Create dynamic cards populated from the database based on the 6 uploaded brochures:

1. Paket Umrah Milad 12 Hari (Akhir September 2026)
   - Price: Rp 29,9 Juta | Starting: Surabaya & Jakarta
   - Hotel: Madinah (Taiba Hills/Setaraf), Makkah (Badr Al Massa/Setaraf)
2. Paket Umrah Plus Keliling Dubai 12 Hari (12 September 2026)
   - Price: Rp 35,9 Juta | Starting: Jakarta | Airline: Emirates
   - Hotel: Madinah (Emaar Taiba/Setaraf), Makkah (Ramada/Grand Al Massa)
3. Paket Umrah Oktober Harmony 12 Hari (29 Oktober 2026)
   - Price: Rp 33,9 Juta | Starting: Jakarta | Airline: Qatar Airways
   - Hotel: Madinah (Emaar Taiba/Setaraf), Makkah (Nada Ajyad/Setaraf)
4. Paket Umrah Plus Türkiye Pesona Musim Gugur 12 Hari (25 September 2026)
   - Price: Rp 39,9 Juta | Starting: Jakarta | Airline: Saudia / Emirates / Qatar / Turkish
   - Hotel: Madinah (Al Nusk/Setaraf), Makkah (Nada Ajyad/Setaraf)
5. Paket Umrah Plus Garuda Mendunia 9 Hari (7 & 17 Januari 2027)
   - Price: Rp 27,9 Juta | Starting: Jakarta | Extra: Free Jersey, Syal, & Tiket Nonton Timnas
   - Match: Jepang vs Indonesia & Thailand vs Indonesia
6. Paket Umrah Bulan November 2026 (19 November 2026 - 13 Hari)
   - Gold Package: Rp 41,9 Juta (Hotel Madinah: Al Saha 4★, Makkah: Olayan Ajyad 4★)
   - Silver Package: Rp 36,9 Juta (Hotel Madinah: Al Mukhtara Golden 3★, Makkah: Wahad Ajyad 3★)
   - Features: 2x Jum'at, Free City Tour Thaif, Free Kereta Cepat, DP Rp 5 Juta.

#### D. Trust & Compliance Banner
- Disclaimer Box: "Hati-hati terhadap penipuan! Pastikan pendaftaran Umroh hanya melalui kantor resmi kami dan rekening atas nama perusahaan PT Sultan Barokah Haramain."
- Logos: Kemenag, 5 Pasti Umrah, SISKOPATUH, AMITRA Sharia Financing.

#### E. Footer
- Full address in Gresik, Google Maps embedded location, WhatsApp direct link, social media links, and PPIU license footer text.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sultanharamaincabanggresik.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e4e7da05-5777-40e0-a743-c8c328c27cdf).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
