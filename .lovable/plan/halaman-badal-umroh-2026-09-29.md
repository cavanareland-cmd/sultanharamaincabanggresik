# Halaman Badal Umroh

## Ringkasan
Menambahkan halaman baru `/badal-umroh` yang mengikuti identitas premium Sultan Haramain Gresik, mudah digunakan dari ponsel, dan terhubung langsung ke WhatsApp.

## Yang akan dibuat
- Menu baru **Badal Umroh** pada navigasi situs utama dan footer.
- Navigasi khusus yang tetap terlihat di bagian atas halaman Badal Umroh, dengan tautan ke: Apa Itu Badal Umroh, Dalil, Fasilitas, Syarat, dan Harga.
- Bagian pembuka dengan foto Ka'bah/Masjidil Haram, lapisan biru transparan, judul dan kalimat sesuai dokumen, tombol pendaftaran WhatsApp, serta penanda Amitra dan SISKOPATUH.
- Bagian penjelasan Badal Umroh dua kolom dengan foto pendukung.
- Bagian landasan syariat dalam tampilan kutipan khusus.
- Tiga fasilitas: sertifikat eksklusif, cuplikan video, dan satu pelaksanaan untuk satu jiwa.
- Daftar persyaratan pendaftaran dengan penanda centang.
- Bagian harga **Rp 1.500.000 / jiwa**, peringatan keamanan transaksi, catatan perubahan harga, dan tombol pendaftaran WhatsApp.
- FAQ interaktif untuk waktu pelaksanaan, pengiriman video, dan cara pembayaran.
- Footer dengan data kantor dan akun media sosial resmi yang sudah ada di situs.
- Animasi masuk ringan yang menghormati pengaturan pengurangan gerak pada perangkat pengguna.

## Detail teknis
- Membuat route TanStack baru `src/routes/badal-umroh.tsx` lengkap dengan metadata SEO unik, canonical URL, Open Graph, Twitter Card, serta schema Service/FAQ.
- Menggunakan komponen tombol dan token warna yang sudah tersedia; tidak mengubah sistem pengelolaan konten atau database.
- Menggunakan aset Ka'bah/Masjidil Haram yang telah tersedia agar tetap konsisten dan tidak menambah sumber gambar eksternal.
- Memastikan setiap tombol tindakan membuka WhatsApp 0811-3107-707 dengan pesan khusus Badal Umroh.
- Memperbarui sitemap untuk domain utama dan domain Lovable.
- Memeriksa tampilan desktop dan ponsel, fungsi navigasi, FAQ, serta tautan WhatsApp.
