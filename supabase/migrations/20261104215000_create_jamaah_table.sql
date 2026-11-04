-- Jamaah identity and luggage-label records.
create table if not exists public.jamaah (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  label_number text,
  tour_leader text not null default '',
  whatsapp_number text not null default '',
  room_makkah text not null default '',
  room_madinah text not null default '',
  departure_date date,
  label_color text not null default '#4b210d' check (label_color ~ '^#[0-9A-Fa-f]{6}$'),
  label_status text not null default 'Belum' check (label_status in ('Belum', 'Selesai')),
  notes text not null default '',
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.jamaah is 'Data jamaah untuk pengelolaan identitas dan label koper umrah.';
comment on column public.jamaah.label_color is 'Warna utama label dalam format hex #RRGGBB.';
comment on column public.jamaah.label_status is 'Status pengerjaan label: Belum atau Selesai.';

create index if not exists jamaah_full_name_idx on public.jamaah (full_name);
create index if not exists jamaah_departure_date_idx on public.jamaah (departure_date);
create index if not exists jamaah_sort_order_idx on public.jamaah (sort_order, full_name);

alter table public.jamaah enable row level security;
revoke all on public.jamaah from anon;
grant select, insert, update, delete on public.jamaah to authenticated;

drop policy if exists "Admins can read jamaah" on public.jamaah;
create policy "Admins can read jamaah" on public.jamaah for select to authenticated
using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));

drop policy if exists "Admins can insert jamaah" on public.jamaah;
create policy "Admins can insert jamaah" on public.jamaah for insert to authenticated
with check ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));

drop policy if exists "Admins can update jamaah" on public.jamaah;
create policy "Admins can update jamaah" on public.jamaah for update to authenticated
using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)))
with check ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));

drop policy if exists "Admins can delete jamaah" on public.jamaah;
create policy "Admins can delete jamaah" on public.jamaah for delete to authenticated
using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
