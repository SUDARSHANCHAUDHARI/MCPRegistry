-- MCP Registry Database Schema
-- Run this in Supabase SQL Editor

-- ── Main servers table ──────────────────────────────────
create table mcp_servers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  github_url text not null unique,
  install_command text not null,
  category text[] default '{}',
  github_stars integer default 0,
  verified boolean default false,
  status text default 'pending',  -- pending | approved | rejected
  submitted_by uuid references auth.users(id) on delete set null,
  rejection_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── User profiles table ──────────────────────────────────
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  github_username text,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Auto-create profile when user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, github_username, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'user_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Enable RLS on all tables
alter table mcp_servers enable row level security;
alter table profiles enable row level security;

-- Anyone can READ approved servers
create policy "Public can read approved servers"
  on mcp_servers for select
  using (status = 'approved');

-- Logged-in users can INSERT (submit) servers
create policy "Auth users can submit servers"
  on mcp_servers for insert
  with check (auth.uid() = submitted_by);

-- Users can see their own pending submissions
create policy "Users see own submissions"
  on mcp_servers for select
  using (auth.uid() = submitted_by);

-- Profile policies
create policy "Users can read all profiles"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Create indexes for performance
create index idx_servers_status on mcp_servers(status);
create index idx_servers_category on mcp_servers using gin(category);
create index idx_servers_stars on mcp_servers(github_stars desc);
create index idx_servers_name on mcp_servers(name);

-- Insert sample data
insert into mcp_servers (name, description, github_url, install_command, category, github_stars, verified, status)
values
  ('postgres-mcp', 'Connect Claude directly to any PostgreSQL database.',
   'https://github.com/benborla/mcp-server-postgresql', 'npx @benborla29/mcp-server-postgresql',
   '{"database","sql","postgresql"}', 847, true, 'approved'),

  ('filesystem-mcp', 'Give Claude secure access to read, write, and manage files.',
   'https://github.com/modelcontextprotocol/servers', 'npx @modelcontextprotocol/server-filesystem',
   '{"filesystem","files","storage"}', 2341, true, 'approved'),

  ('brave-search-mcp', 'Let Claude search the web in real time using the Brave Search API.',
   'https://github.com/modelcontextprotocol/servers', 'npx @modelcontextprotocol/server-brave-search',
   '{"search","web","api"}', 1205, true, 'approved'),

  ('github-mcp', 'Manage GitHub repos, issues, PRs, and code directly through Claude.',
   'https://github.com/modelcontextprotocol/servers', 'npx @modelcontextprotocol/server-github',
   '{"github","code","devtools"}', 1893, true, 'approved'),

  ('google-maps-mcp', 'Give Claude access to Google Maps — search places, get directions.',
   'https://github.com/modelcontextprotocol/servers', 'npx @modelcontextprotocol/server-google-maps',
   '{"maps","location","google"}', 634, true, 'approved'),

  ('sqlite-mcp', 'Connect Claude to a SQLite database file for local data management.',
   'https://github.com/modelcontextprotocol/servers', 'npx @modelcontextprotocol/server-sqlite',
   '{"database","sql","sqlite"}', 512, true, 'approved'),

  ('slack-mcp', 'Send messages, read channels, and manage your Slack workspace.',
   'https://github.com/modelcontextprotocol/servers', 'npx @modelcontextprotocol/server-slack',
   '{"communication","slack","messaging"}', 723, true, 'approved'),

  ('puppeteer-mcp', 'Control a real browser — take screenshots, fill forms, scrape websites.',
   'https://github.com/modelcontextprotocol/servers', 'npx @modelcontextprotocol/server-puppeteer',
   '{"browser","automation","scraping"}', 445, true, 'approved'),

  ('redis-mcp', 'Read and write to Redis — perfect for session management and caching.',
   'https://github.com/example/redis-mcp', 'npx redis-mcp-server',
   '{"database","cache","redis"}', 198, false, 'approved'),

  ('notion-mcp', 'Read and write Notion pages and databases with Claude.',
   'https://github.com/example/notion-mcp', 'npx notion-mcp',
   '{"productivity","notion","notes"}', 312, false, 'approved');
