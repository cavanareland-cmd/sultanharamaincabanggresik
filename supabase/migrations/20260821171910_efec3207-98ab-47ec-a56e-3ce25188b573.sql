CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RETURN public.has_role(uid,'admin');
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (uid,'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TABLE public.packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  price_label text NOT NULL DEFAULT '',
  price_numeric numeric,
  duration_days integer,
  departure_date_label text DEFAULT '',
  departure_month text DEFAULT '',
  departure_city text DEFAULT '',
  airlines text DEFAULT '',
  hotel_makkah text DEFAULT '',
  hotel_madinah text DEFAULT '',
  includes text[] NOT NULL DEFAULT '{}',
  excludes text[] NOT NULL DEFAULT '{}',
  badges text[] NOT NULL DEFAULT '{}',
  variants jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text DEFAULT '',
  image_url text DEFAULT '',
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.packages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.packages TO authenticated;
GRANT ALL ON public.packages TO service_role;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published packages are public" ON public.packages FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "Admins manage packages" ON public.packages FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER packages_updated_at BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  label text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site content is public" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage site content" ON public.site_content FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;
GRANT ALL ON public.gallery_images TO service_role;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gallery is public" ON public.gallery_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage gallery" ON public.gallery_images FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.site_content (key, label, value) VALUES
('announcement','Announcement bar','Pendaftaran Umrah 2026/2027 telah dibuka - Hubungi CS kami di 0811-3107-707'),
('hero_title','Hero headline','Perjalanan Ibadah Umrah Mewah, Nyaman, & Terpercaya'),
('hero_subtitle','Hero subheadline','PT Sultan Barokah Haramain Cabang Gresik - No. Izin PPIU 04042300022560003'),
('contact_phone','WhatsApp / Hotline','0811-3107-707'),
('contact_address','Address','Jl. Samanhudi No. 37, Gresik, Jawa Timur'),
('contact_email','Email','sultanharamaingresik@gmail.com'),
('contact_hours','Operating hours','Senin - Sabtu, 08.00 - 17.00 WIB');

INSERT INTO public.packages (title, price_label, price_numeric, duration_days, departure_date_label, departure_month, departure_city, airlines, hotel_makkah, hotel_madinah, includes, excludes, badges, notes, sort_order) VALUES
('Paket Umrah Milad 12 Hari','Rp 29,9 Juta',29900000,12,'Akhir September 2026','September 2026','Surabaya & Jakarta','Saudia / Setaraf','Badr Al Massa / Setaraf','Taiba Hills / Setaraf',
 ARRAY['Tiket pesawat internasional','Visa Umrah','Hotel bintang 4 dekat Masjidil Haram','Makan 3x sehari menu Indonesia','Muthawwif berpengalaman','Perlengkapan Umrah','Manasik & City Tour'],
 ARRAY['Paspor & suntik meningitis','Pembuatan dokumen pribadi','Kelebihan bagasi','Pengeluaran pribadi'],
 ARRAY['Milad','Best Seller'],'Kuota terbatas, DP untuk mengunci seat.',1),
('Paket Umrah Plus Keliling Dubai 12 Hari','Rp 35,9 Juta',35900000,12,'12 September 2026','September 2026','Jakarta','Emirates','Ramada / Grand Al Massa','Emaar Taiba / Setaraf',
 ARRAY['Tiket Emirates','Visa Umrah & Visa Dubai','City Tour Dubai (Burj Khalifa area, Dubai Mall, Palm Jumeirah)','Hotel bintang 4','Makan 3x sehari','Muthawwif berpengalaman'],
 ARRAY['Paspor & suntik meningitis','Pengeluaran pribadi','Kelebihan bagasi'],
 ARRAY['Plus Dubai','Emirates'],'Termasuk keliling kota Dubai.',2),
('Paket Umrah Oktober Harmony 12 Hari','Rp 33,9 Juta',33900000,12,'29 Oktober 2026','Oktober 2026','Jakarta','Qatar Airways','Nada Ajyad / Setaraf','Emaar Taiba / Setaraf',
 ARRAY['Tiket Qatar Airways','Visa Umrah','Hotel bintang 4','Makan 3x sehari','Muthawwif berpengalaman','City Tour Makkah & Madinah'],
 ARRAY['Paspor & suntik meningitis','Pengeluaran pribadi','Kelebihan bagasi'],
 ARRAY['Qatar Airways'],'',3),
('Paket Umrah Plus Türkiye Pesona Musim Gugur 12 Hari','Rp 39,9 Juta',39900000,12,'25 September 2026','September 2026','Jakarta','Saudia / Emirates / Qatar / Turkish','Nada Ajyad / Setaraf','Al Nusk / Setaraf',
 ARRAY['Tiket pesawat internasional','Visa Umrah & Visa Türkiye','Tour Istanbul: Blue Mosque, Hagia Sophia, Bosphorus Cruise','Hotel bintang 4','Makan 3x sehari','Muthawwif berpengalaman'],
 ARRAY['Paspor & suntik meningitis','Pengeluaran pribadi','Kelebihan bagasi'],
 ARRAY['Plus Türkiye','Musim Gugur'],'Nikmati pesona musim gugur Türkiye.',4),
('Paket Umrah Plus Garuda Mendunia 9 Hari','Rp 27,9 Juta',27900000,9,'7 & 17 Januari 2027','Januari 2027','Jakarta','Garuda Indonesia','Hotel bintang 4 / Setaraf','Hotel bintang 4 / Setaraf',
 ARRAY['Tiket Garuda Indonesia','Visa Umrah','Free Jersey Timnas','Free Syal Timnas','Free Tiket Nonton Timnas','Makan 3x sehari','Muthawwif berpengalaman'],
 ARRAY['Paspor & suntik meningitis','Pengeluaran pribadi','Kelebihan bagasi'],
 ARRAY['Free Tiket Timnas','Garuda'],'Match: Jepang vs Indonesia & Thailand vs Indonesia.',5),
('Paket Umrah Bulan November 2026 - 13 Hari','Mulai Rp 36,9 Juta',36900000,13,'19 November 2026','November 2026','Jakarta','Saudia / Setaraf','Olayan Ajyad 4★ / Wahad Ajyad 3★','Al Saha 4★ / Al Mukhtara Golden 3★',
 ARRAY['2x Sholat Jumat di Haramain','Free City Tour Thaif','Free Kereta Cepat Haramain','Visa Umrah & tiket pesawat','Makan 3x sehari','Muthawwif berpengalaman'],
 ARRAY['Paspor & suntik meningitis','Pengeluaran pribadi','Kelebihan bagasi'],
 ARRAY['Gold & Silver','DP Rp 5 Juta'],'DP Rp 5 Juta untuk mengunci seat.',6);

UPDATE public.packages SET variants = '[{"name":"Gold","price_label":"Rp 41,9 Juta","hotel_madinah":"Al Saha 4★","hotel_makkah":"Olayan Ajyad 4★"},{"name":"Silver","price_label":"Rp 36,9 Juta","hotel_madinah":"Al Mukhtara Golden 3★","hotel_makkah":"Wahad Ajyad 3★"}]'::jsonb
WHERE sort_order = 6;