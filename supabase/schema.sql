-- Phase 1 schema: a single key-value table per user, mirroring the shape
-- the app already used with localStorage (keys like "settings",
-- "session:6:2"). Run this once in the Supabase SQL Editor.

create table if not exists public.user_data (
  user_id     uuid not null references auth.users(id) on delete cascade,
  key         text not null,
  value       jsonb not null,
  updated_at  timestamptz not null default now(),
  primary key (user_id, key)
);

-- Speeds up the prefix queries the app does (e.g. "session:") to load
-- every logged session in one request.
create index if not exists user_data_user_id_key_idx
  on public.user_data (user_id, key text_pattern_ops);

-- Row Level Security: this is the real security boundary, independent of
-- anything the API routes do. Even if a request somehow bypassed the
-- route's own auth.uid() filter, Postgres itself would still refuse to
-- return or modify another user's rows.
alter table public.user_data enable row level security;

create policy "Users can read their own data"
  on public.user_data for select
  using (auth.uid() = user_id);

create policy "Users can insert their own data"
  on public.user_data for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own data"
  on public.user_data for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own data"
  on public.user_data for delete
  using (auth.uid() = user_id);

-- A small profile row per user, separate from Supabase's own auth.users
-- table (which you generally shouldn't alter directly). This is where the
-- coach/athlete distinction will live once the admin dashboard is built —
-- adding it now avoids a schema migration later. Everyone defaults to
-- "athlete"; flip your own row to "coach" manually in the Table Editor.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null default 'athlete' check (role in ('athlete', 'coach')),
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Automatically creates a profile row the moment someone signs up, so you
-- never have to remember to do it manually.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

