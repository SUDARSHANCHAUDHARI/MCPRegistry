-- Add to docs/database-schema.sql
-- Run these in Supabase SQL Editor

-- ── Ratings table ──────────────────────────────────
create table ratings (
  id uuid default gen_random_uuid() primary key,
  server_id uuid references mcp_servers(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  rating integer check (rating >= 1 and rating <= 5),
  review text,
  created_at timestamptz default now(),
  unique(server_id, user_id)
);

-- ── Server health checks ──────────────────────────────────
create table server_health (
  id uuid default gen_random_uuid() primary key,
  server_id uuid references mcp_servers(id) on delete cascade,
  is_healthy boolean default true,
  last_checked timestamptz default now(),
  error_message text,
  github_repo_exists boolean default true,
  npm_package_exists boolean default true
);

-- ── Analytics events ──────────────────────────────────
create table analytics (
  id uuid default gen_random_uuid() primary key,
  event_type text, -- 'view', 'search', 'submit', 'api_call'
  server_id uuid references mcp_servers(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  metadata jsonb,
  created_at timestamptz default now()
);

-- ── Enable RLS ──────────────────────────────────
alter table ratings enable row level security;
alter table server_health enable row level security;
alter table analytics enable row level security;

-- ── Policies ──────────────────────────────────
create policy "Anyone can read ratings"
  on ratings for select using (true);

create policy "Users can create ratings"
  on ratings for insert with check (auth.uid() = user_id);

create policy "Users can update own ratings"
  on ratings for update using (auth.uid() = user_id);

create policy "Anyone can read health"
  on server_health for select using (true);

create policy "Admins can update health"
  on server_health for update using (exists(
    select 1 from profiles where id = auth.uid() and is_admin = true
  ));

create policy "Analytics visible to admins only"
  on analytics for select using (exists(
    select 1 from profiles where id = auth.uid() and is_admin = true
  ));

-- ── Indexes ──────────────────────────────────
create index idx_ratings_server on ratings(server_id);
create index idx_health_server on server_health(server_id);
create index idx_analytics_event on analytics(event_type);
create index idx_analytics_created on analytics(created_at);
