-- Add reading position columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_surah_number INTEGER,
ADD COLUMN IF NOT EXISTS last_ayah_number INTEGER;

-- Ensure saved_ayah column exists (standardizing on saved_ayah as used in the code)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS saved_ayah JSONB DEFAULT '[]'::jsonB;

-- Notify PostgREST to reload schema (optional, but helpful)
NOTIFY pgrst, 'reload schema';
