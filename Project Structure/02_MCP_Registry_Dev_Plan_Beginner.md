# 🛠️ MCP Registry — Step-by-Step Dev Plan
> For Beginners — Every Command. Every File. Every Step Explained.

| ⏱ Total Time | 💰 Cost | 🧠 Skill Level | 🚀 Result |
|---|---|---|---|
| 1–2 Weeks | $0 to start | Beginner-friendly | Live website + open source product |

---

## 0. Before You Write Any Code

### 0.1 What is MCP?
MCP stands for Model Context Protocol. It's a standard created by Anthropic that lets AI assistants (like Claude) connect to external tools — databases, file systems, APIs, calendars, and more.

Developers build "MCP servers" — small programs that give AI models new powers. Right now these servers are scattered across GitHub with no central place to find them. That's the gap you're filling.

### 0.2 What is a Registry?
A registry is just a searchable list. npm is a registry for JavaScript packages. PyPI is a registry for Python packages. You're building one for MCP servers.

### 0.3 The Tech Stack — Simply Explained

| Technology | What It Is | Your Job |
|---|---|---|
| Next.js | Framework to build websites with JavaScript | The main thing you'll write |
| Tailwind CSS | Tool to make your site look good without writing much CSS | Add class names to make things pretty |
| Supabase | Your database — stores all the MCP servers | Set it up once, then query it |
| GitHub OAuth | Login with GitHub button | Users sign in with their GitHub account |
| Vercel | Where your website lives on the internet | Deploy with 1 click, completely free |

---

## 1. Set Up Your Computer (Day 1 — ~2 hours)

You only do this once. These are the tools every web developer needs.

### Step 1 — Install Node.js
Download from [nodejs.org](https://nodejs.org) — choose the **LTS** version (the stable one).

### Step 2 — Install VS Code
Download from [code.visualstudio.com](https://code.visualstudio.com). It's free.

### Step 3 — Install Git
Download from [git-scm.com](https://git-scm.com).

### Step 4 — Create a GitHub account
Go to [github.com](https://github.com) and sign up.

### Step 5 — Create a Supabase account
Go to [supabase.com](https://supabase.com) and sign up for free.

### Step 6 — Create a Vercel account
Go to [vercel.com](https://vercel.com) and sign up with your GitHub account.

### 1.1 Verify Everything Works

Open your terminal and run these one by one:

```bash
# Check Node.js is installed (should show v20.x.x)
node --version

# Check npm is installed
npm --version

# Check Git is installed
git --version
```

If all three show version numbers — you're ready! ✅

---

## 2. Create Your Project (Day 1 — ~1 hour)

### 2.1 Create a New Next.js App

```bash
# Go to your projects folder
cd ~/Desktop

# Create the project
npx create-next-app@latest mcp-registry
```

Answer the questions exactly like this:

| Question | Answer | Why |
|---|---|---|
| Would you like to use TypeScript? | Yes | Catches errors before they happen |
| Would you like to use ESLint? | Yes | Keeps your code clean |
| Would you like to use Tailwind CSS? | Yes | Makes styling easy |
| Would you like to use the src/ directory? | No | Simpler file structure |
| Would you like to use App Router? | Yes | Modern Next.js way of routing |
| Would you like to customize import alias? | No | Keep default |

### 2.2 Open in VS Code

```bash
cd mcp-registry
code .
```

### 2.3 Understand the Folder Structure

| File / Folder | What It Does |
|---|---|
| `app/` | All your pages live here. app/page.tsx is your homepage |
| `app/layout.tsx` | The outer wrapper of every page (navbar, footer go here) |
| `public/` | Static files like images and icons |
| `package.json` | List of all your dependencies |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `.env.local` | Secret keys (never share this!) |

### 2.4 Run the App for the First Time

```bash
npm run dev
# Open http://localhost:3000 in your browser
```

You should see the Next.js welcome page. Your web app is running! 🎉

---

## 3. Set Up Your Database (Day 2 — ~2 hours)

### 3.1 Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and log in
2. Click "New Project"
3. Name it "mcp-registry"
4. Choose a strong database password (save it!)
5. Click "Create new project" and wait ~2 minutes

### 3.2 Create Your Database Tables

In Supabase → SQL Editor, run this SQL:

```sql
create table mcp_servers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  github_url text not null unique,
  install_command text not null,
  category text[] default '{}',
  github_stars integer default 0,
  verified boolean default false,
  submitted_by uuid references auth.users(id),
  created_at timestamp with time zone default now()
);

-- Allow anyone to read servers
alter table mcp_servers enable row level security;
create policy "Anyone can read" on mcp_servers for select using (true);

-- Only logged-in users can submit
create policy "Logged in users can insert" on mcp_servers
  for insert with check (auth.uid() = submitted_by);
```

### 3.3 Add Sample Data

```sql
insert into mcp_servers (name, description, github_url, install_command, category, github_stars, verified)
values
  ('postgres-mcp', 'Connect Claude to your PostgreSQL database',
   'https://github.com/example/postgres-mcp',
   'npx postgres-mcp', '{"database","sql"}', 234, true),

  ('filesystem-mcp', 'Give Claude access to read and write files',
   'https://github.com/example/filesystem-mcp',
   'npx filesystem-mcp', '{"files","storage"}', 189, true),

  ('google-calendar-mcp', 'Let Claude manage your Google Calendar',
   'https://github.com/example/gcal-mcp',
   'npx google-calendar-mcp', '{"calendar","google"}', 156, false);
```

### 3.4 Get Your Supabase Keys

In Supabase → Settings → API, copy:
- **Project URL** — looks like: `https://abcdefgh.supabase.co`
- **anon public key** — a long string

Create `.env.local` in your project root:

```bash
# .env.local — never share this file!
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3.5 Install Supabase

```bash
npm install @supabase/supabase-js
npm install @supabase/ssr
```

---

## 4. Build the Pages (Days 3–7)

You'll build 4 main pages:

| Page | File Location | What It Does |
|---|---|---|
| Homepage / Search | `app/page.tsx` | List all MCP servers, search bar, category filters |
| Server Detail | `app/servers/[id]/page.tsx` | Full info about one MCP server |
| Submit Server | `app/submit/page.tsx` | Form to add a new MCP server |
| Login | `app/login/page.tsx` | Login with GitHub button |

### 4.1 Create the Supabase Client

Create `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### 4.2 Homepage — `app/page.tsx`

```typescript
import { supabase } from '@/lib/supabase'
import ServerCard from '@/components/ServerCard'
import SearchBar from '@/components/SearchBar'

async function getServers(search?: string) {
  let query = supabase
    .from('mcp_servers')
    .select('*')
    .order('github_stars', { ascending: false })

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data } = await query
  return data || []
}

export default async function HomePage({ searchParams }) {
  const servers = await getServers(searchParams.search)

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-2">
        MCP Server Registry
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Discover and share MCP servers for AI agents
      </p>
      <SearchBar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {servers.map(server => (
          <ServerCard key={server.id} server={server} />
        ))}
      </div>
    </main>
  )
}
```

### 4.3 ServerCard Component — `components/ServerCard.tsx`

```typescript
import Link from 'next/link'

export default function ServerCard({ server }) {
  return (
    <Link href={`/servers/${server.id}`}>
      <div className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer">
        <div className="flex justify-between items-start">
          <h2 className="font-semibold text-lg">{server.name}</h2>
          {server.verified && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
              ✓ Verified
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mt-1">{server.description}</p>
        <div className="flex gap-2 mt-3 flex-wrap">
          {server.category.map(cat => (
            <span key={cat} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
              {cat}
            </span>
          ))}
        </div>
        <p className="text-gray-400 text-xs mt-2">⭐ {server.github_stars} stars</p>
      </div>
    </Link>
  )
}
```

### 4.4 Server Detail Page — `app/servers/[id]/page.tsx`

```typescript
import { supabase } from '@/lib/supabase'

export default async function ServerPage({ params }) {
  const { data: server } = await supabase
    .from('mcp_servers')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!server) return <div>Server not found</div>

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{server.name}</h1>
      <p className="text-gray-600 mt-2">{server.description}</p>

      <div className="bg-gray-900 text-green-400 p-4 rounded-lg mt-6">
        <p className="text-xs text-gray-400 mb-1">Install command:</p>
        <code>{server.install_command}</code>
      </div>

      <a href={server.github_url}
        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
        target="_blank">
        View on GitHub ↗
      </a>
    </main>
  )
}
```

### 4.5 Submit Form — `app/submit/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SubmitPage() {
  const [form, setForm] = useState({
    name: '', description: '', github_url: '', install_command: '', category: ''
  })
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const { error } = await supabase.from('mcp_servers').insert([{
      ...form,
      category: form.category.split(',').map(c => c.trim()),
    }])
    if (!error) setSubmitted(true)
  }

  if (submitted) return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold">✅ Submitted!</h2>
      <p>Your server is pending review.</p>
    </div>
  )

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Submit an MCP Server</h1>
      <div className="space-y-4">
        <input placeholder="Server name" className="w-full border p-2 rounded"
          onChange={e => setForm({...form, name: e.target.value})} />
        <textarea placeholder="Description" className="w-full border p-2 rounded"
          onChange={e => setForm({...form, description: e.target.value})} />
        <input placeholder="GitHub URL" className="w-full border p-2 rounded"
          onChange={e => setForm({...form, github_url: e.target.value})} />
        <input placeholder="Install command (e.g. npx my-mcp)" className="w-full border p-2 rounded"
          onChange={e => setForm({...form, install_command: e.target.value})} />
        <input placeholder="Categories (comma separated: database, api)" className="w-full border p-2 rounded"
          onChange={e => setForm({...form, category: e.target.value})} />
        <button onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold">
          Submit Server
        </button>
      </div>
    </main>
  )
}
```

---

## 5. Add GitHub Login (Day 5 — ~2 hours)

### 5.1 Enable GitHub OAuth in Supabase
1. Go to Supabase → Authentication → Providers → GitHub → toggle ON
2. Go to GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App
3. Fill in: Homepage URL: `http://localhost:3000` | Callback URL: `https://your-project.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret back into Supabase

### 5.2 Navbar with Login — `components/Navbar.tsx`

```typescript
'use client'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Navbar() {
  async function loginWithGitHub() {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin }
    })
  }

  return (
    <nav className="border-b px-4 py-3 flex justify-between items-center">
      <Link href="/" className="font-bold text-blue-600 text-lg">
        🔌 MCP Registry
      </Link>
      <div className="flex gap-3">
        <Link href="/submit" className="text-sm border px-3 py-1 rounded hover:bg-gray-50">
          + Submit Server
        </Link>
        <button onClick={loginWithGitHub}
          className="text-sm bg-gray-900 text-white px-3 py-1 rounded">
          Login with GitHub
        </button>
      </div>
    </nav>
  )
}
```

---

## 6. Deploy to the Internet (Day 7 — ~1 hour)

### 6.1 Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit - MCP Registry"
git remote add origin https://github.com/YOUR-USERNAME/mcp-registry.git
git push -u origin main
```

### 6.2 Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and log in with GitHub
2. Click "Add New Project"
3. Find your mcp-registry repo and click Import
4. Add your environment variables (Supabase URL and key)
5. Click Deploy — live in ~2 minutes! 🎉

---

## 7. What to Build After Launch

| Feature | Difficulty | Why It Matters | When |
|---|---|---|---|
| Category filter buttons | Easy | Let users browse by type | Week 2 |
| Search as you type | Easy | Better UX | Week 2 |
| GitHub star auto-sync | Medium | Keep counts accurate | Week 3 |
| User profile page | Medium | See your submissions | Week 3 |
| Admin approval flow | Medium | Review before going live | Week 3 |
| API endpoint | Medium | Let other tools query you | Week 4 |

---

## 8. Common Errors & Fixes

| Error | What It Means | How to Fix |
|---|---|---|
| Module not found | Package isn't installed | Run: `npm install [package-name]` |
| Cannot read properties of undefined | Something is null | Add: `if (!data) return null` |
| Failed to fetch / CORS error | Can't reach Supabase | Check your `.env.local` |
| 404 page not found | Route doesn't exist | Check folder/file names match URL |
| Row Level Security violation | Database rejected query | Check Supabase RLS policies |
| Build failed on Vercel | Error in your code | Read Vercel build logs |

---

## 9. Learning Resources

- **Next.js docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase docs:** [supabase.com/docs](https://supabase.com/docs)
- **Tailwind CSS:** [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **When stuck:** Ask Claude — paste your error and the code around it
- **Stack Overflow:** Search your exact error message
- **Supabase Discord:** [discord.supabase.com](https://discord.supabase.com)

---

## ✅ Complete Checklist

| # | Task | Day | Done? |
|---|---|---|---|
| 1 | Install Node.js, VS Code, Git | Day 1 | ☐ |
| 2 | Create GitHub + Supabase + Vercel accounts | Day 1 | ☐ |
| 3 | Create Next.js project | Day 1 | ☐ |
| 4 | Create Supabase database tables | Day 2 | ☐ |
| 5 | Add .env.local with Supabase keys | Day 2 | ☐ |
| 6 | Build homepage (app/page.tsx) | Day 3 | ☐ |
| 7 | Build ServerCard component | Day 3 | ☐ |
| 8 | Build server detail page | Day 4 | ☐ |
| 9 | Build submit form page | Day 4 | ☐ |
| 10 | Add GitHub login | Day 5 | ☐ |
| 11 | Add Navbar with login button | Day 5 | ☐ |
| 12 | Test everything locally | Day 6 | ☐ |
| 13 | Push code to GitHub | Day 7 | ☐ |
| 14 | Deploy on Vercel | Day 7 | ☐ |
| 15 | Share your live URL! | Day 7 | ☐ |

---

> *You don't need to know everything before you start. Start with Step 1. Ask for help when stuck. Ship it. 🚀*
