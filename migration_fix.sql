-- Migration to fix schema mismatches
-- Run this in your Supabase SQL editor

-- 1. Rename saved_ayahs to saved_ayah (if it exists)
ALTER TABLE profiles RENAME COLUMN saved_ayahs TO saved_ayah;

-- 2. Add missing columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS favorite_reciter text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS most_listened_surah integer;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reciter_stats jsonb DEFAULT '{}'::jsonb;

-- 3. Verify the schema
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;
