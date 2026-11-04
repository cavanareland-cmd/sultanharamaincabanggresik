-- Public read-only projection for the Label Koper directory.
-- The underlying jamaah table remains protected by its existing admin-only RLS policies.
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
  sort_order
from public.jamaah;

revoke all on public.jamaah_public from public;
grant select on public.jamaah_public to anon, authenticated;

comment on view public.jamaah_public is
  'Public read-only label directory. Exposes only jamaah identity, contact, room and label fields approved for public display; internal notes and audit columns remain private.';
