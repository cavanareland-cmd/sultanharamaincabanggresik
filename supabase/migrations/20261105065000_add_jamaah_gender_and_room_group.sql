-- Preserve room-list attributes imported for the public Label Center.
alter table public.jamaah
  add column if not exists gender text,
  add column if not exists room_group text;

create or replace view public.jamaah_public as
select
  id,
  full_name,
  label_number,
  tour_leader,
  whatsapp_number,
  room_makkah,
  room_madinah,
  label_color,
  label_status,
  sort_order,
  gender,
  room_group
from public.jamaah;

revoke all on public.jamaah_public from public;
grant select on public.jamaah_public to anon, authenticated;
