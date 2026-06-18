-- StackRadar — Supabase schema (free tier compatible)
-- Run in Supabase SQL editor. RLS allows public read for static-site builds.

create table if not exists tools (
  id          bigint generated always as identity primary key,
  slug        text unique not null,
  name        text not null,
  category    text not null,
  use_case    text not null,
  description text not null,
  pricing     text,
  free_tier   boolean default false,
  rating      numeric(2,1),
  affiliate_url text not null,
  pros        text[] default '{}',
  cons        text[] default '{}',
  best_for    text[] default '{}',
  created_at  timestamptz default now()
);

create table if not exists industries (
  id    bigint generated always as identity primary key,
  slug  text unique not null,
  name  text not null,
  blurb text
);

-- Optional: track which programmatic pages exist + their state
create table if not exists pages (
  id          bigint generated always as identity primary key,
  type        text not null check (type in ('comparison', 'best-for')),
  slug        text unique not null,
  title       text not null,
  meta_desc   text,
  published   boolean default true,
  updated_at  timestamptz default now()
);

-- Public read-only access for the static build
alter table tools       enable row level security;
alter table industries  enable row level security;
alter table pages       enable row level security;

create policy "public read tools"      on tools      for select using (true);
create policy "public read industries"  on industries for select using (true);
create policy "public read pages"       on pages      for select using (true);
