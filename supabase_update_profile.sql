-- Add new columns to profiles table
alter table public.profiles 
add column if not exists favorite_reciter text,
add column if not exists most_listened_surah integer,
add column if not exists saved_ayahs jsonb default '[]'::jsonb;

-- Update RLS policies if necessary (they should already cover these columns since they cover the whole row)
