# Setup Guide

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free)
- A GitHub account (for OAuth)

---

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → "New Project"
2. Fill in project name (`mcp-registry`), password, and region
3. Wait ~2 minutes for provisioning

---

## Step 2: Run Database Migrations

In Supabase → **SQL Editor**, run these files **in order**:

1. `docs/database-schema.sql` — Core tables + 10 sample servers
2. `docs/database-additions.sql` — Ratings, analytics, health tables
3. `docs/database-features.sql` — Tags, collections, badges, changelog, moderation

---

## Step 3: Get Supabase API Keys

In Supabase → **Settings** → **API**:

- Copy **Project URL** (e.g. `https://xxxxx.supabase.co`)
- Copy **anon public** key (starts with `eyJ...`)

---

## Step 4: Set Up GitHub OAuth

1. GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**
2. Fill in:
   - Homepage URL: `http://localhost:3000`
   - Callback URL: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
3. Copy the **Client ID** and generate a **Client Secret**
4. In Supabase → **Authentication** → **Providers** → **GitHub**, paste both values and save

---

## Step 5: Configure Environment

Create `.env.local` in the `mcp-registry/` directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
SYNC_SECRET=generate-a-random-32-char-string
```

> **Note:** `.env.local` is gitignored — never commit it.

Optional variables:
```bash
GITHUB_TOKEN=ghp_...          # Increases GitHub API rate limit for star sync
RESEND_API_KEY=re_...         # Enables email notifications
```

---

## Step 6: Run Locally

```bash
cd mcp-registry
pnpm install
pnpm dev
# Open http://localhost:3000
```

---

## Step 7: Set Yourself as Admin

After logging in via GitHub, run this in Supabase SQL Editor:

```sql
UPDATE profiles
SET is_admin = true
WHERE github_username = 'your-github-username';
```

Then visit `/admin/moderation` and `/admin/analytics`.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank page / Supabase errors | Check `.env.local` values, restart `pnpm dev` |
| 401 on `/admin` | Run the admin SQL above |
| GitHub login fails | Verify OAuth callback URL matches exactly |
| Search returns nothing | Re-run `database-schema.sql` migrations |
| `next/server` type errors | Run `pnpm install` — node_modules missing |
