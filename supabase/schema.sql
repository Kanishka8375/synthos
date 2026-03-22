-- Run this in your Supabase SQL Editor (supabase.com → your project → SQL Editor)

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  full_name   text,
  studio_name text,
  plan        text default 'free',
  created_at  timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, studio_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'studio_name', 'My Studio')
  );
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Projects table
create table if not exists public.projects (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references auth.users on delete cascade not null,
  title            text not null,
  genre            text default 'Action',
  style            text default 'Anime',
  episode_count    int  default 0,
  status           text default 'Draft',
  openclaw_enabled boolean default true,
  thumbnail_url    text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);
alter table public.projects enable row level security;
create policy "Users can CRUD own projects" on public.projects for all using (auth.uid() = user_id);

-- Generated images table
create table if not exists public.generated_images (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users on delete cascade not null,
  project_id uuid references public.projects on delete set null,
  prompt     text not null,
  url        text not null,
  created_at timestamptz default now()
);
alter table public.generated_images enable row level security;
create policy "Users can CRUD own images" on public.generated_images for all using (auth.uid() = user_id);

-- Generated scripts table
create table if not exists public.generated_scripts (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users on delete cascade not null,
  project_id uuid references public.projects on delete set null,
  prompt     text not null,
  content    text not null,
  created_at timestamptz default now()
);
alter table public.generated_scripts enable row level security;
create policy "Users can CRUD own scripts" on public.generated_scripts for all using (auth.uid() = user_id);

-- Generated tracks metadata table (actual audio from HuggingFace stored as base64)
create table if not exists public.generated_tracks (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users on delete cascade not null,
  project_id uuid references public.projects on delete set null,
  title      text not null,
  prompt     text not null,
  genre      text,
  mood       text,
  duration   text,
  bpm        int,
  audio_url  text,
  status     text default 'Ready',
  created_at timestamptz default now()
);
alter table public.generated_tracks enable row level security;
create policy "Users can CRUD own tracks" on public.generated_tracks for all using (auth.uid() = user_id);
