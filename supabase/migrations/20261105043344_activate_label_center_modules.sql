-- Enable the complete Label Center content modules.
-- Public visitors can read only published records; admins can manage all records.
create table if not exists public.label_center_itinerary (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz,
  location text not null default '',
  details text not null default '',
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.label_center_guides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Panduan Umrah',
  content text not null default '',
  attachment_url text not null default '',
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.label_center_banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null default '',
  image_url text not null default '',
  target_url text not null default '',
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists label_center_itinerary_order_idx on public.label_center_itinerary (sort_order, starts_at);
create index if not exists label_center_guides_order_idx on public.label_center_guides (sort_order, created_at);
create index if not exists label_center_banners_order_idx on public.label_center_banners (sort_order, created_at);

alter table public.label_center_itinerary enable row level security;
alter table public.label_center_guides enable row level security;
alter table public.label_center_banners enable row level security;

grant select on public.label_center_itinerary, public.label_center_guides, public.label_center_banners to anon, authenticated;
grant insert, update, delete on public.label_center_itinerary, public.label_center_guides, public.label_center_banners to authenticated;

drop policy if exists "Public reads published label itinerary" on public.label_center_itinerary;
create policy "Public reads published label itinerary" on public.label_center_itinerary for select to anon, authenticated using (is_published = true);
drop policy if exists "Admins manage label itinerary" on public.label_center_itinerary;
create policy "Admins manage label itinerary" on public.label_center_itinerary for all to authenticated using (public.has_role(auth.uid(), 'admin'::public.app_role)) with check (public.has_role(auth.uid(), 'admin'::public.app_role));

drop policy if exists "Public reads published label guides" on public.label_center_guides;
create policy "Public reads published label guides" on public.label_center_guides for select to anon, authenticated using (is_published = true);
drop policy if exists "Admins manage label guides" on public.label_center_guides;
create policy "Admins manage label guides" on public.label_center_guides for all to authenticated using (public.has_role(auth.uid(), 'admin'::public.app_role)) with check (public.has_role(auth.uid(), 'admin'::public.app_role));

drop policy if exists "Public reads published label banners" on public.label_center_banners;
create policy "Public reads published label banners" on public.label_center_banners for select to anon, authenticated using (is_published = true);
drop policy if exists "Admins manage label banners" on public.label_center_banners;
create policy "Admins manage label banners" on public.label_center_banners for all to authenticated using (public.has_role(auth.uid(), 'admin'::public.app_role)) with check (public.has_role(auth.uid(), 'admin'::public.app_role));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('label-center-assets', 'label-center-assets', true, 10485760, array['image/png','image/jpeg','image/webp','image/svg+xml','application/pdf'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public reads label center assets" on storage.objects;
create policy "Public reads label center assets" on storage.objects for select to anon, authenticated using (bucket_id = 'label-center-assets');
drop policy if exists "Admins upload label center assets" on storage.objects;
create policy "Admins upload label center assets" on storage.objects for insert to authenticated with check (bucket_id = 'label-center-assets' and public.has_role(auth.uid(), 'admin'::public.app_role));
drop policy if exists "Admins update label center assets" on storage.objects;
create policy "Admins update label center assets" on storage.objects for update to authenticated using (bucket_id = 'label-center-assets' and public.has_role(auth.uid(), 'admin'::public.app_role)) with check (bucket_id = 'label-center-assets' and public.has_role(auth.uid(), 'admin'::public.app_role));
drop policy if exists "Admins delete label center assets" on storage.objects;
create policy "Admins delete label center assets" on storage.objects for delete to authenticated using (bucket_id = 'label-center-assets' and public.has_role(auth.uid(), 'admin'::public.app_role));

comment on table public.label_center_itinerary is 'Jadwal perjalanan yang dikelola melalui Label Center.';
comment on table public.label_center_guides is 'Materi panduan umrah yang dikelola melalui Label Center.';
comment on table public.label_center_banners is 'Spanduk dan banner informasi yang dikelola melalui Label Center.';
