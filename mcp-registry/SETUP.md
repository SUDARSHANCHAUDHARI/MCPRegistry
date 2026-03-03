# 🚀 MCP Registry Setup Guide

Complete these steps to get the MCP Registry running locally and deployed to production.

## Step 1: Create a Supabase Project ✅

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Sign in or create a new account with GitHub
4. Fill in:
   - **Organization**: Create new or select existing
   - **Project name**: `mcp-registry`
   - **Database password**: Create a strong password (save it!)
   - **Region**: Choose closest to you (e.g., us-east-1)
5. Click "Create new project" and wait ~2 minutes

## Step 2: Run Database Schema 🗄️

1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click "New query"
3. Copy the entire contents of `docs/database-schema.sql`
4. Paste into the SQL editor
5. Click "Run"
6. Wait for completion

Your 10 sample MCP servers are now in the database!

## Step 3: Set Your Admin Status 👑

1. In Supabase, go to **SQL Editor** → **New query**
2. Run this SQL:

```sql
update profiles
set is_admin = true
where github_username = 'your-github-username';

-- Verify it worked:
select id, github_username, is_admin from profiles;
```

Replace `your-github-username` with your actual GitHub username (the one that appears in your profile URL github.com/yourname).

## Step 4: Get Your Supabase API Keys 🔑

1. In Supabase, go to **Settings** → **API** (left sidebar under Project)
2. Copy these values:
   - **Project URL**: Looks like `https://xxxxx.supabase.co`
   - **anon public**: Large string starting with `eyJ...`

3. Copy the full values to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
SYNC_SECRET=make-up-any-random-string
```

## Step 5: Set Up GitHub OAuth 🐙

### Get GitHub Credentials

1. Go to GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**
2. Fill in:
   - **Application name**: `MCP Registry`
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
     - Replace `YOUR-PROJECT` with your Supabase project ID (from the URL in Supabase)
3. Click "Register application"
4. Copy:
   - **Client ID**
   - **Client secret** (click "Generate a new client secret")

### Configure GitHub OAuth in Supabase

1. In Supabase, go to **Authentication** → **Providers** (left sidebar)
2. Find **GitHub** and toggle it **ON**
3. Paste your GitHub OAuth credentials:
   - **Client ID**: From GitHub
   - **Client Secret**: From GitHub
4. Click **Save**

## Step 6: Create .env.local 📝

Create a file named `.env.local` in the root of your project:

```bash
# Project root: /Users/sudarshan/SUDARSHAN_CODE/sudarshan_repos/MCPRegistry/mcp-registry/.env.local

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-step-4
NEXT_PUBLIC_APP_URL=http://localhost:3000
SYNC_SECRET=your-random-secret-here-abc123
```

## Step 7: Run Locally 🏃

```bash
cd /Users/sudarshan/SUDARSHAN_CODE/sudarshan_repos/MCPRegistry/mcp-registry
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see:
- 10 sample MCP servers
- Search bar
- Category filters
- "+ Submit Server" button

### Test Login

1. Click "+ Submit Server"
2. Click "Login with GitHub"
3. Authorize the GitHub OAuth app
4. You should be redirected back and logged in ✅

### Test Admin Panel

1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. If you set yourself as admin in Step 3, you should see pending servers
3. Click "Approve" or "Reject" to manage submissions ✅

## Step 8: Deploy to Vercel 🌐

### Prerequisites

- GitHub repository pushed with your code
- Vercel account (free at [vercel.com](https://vercel.com))

### Deploy Steps

1. Go to [vercel.com](https://vercel.com)
2. Log in with GitHub
3. Click "Add New Project"
4. Find your `mcp-registry` repository and click "Import"
5. Under "Environment Variables", add:
   ```
   NEXT_PUBLIC_SUPABASE_URL = your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
   NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
   SYNC_SECRET = your-random-secret
   ```
6. Click "Deploy"

Your site is now live! 🎉

### Update GitHub OAuth for Production

1. Go to GitHub, find your OAuth app settings
2. Update **Authorization callback URL** to:
   ```
   https://your-domain.vercel.app/auth/callback
   ```
3. Save

## Step 9: Launch! 🚀

Post on:
- **Hacker News** — [Show HN section](https://news.ycombinator.com/newest?sort=new)
- **Reddit** — r/LocalLLaMA, r/ClaudeAI, r/MachineLearning
- **Twitter/X** — Share your launch tweet
- **Discord** — Anthropic, LangChain, AI communities

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot read properties of undefined" (Supabase null) | .env.local not loaded, restart `npm run dev` |
| 401 Unauthorized on /admin | Not set as admin, run Step 3 SQL query |
| GitHub login redirects to different page | Check Authorization callback URL matches exactly |
| Search not working | Database tables not created, re-run database-schema.sql |
| "Unique violation" error when submitting | GitHub URL already submitted, choose different repo |

For more help, open a GitHub issue: https://github.com/sudarshan/mcp-registry/issues

---

You're all set! 🎉 Run `npm run dev` and visit [http://localhost:3000](http://localhost:3000)
