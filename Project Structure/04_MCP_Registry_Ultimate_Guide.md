# 🔌 MCP Registry — Ultimate Build Guide
> Everything you need — code, prompts, launch, marketing, monetization.

| 📦 9 Sections | 🛠️ Full Code | 📋 50+ Prompts | 🚀 Launch Pack | 💰 Monetization |
|---|---|---|---|---|

---

## What's In This Guide
- **Section 1** — Architecture & full folder structure
- **Section 2** — Complete database setup with every SQL query
- **Section 3** — Every environment variable and secret key
- **Section 4** — Full code for every page and component
- **Section 5** — Admin panel — approve/reject submissions
- **Section 6** — Public API endpoint
- **Section 7** — Security & spam protection
- **Section 8** — Launch strategy — exact posts for HN, Reddit, Twitter/X
- **Section 9** — Monetization — free to paid, pricing, cloud hosting

---

## SECTION 1 — Architecture & Folder Structure

### 1.1 How It All Connects

| Layer | Technology | What It Does | Where It Runs |
|---|---|---|---|
| Frontend (UI) | Next.js 14 + React | What users see and click | Browser |
| Backend (API) | Next.js API Routes | Handles form submissions, auth callbacks | Vercel serverless |
| Database | Supabase (PostgreSQL) | Stores all MCP server data | Supabase cloud |
| Auth | Supabase + GitHub OAuth | Login with GitHub | Supabase cloud |
| Styling | Tailwind CSS | Makes everything look good | Browser |
| Hosting | Vercel | Serves your website to the world | Vercel cloud |
| Domain | Namecheap / Vercel | Your custom URL | DNS |

### 1.2 Complete Folder Structure

```
mcp-registry/
├── app/                         # All pages (Next.js App Router)
│   ├── layout.tsx               # Root layout — Navbar + Footer wrap all pages
│   ├── page.tsx                 # Homepage — search + server grid
│   ├── login/
│   │   └── page.tsx             # Login with GitHub page
│   ├── submit/
│   │   └── page.tsx             # Submit a new MCP server form
│   ├── servers/
│   │   └── [id]/
│   │       └── page.tsx         # Individual server detail page
│   ├── admin/
│   │   └── page.tsx             # Admin panel — approve/reject submissions
│   ├── api/
│   │   ├── servers/
│   │   │   └── route.ts         # Public API — GET all servers as JSON
│   │   ├── sync-stars/
│   │   │   └── route.ts         # Cron job — sync GitHub star counts
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts     # GitHub OAuth callback handler
│   ├── sitemap.ts               # Auto-generates sitemap.xml for SEO
│   ├── robots.ts                # robots.txt for search engines
│   └── not-found.tsx            # Custom 404 page
├── components/                  # Reusable UI pieces
│   ├── Navbar.tsx               # Top navigation bar
│   ├── Footer.tsx               # Bottom footer
│   ├── ServerCard.tsx           # Card shown in the server grid
│   ├── SearchBar.tsx            # Search input with URL sync
│   ├── CategoryFilter.tsx       # Category pill buttons
│   ├── CopyButton.tsx           # Copy install command to clipboard
│   ├── Pagination.tsx           # Page 1, 2, 3... navigation
│   ├── LoadingSpinner.tsx       # Loading animation
│   └── EmptyState.tsx           # 'No results found' display
├── lib/                         # Shared utilities
│   ├── supabase.ts              # Supabase client (browser)
│   ├── supabase-server.ts       # Supabase client (server components)
│   └── db.ts                    # All database query functions
├── types/
│   └── index.ts                 # TypeScript type definitions
├── public/                      # Static files
│   ├── og-image.png             # Open Graph image for social sharing
│   └── favicon.ico              # Browser tab icon
├── .env.local                   # Secret keys (never commit this!)
├── .gitignore                   # Files Git should ignore
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Your project's homepage on GitHub
```

---

## SECTION 2 — Complete Database Setup

Run all of this SQL in your Supabase SQL Editor. Go in order.

### 2.1 Create All Tables

```sql
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
```

### 2.2 Row Level Security (RLS) Policies

```sql
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

-- Only admins can UPDATE (approve/reject)
create policy "Admins can update servers"
  on mcp_servers for update
  using (exists(
    select 1 from profiles
    where id = auth.uid() and is_admin = true
  ));

-- Profile policies
create policy "Users can read all profiles"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);
```

### 2.3 Indexes for Performance

```sql
-- Fast full-text search on name and description
create index idx_servers_search
  on mcp_servers using gin(to_tsvector('english', name || ' ' || description));

-- Fast filter by status
create index idx_servers_status on mcp_servers(status);

-- Fast filter by category
create index idx_servers_category on mcp_servers using gin(category);

-- Fast sort by stars
create index idx_servers_stars on mcp_servers(github_stars desc);
```

### 2.4 Seed Data — 10 Real MCP Servers

```sql
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
```

### 2.5 Make Yourself an Admin

```sql
-- Run this AFTER you sign in with GitHub for the first time
update profiles
set is_admin = true
where github_username = 'your-github-username';

-- Verify it worked:
select id, github_username, is_admin from profiles;
```

---

## SECTION 3 — Environment Variables & Keys

### 3.1 Your .env.local File

```bash
# ── SUPABASE ─────────────────────────────────────────────
# From: supabase.com → Your Project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ── APP URL ──────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ── SECURITY ─────────────────────────────────────────────
SYNC_SECRET=make-up-any-random-string-here-abc123xyz

# ── GITHUB API (optional) ────────────────────────────────
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

### 3.2 Where to Get Each Key

| Variable | Where to Get It | Required? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role key | For admin only |
| `NEXT_PUBLIC_APP_URL` | Your own app URL — localhost:3000 for dev | Yes |
| `SYNC_SECRET` | Make up any random string yourself | For star sync |
| `GITHUB_TOKEN` | GitHub → Settings → Developer Settings → Personal tokens | Optional |

### 3.3 Set Up GitHub OAuth in Supabase

1. Go to github.com → Settings → Developer Settings → OAuth Apps → New OAuth App
2. Application name: `MCP Registry`
3. Homepage URL: `http://localhost:3000`
4. Authorization callback URL: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
5. Click Register — copy the Client ID
6. Click Generate a new client secret — copy the secret
7. Go to Supabase → Authentication → Providers → GitHub → paste both values → Save

---

## SECTION 4 — Complete Code for Every File

### 4.1 types/index.ts

```typescript
export type ServerStatus = 'pending' | 'approved' | 'rejected'

export interface McpServer {
  id: string
  name: string
  description: string
  github_url: string
  install_command: string
  category: string[]
  github_stars: number
  verified: boolean
  status: ServerStatus
  submitted_by: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  github_username: string
  avatar_url: string
  is_admin: boolean
  created_at: string
}

export interface SubmitServerForm {
  name: string
  description: string
  github_url: string
  install_command: string
  category: string
}

export interface SearchParams {
  search?: string
  category?: string
  page?: string
}
```

### 4.2 lib/supabase.ts

```typescript
// lib/supabase.ts — use in CLIENT components ('use client')
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

```typescript
// lib/supabase-server.ts — use in SERVER components
import { createClient } from '@supabase/supabase-js'

export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )
}
```

### 4.3 lib/db.ts

```typescript
import { supabase } from './supabase'
import { McpServer, SubmitServerForm } from '@/types'

const PAGE_SIZE = 12

export async function getAllServers(
  search?: string, category?: string, page = 1
): Promise<{ servers: McpServer[], total: number }> {
  let query = supabase.from('mcp_servers').select('*', { count: 'exact' })
    .eq('status', 'approved')
    .order('github_stars', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  if (search) query = query.ilike('name', `%${search}%`)
  if (category) query = query.contains('category', [category])

  const { data, error, count } = await query
  if (error) { console.error(error); return { servers: [], total: 0 } }
  return { servers: data || [], total: count || 0 }
}

export async function getServerById(id: string): Promise<McpServer | null> {
  const { data, error } = await supabase
    .from('mcp_servers').select('*').eq('id', id).single()
  if (error) return null
  return data
}

export async function getCategories(): Promise<string[]> {
  const { data } = await supabase
    .from('mcp_servers').select('category').eq('status', 'approved')
  if (!data) return []
  const all = data.flatMap(row => row.category)
  return [...new Set(all)].sort()
}

export async function submitServer(
  form: SubmitServerForm, userId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('mcp_servers').insert([{
    name: form.name.trim(),
    description: form.description.trim(),
    github_url: form.github_url.trim(),
    install_command: form.install_command.trim(),
    category: form.category.split(',').map(c => c.trim().toLowerCase()).filter(Boolean),
    submitted_by: userId,
    status: 'pending'
  }])
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function getPendingServers(): Promise<McpServer[]> {
  const { data } = await supabase
    .from('mcp_servers').select('*').eq('status', 'pending')
    .order('created_at', { ascending: true })
  return data || []
}

export async function updateServerStatus(
  id: string, status: 'approved' | 'rejected', reason?: string
): Promise<boolean> {
  const { error } = await supabase.from('mcp_servers')
    .update({ status, rejection_reason: reason || null })
    .eq('id', id)
  return !error
}

export async function getServerCount(): Promise<number> {
  const { count } = await supabase
    .from('mcp_servers').select('*', { count: 'exact', head: true })
    .eq('status', 'approved')
  return count || 0
}
```

### 4.4 app/api/auth/callback/route.ts

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(requestUrl.origin)
}
```

### 4.5 app/not-found.tsx

```typescript
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className='flex flex-col items-center justify-center min-h-[60vh] px-4'>
      <div className='text-8xl mb-6'>🔌</div>
      <h1 className='text-4xl font-bold mb-3'>Page Not Found</h1>
      <p className='text-gray-500 mb-8 text-center max-w-md'>
        This MCP server or page doesn't exist yet. Maybe it's waiting to be submitted!
      </p>
      <Link href='/' className='bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700'>
        Back to Registry
      </Link>
    </main>
  )
}
```

### 4.6 app/sitemap.ts

```typescript
import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mcpregistry.dev'

  const { data: servers } = await supabase
    .from('mcp_servers').select('id, updated_at').eq('status', 'approved')

  const serverUrls = (servers || []).map(s => ({
    url: `${appUrl}/servers/${s.id}`,
    lastModified: new Date(s.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: appUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${appUrl}/submit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...serverUrls,
  ]
}
```

### 4.7 lib/validate.ts

```typescript
export function validateSubmission(form: {
  name: string; description: string; github_url: string; install_command: string
}) {
  const errors: Record<string, string> = {}

  if (!form.name || form.name.length < 3)
    errors.name = 'Name must be at least 3 characters'
  if (form.name.length > 50)
    errors.name = 'Name must be under 50 characters'

  if (!form.description || form.description.length < 20)
    errors.description = 'Description must be at least 20 characters'
  if (form.description.length > 200)
    errors.description = 'Description must be under 200 characters'

  if (!form.github_url.startsWith('https://github.com/'))
    errors.github_url = 'Must be a valid GitHub URL (https://github.com/...)'

  if (!form.install_command.trim())
    errors.install_command = 'Install command is required'

  return { errors, isValid: Object.keys(errors).length === 0 }
}
```

---

## SECTION 5 — Admin Panel

### How Admin Auth Works
- When someone submits a server, `status = 'pending'`
- Pending servers are NOT shown on the public homepage
- You log in to `/admin` with your GitHub account
- Supabase checks if your profile has `is_admin = true`
- You see all pending servers and can approve or reject each one

### Copilot Prompt — Build the Admin Panel

```
Create an admin panel page at app/admin/page.tsx for my MCP Registry.

This is a Next.js 14 server component that:
1. Checks if the current user is an admin using Supabase
2. If not admin (or not logged in), redirects to homepage
3. Fetches all 'pending' servers using getPendingServers() from @/lib/db

Layout:
- Heading: 'Admin Panel — Pending Submissions (X)'
- For each pending server, show a card with:
  - Server name, description, GitHub URL (clickable), install command, categories
  - Submission date
  - Two buttons: green 'Approve' and red 'Reject'
  - A text input for rejection reason (appears when Reject is clicked)
- Approval/rejection handled by a server action
- After action, revalidate the page
- Show 'Nothing to review!' when queue is empty
- TypeScript, Tailwind CSS
```

### Copilot Prompt — Admin Server Actions

```
Create a server actions file at app/admin/actions.ts.

Use 'use server' directive.

Functions:
1. approveServer(id: string) — update status to 'approved'
2. rejectServer(id: string, reason: string) — update status to 'rejected' with reason

Each function should:
- Check the current user is an admin
- If not admin, throw an error
- Call Supabase with service role key for admin operations
- Call revalidatePath('/admin') after updating
- Return { success: boolean, error?: string }

TypeScript.
```

---

## SECTION 6 — Public API Endpoint

### API Design

| Endpoint | Method | What It Returns |
|---|---|---|
| `GET /api/servers` | GET | All approved servers as JSON array |
| `GET /api/servers?search=postgres` | GET | Servers matching search |
| `GET /api/servers?category=database` | GET | Servers in a category |
| `GET /api/servers?limit=5` | GET | First 5 servers |
| `GET /api/stats` | GET | Total counts and categories |

### Copilot Prompt — Build the API

```
Create two API route files for my MCP Registry:

1. app/api/servers/route.ts
   - GET handler
   - Query params: search (string), category (string), limit (number, default 50, max 100), page (number)
   - Fetch from Supabase mcp_servers table where status = 'approved'
   - Return JSON: { data: McpServer[], total: number, page: number }
   - Add CORS headers: Access-Control-Allow-Origin: *
   - Add Cache-Control header: public, s-maxage=60
   - TypeScript

2. app/api/stats/route.ts
   - GET handler
   - Return JSON: { total_servers: number, total_categories: number, categories: string[] }
   - Cache for 5 minutes
   - TypeScript
```

### API Documentation for README

```markdown
## 🔌 Public API

MCP Registry has a free, open API. No authentication required.

**Base URL:** `https://mcpregistry.dev/api`

### Get all servers
GET /api/servers
GET /api/servers?search=postgres
GET /api/servers?category=database

### Example response
{
  "data": [
    {
      "id": "uuid",
      "name": "postgres-mcp",
      "description": "Connect Claude to PostgreSQL",
      "install_command": "npx @benborla29/mcp-server-postgresql",
      "github_stars": 847
    }
  ],
  "total": 47
}
```

---

## SECTION 7 — Security & Spam Protection

### Rate Limiting Prompt

```
Add rate limiting to my submit server form to prevent spam.

In app/submit/page.tsx or a new API route:

Requirements:
- Allow max 3 submissions per user per day
- Check by querying Supabase: count submissions by submitted_by in last 24 hours
- If over limit, show error: 'You can submit up to 3 servers per day. Please try again tomorrow.'
- Also validate on the server side:
  - github_url must start with https://github.com/
  - name must be 3-50 characters
  - description must be 20-200 characters
  - install_command must not be empty
- Return clear error messages for each validation failure
- TypeScript
```

### Security Checklist

- ⚠️ NEVER commit `.env.local` to GitHub — add it to `.gitignore`
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` is a master key — only use it in server-side code
- ⚠️ `NEXT_PUBLIC_` prefix means value is visible in browser — no secrets there
- ⚠️ Rotate your GitHub OAuth secret if you accidentally expose it
- ✅ Enable 2FA on GitHub, Supabase, and Vercel accounts
- ✅ Supabase RLS policies enforce security server-side
- ✅ Never trust client-side data — always validate on server too

---

## SECTION 8 — Launch Strategy & Viral Posts

### Pre-Launch Checklist

- ☐ Site is live on Vercel with a real domain
- ☐ At least 10 real MCP servers in the database
- ☐ Search, filters, and submit form all work
- ☐ GitHub OAuth login works
- ☐ README.md is complete and looks great
- ☐ OG image created for social sharing (public/og-image.png)
- ☐ Tested on mobile phone
- ☐ Admin panel works — you can approve/reject
- ☐ No console errors or TypeScript errors
- ☐ Asked 2-3 developer friends to test

---

### Hacker News — "Show HN" Post

> ⏰ Post Tuesday–Thursday between 8–10am EST for maximum visibility

```
Show HN: MCP Registry — Open-source registry to discover MCP servers for AI agents

I built an open-source registry for Model Context Protocol (MCP) servers — think npm, but for AI tool integrations.

MCP is Anthropic's standard for connecting AI agents to external tools (databases, APIs, file systems, etc.). Developers have been publishing MCP servers scattered across GitHub with no central place to find them. This fixes that.

What it does:
- Search and browse 40+ MCP servers by category
- One-click copy install commands
- Submit your own MCP server in 2 minutes (GitHub login)
- Free public API: GET /api/servers

Tech stack: Next.js 14, Supabase, TypeScript, Tailwind, Vercel
Fully open source: github.com/YOUR-USERNAME/mcp-registry

Feedback welcome — especially from people building AI agents.
```

---

### Reddit — r/LocalLLaMA Post

```
Title: I built an open-source MCP server registry — like npm but for AI tool integrations

Been frustrated that there's no central place to find MCP servers. Built one this week.

MCP Registry: [your-url]

Features:
→ Search 40+ MCP servers (postgres, filesystem, GitHub, Slack, browser automation, etc.)
→ Filter by category
→ One-click copy install commands
→ Submit your own server
→ Free API endpoint

Open source on GitHub. Built with Next.js + Supabase.

What MCP servers are you using that aren't listed yet? I'll add them.
```

---

### Reddit — r/ClaudeAI Post

```
Title: Built an open-source registry to discover MCP servers for Claude

If you're using Claude with MCP tools, this might be useful:

MCP Registry — [your-url]

It's a searchable database of MCP servers organized by category. Makes it way easier to find the right tool for your workflow.

Currently have 40+ servers including postgres, filesystem, GitHub, Slack, web search, browser automation, and more.

It's open source and you can submit servers too. What integrations are you missing?
```

---

### Twitter/X Thread

```
Tweet 1:
I built an open-source MCP server registry.

Like npm, but for AI tool integrations.

→ Search 40+ MCP servers
→ Filter by category
→ Copy install commands instantly
→ Free public API

[your-url] 🧵

---
Tweet 2:
What is MCP?

Model Context Protocol lets AI agents connect to external tools — databases, APIs, file systems, calendars, browsers.

The problem: developers publish MCP servers scattered across GitHub.

No central place to find them. Until now.

---
Tweet 3:
The registry has servers for:

🗄️ Databases (postgres, sqlite, redis)
📁 File systems
🔍 Web search (Brave)
💻 GitHub
💬 Slack
🌐 Browser automation
🗺️ Google Maps
...and more

---
Tweet 4:
It's fully open source.

Stack: Next.js 14 + Supabase + TypeScript + Tailwind

Free public API:
GET [your-url]/api/servers

Submit your own MCP server in 2 minutes.

GitHub: [your-github-url]

What MCP servers should I add next? 👇
```

---

### Discord Communities to Post In

| Community | Where to Post | What to Say |
|---|---|---|
| Anthropic Discord | #mcp-tools or #show-and-tell | Share as a resource for MCP developers |
| LangChain Discord | #show-your-work | Frame it as tool discovery for agent builders |
| AI Engineers Discord | #projects | Lead with the free API and open source angle |
| Pydantic AI Discord | #general | Mention Python-compatible MCP servers |

### Post-Launch Week Schedule

| Day | Action |
|---|---|
| Day 1 | Post HN Show HN + Reddit r/LocalLLaMA + Twitter thread simultaneously |
| Day 2 | Reply to every comment on HN and Reddit — engagement boosts ranking |
| Day 2 | Post in Discord communities (don't spam — be genuine) |
| Day 3 | Submit to ProductHunt — separate launch for different audience |
| Day 4 | Write a blog post: "How I Built an Open-Source MCP Registry in 2 Weeks" |
| Day 5 | Email 5 popular MCP server creators on GitHub — invite them to submit |
| Day 7 | Tweet a follow-up with stats: "Week 1: X visitors, Y stars, Z servers submitted" |

---

## SECTION 9 — Monetization & Growth

### Revenue Model

| Tier | Price | What's Included | Who It's For |
|---|---|---|---|
| Open Source | Free forever | Full product, self-host, unlimited everything | Individual devs |
| Cloud Hobby | $9/mo | Hosted, analytics dashboard, email notifications | Indie builders |
| Cloud Pro | $49/mo | Private registry, team access, higher API limits | Small teams |
| Enterprise | $299+/mo | Custom domain, SSO, SLA, dedicated support | Companies |

### Month-by-Month Roadmap

| Month | Focus | Goal |
|---|---|---|
| Month 1 | Build + launch open source | 100 GitHub stars, 50 servers listed |
| Month 2 | Community growth, fix bugs, add features from feedback | 500 stars, 200 daily visitors |
| Month 3 | Launch cloud hosted version (Hobby tier) | First $200–500 MRR |
| Month 4 | Add Pro tier, write blog posts, reach out to AI newsletters | $1k–2k MRR |
| Month 5–6 | Enterprise outreach, add private registry feature | $3k–5k MRR |
| Month 6+ | Partner with Anthropic/LangChain ecosystem tools | $5k–10k+ MRR |

### Growth Levers
- **"Awesome MCP Servers" GitHub repo** — a companion repo with 1000+ stars pointing back to your registry
- **SEO blog posts** — "Top 10 MCP servers for developers", "How to connect Claude to your database"
- **VS Code extension** — browse and install MCP servers from inside VS Code
- **Weekly newsletter** — "MCP Server of the Week" — free, drives return visitors
- **Partner with agent frameworks** — get featured in LangChain, CrewAI docs
- **README badge** — "Listed on MCP Registry" badge developers put in their repos

### Tools for Cloud Hosting (when ready)

| What to Add | Tool | Cost |
|---|---|---|
| Payments | Stripe (stripe.com) | 2.9% + 30c per transaction |
| Email | Resend (resend.com) | Free up to 100 emails/day |
| Analytics | Vercel Analytics (built-in) | Free on Vercel |
| Monitoring | Sentry.io | Free for small projects |
| Newsletter | Beehiiv or Buttondown | Free under 1,000 subscribers |
| Status page | Instatus.com | Free tier available |

---

## 🏁 Master Build Checklist

| # | Task | Section | Done? |
|---|---|---|---|
| 1 | Set up Node.js, VS Code, Git | Pre-setup | ☐ |
| 2 | Create Next.js project + install dependencies | Section 1 | ☐ |
| 3 | Create Supabase project + run all SQL | Section 2 | ☐ |
| 4 | Make yourself an admin in the database | Section 2 | ☐ |
| 5 | Create .env.local with all keys | Section 3 | ☐ |
| 6 | Set up GitHub OAuth in Supabase | Section 3 | ☐ |
| 7 | Create types/index.ts | Section 4 | ☐ |
| 8 | Create lib/supabase.ts and lib/db.ts | Section 4 | ☐ |
| 9 | Build all UI components (Navbar, Footer, ServerCard, etc.) | Section 4 | ☐ |
| 10 | Build all pages (Homepage, Detail, Submit, Login) | Section 4 | ☐ |
| 11 | Create 404 page and sitemap | Section 4 | ☐ |
| 12 | Build admin panel + server actions | Section 5 | ☐ |
| 13 | Build public API routes | Section 6 | ☐ |
| 14 | Add input validation and rate limiting | Section 7 | ☐ |
| 15 | Test everything locally | Pre-deploy | ☐ |
| 16 | Write README.md | Section 8 | ☐ |
| 17 | Push to GitHub | Deploy | ☐ |
| 18 | Deploy on Vercel + set env variables | Deploy | ☐ |
| 19 | Test live site + mobile | Post-deploy | ☐ |
| 20 | Post Show HN + Reddit + Twitter/X | Section 8 | ☐ |
| 21 | Reply to all comments within 24 hours | Section 8 | ☐ |
| 22 | Submit to ProductHunt | Section 8 | ☐ |

---

> *This is your complete blueprint. Every question you'll have is answered in here.*
>
> **Start at Checklist #1 and go down. Ship it. 🚀**
