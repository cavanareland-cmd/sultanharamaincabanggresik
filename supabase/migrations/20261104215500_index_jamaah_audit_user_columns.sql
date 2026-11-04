create index if not exists jamaah_created_by_idx on public.jamaah (created_by) where created_by is not null;
create index if not exists jamaah_updated_by_idx on public.jamaah (updated_by) where updated_by is not null;
