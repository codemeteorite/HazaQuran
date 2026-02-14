-- Migration: add saved_ayahs column to profiles
-- Creates a jsonb array to store saved ayahs with metadata, enforces array type and adds a GIN index

begin;

-- 1) Add column (not null, default to empty array)
alter table public.profiles
add column if not exists saved_ayahs jsonb not null default '[]'::jsonb;

-- 2) Optional: ensure the column is a JSON array
alter table public.profiles
add constraint if not exists chk_saved_ayahs_is_array check (jsonb_typeof(saved_ayahs) = 'array');

-- 3) Add GIN index for efficient querying on jsonb
create index if not exists idx_profiles_saved_ayahs_gin
on public.profiles using gin (saved_ayahs);

commit;

-- Notes:
-- • Run this in the Supabase SQL editor or via psql / Supabase CLI.
-- • Example to append a saved ayah object from SQL:
--   update public.profiles
--   set saved_ayahs = coalesce(saved_ayahs, '[]'::jsonb) || jsonb_build_array(jsonb_build_object('surahId', 2, 'ayahNumber', 255, 'savedAt', now()::text))
--   where id = '<USER_UUID>';

-- • If you prefer a normalized table for bookmarks (one row per saved ayah), ask and I will add that migration instead.
