-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  display_name text,
  total_minutes integer default 0,
  today_minutes integer default 0,
  current_streak integer default 0,
  last_activity_date date,
  liked_surahs integer[] default '{}',
  saved_ayah jsonb default '[]'::jsonb,
  reciter_stats jsonb default '{}'::jsonb,
  favorite_reciter text,
  most_listened_surah integer,
  last_surah_number integer,
  last_ayah_number integer,
  updated_at timestamp with time zone default now()
);

-- Set up Row Level Security (RLS)
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Trigger function to update updated_at timestamp on profile changes
create or replace function public.update_profile_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  -- Reset today's minutes if it's a new day
  if new.last_activity_date is distinct from old.last_activity_date then
    new.today_minutes = 0;
  end if;
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically update timestamp
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute procedure public.update_profile_timestamp();

-- Trigger for new user profile
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, updated_at)
  values (new.id, new.raw_user_meta_data->>'display_name', now());
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
