# ⚡ Copilot Prompt Pack — MCP Registry
> Copy. Paste. Build. Every prompt you need, in order.

| 🗂️ 6 Phases | 📋 50+ Prompts | 🛠️ VS Code + Copilot | 🚀 1–2 Week Build |
|---|---|---|---|

## How to Use This
1. Open VS Code with GitHub Copilot installed
2. Open Copilot Chat: `Ctrl+Shift+I` (Windows) / `Cmd+Shift+I` (Mac)
3. Copy the prompt and paste into Copilot Chat
4. Review generated code before using it
5. Go in order — each phase builds on the previous one

---

## PHASE 0 — Project Setup & Structure

### 0.1 — Create the project (run in terminal, not Copilot)

```bash
npx create-next-app@latest mcp-registry --typescript --tailwind --eslint --app --no-src-dir
cd mcp-registry
npm install @supabase/supabase-js @supabase/ssr
code .
```

---

### 0.2 — Ask Copilot to explain the folder structure

```
I just created a Next.js 14 project with TypeScript, Tailwind CSS, and the App Router.
Explain what each folder and file does:
- app/
- app/layout.tsx
- app/page.tsx
- public/
- package.json
- tailwind.config.ts
- next.config.js

Give me a simple explanation for each, like I'm new to web development.
```

---

### 0.3 — Set up the project file structure

```
I'm building an MCP Server Registry website with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

Create the complete folder and file structure I need. For each file, give me:
1. The full file path
2. One sentence explaining what it does
3. Whether I need to create it manually or if it already exists

The project needs:
- A homepage with search and server listing
- A server detail page
- A submit new server form
- GitHub OAuth login
- A shared Navbar and Footer component
- A Supabase client helper
- Type definitions for my data
```

---

### 0.4 — Create TypeScript types

```
Create a TypeScript types file at types/index.ts for my MCP Registry project.

I need types for:
1. McpServer — with fields: id (string), name (string), description (string),
   github_url (string), install_command (string), category (string array),
   github_stars (number), verified (boolean), submitted_by (string), created_at (string)
2. SubmitServerForm — same as McpServer but without id, verified, submitted_by, created_at
3. SearchParams — with optional: search (string), category (string)
4. User — with: id (string), email (string), avatar_url (string), user_name (string)

Use proper TypeScript syntax. Export all types.
```

> 💡 After pasting this, Copilot will generate types/index.ts. Create the file and paste the code in.

---

### 0.5 — Create the Supabase client helper

```
Create a Supabase client helper file at lib/supabase.ts for a Next.js 14 App Router project.

Requirements:
- Import createClient from @supabase/supabase-js
- Use environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- Export a single supabase client instance
- Add TypeScript types
- Add a comment explaining what this file does

Also show me exactly what to put in my .env.local file.
```

---

## PHASE 1 — Database & Supabase Setup

> Run the SQL in the Supabase SQL Editor, not in VS Code.

### 1.1 — Generate the database schema SQL

```
Generate the complete PostgreSQL SQL for my MCP Registry database on Supabase.

I need:
1. A table called mcp_servers with columns:
   - id: UUID primary key, auto-generated
   - name: text, required
   - description: text, required
   - github_url: text, required, unique
   - install_command: text, required
   - category: text array, default empty array
   - github_stars: integer, default 0
   - verified: boolean, default false
   - submitted_by: UUID, references auth.users(id)
   - created_at: timestamp with timezone, default now()

2. Row Level Security (RLS) policies:
   - Anyone can read (SELECT) all servers
   - Only authenticated users can insert, and submitted_by must equal their user ID
   - Only admins can update/delete

3. An index on the name column for faster search
4. A full-text search index on name and description combined

Format as clean SQL I can paste into Supabase SQL Editor.
```

---

### 1.2 — Generate sample seed data

```
Generate SQL INSERT statements to add 10 realistic sample MCP servers to my mcp_servers table.

Make them diverse across these categories: database, filesystem, api, calendar, email, search, browser, code, communication, productivity

Each server should have:
- A realistic name (like 'postgres-mcp', 'gmail-mcp')
- A helpful description (1-2 sentences)
- A plausible GitHub URL
- A real-looking install command (npx or pip)
- 1-3 relevant category tags
- Between 50-500 github_stars
- verified = true for the top 5, false for others

Format as a single INSERT statement.
```

---

### 1.3 — Create database helper functions

```
Create a file lib/db.ts with helper functions for all my Supabase database queries.

The file should use the supabase client from lib/supabase.ts and the McpServer type from types/index.ts.

Functions I need:
1. getAllServers(search?: string, category?: string) — fetch all servers, optionally filtered
2. getServerById(id: string) — fetch one server by ID
3. submitServer(server: SubmitServerForm, userId: string) — insert a new server
4. getCategories() — get all unique categories from the database
5. getServerCount() — get total number of servers

Each function should:
- Return proper TypeScript types
- Handle errors gracefully (return null or empty array on error)
- Have a JSDoc comment explaining what it does
```

> 💡 This is the most important file — all your pages will import from here instead of calling Supabase directly.

---

## PHASE 2 — UI Components

> Build reusable components first. Pages will import these. Open each file in VS Code before running the prompt.

### 2.1 — Navbar component

```
Create a Navbar component at components/Navbar.tsx for my MCP Registry website.

Design requirements:
- Clean, modern navbar with a white background and bottom border
- Left side: Logo (plug emoji + 'MCP Registry' text in blue, links to homepage)
- Right side: 'Submit Server' button (outlined) and 'Login with GitHub' button (dark)
- Use Tailwind CSS for all styling
- The login button should call a loginWithGitHub() function using Supabase OAuth
- Import supabase from @/lib/supabase
- Mark as 'use client' since it has interactivity
- Make it responsive (hamburger menu on mobile is optional for now)
- TypeScript, no props needed
```

---

### 2.2 — Footer component

```
Create a Footer component at components/Footer.tsx for my MCP Registry website.

Requirements:
- Simple, clean footer with a light gray background
- Left side: Copyright text '© 2025 MCP Registry — Open Source'
- Center: Links to GitHub repo, Submit Server page, and API docs (placeholder link)
- Right side: 'Built for the AI community' tagline
- Use Tailwind CSS
- No 'use client' needed (static component)
- TypeScript
```

---

### 2.3 — ServerCard component

```
Create a ServerCard component at components/ServerCard.tsx.

It receives a server prop of type McpServer (import from @/types).

Design:
- White card with border, rounded corners, subtle hover shadow
- Top row: server name (bold) on left, blue 'Verified' badge on right (only if verified=true)
- Description text below (gray, 2 lines max with text-overflow)
- Category tags row (small pill badges in light gray)
- Bottom row: GitHub stars count on left, 'View Details' link on right
- Entire card is clickable — wraps in Next.js Link to /servers/[id]
- Use Tailwind CSS, TypeScript
```

---

### 2.4 — SearchBar component

```
Create a SearchBar component at components/SearchBar.tsx.

Requirements:
- A search input with a search icon inside it (use a simple SVG icon)
- Placeholder text: 'Search MCP servers...'
- When user types and submits (press Enter or click button), it updates the URL query param ?search=VALUE using Next.js useRouter
- Use 'use client' directive
- Tailwind CSS styling — make it look clean and modern
- Full width, with a rounded border and focus ring
- TypeScript
```

---

### 2.5 — CategoryFilter component

```
Create a CategoryFilter component at components/CategoryFilter.tsx.

Props: categories (string array), selectedCategory (string or null), onSelect (function)

Design:
- Horizontal scrollable row of pill/badge buttons
- Each category is a button: gray background normally, purple background when selected
- An 'All' button at the start that clears the filter
- Use 'use client' directive
- Tailwind CSS, TypeScript
- Clicking a category calls onSelect(category) or onSelect(null) for All
```

---

### 2.6 — LoadingSpinner and EmptyState components

```
Create two small utility components:

1. components/LoadingSpinner.tsx
   - A centered spinning circle animation using Tailwind CSS animate-spin
   - Optional size prop ('sm', 'md', 'lg')
   - No external libraries

2. components/EmptyState.tsx
   - Shown when search returns no results
   - Props: title (string), description (string), action (optional: { label: string, href: string })
   - Centered layout with an icon (use a simple SVG), title, description, and optional button
   - Tailwind CSS styling
```

---

## PHASE 3 — Pages

> Open each file in VS Code before running the prompt so Copilot has context.

### 3.1 — Homepage (app/page.tsx)

```
Create the homepage at app/page.tsx for my MCP Registry website.

This is a Next.js 14 App Router server component.

Requirements:
- Import and use: getAllServers and getCategories from @/lib/db, ServerCard, SearchBar, CategoryFilter
- Accept searchParams prop with optional 'search' and 'category' string fields
- Fetch servers filtered by search and category using getAllServers()
- Fetch all categories using getCategories()
- Layout:
  - Hero section: large heading 'MCP Server Registry', subtitle, total server count
  - SearchBar centered below hero
  - CategoryFilter row below search
  - Server count text: showing X of Y servers
  - Grid of ServerCard components (2 columns desktop, 1 mobile)
  - EmptyState component if no servers found
- Use Tailwind CSS, TypeScript
- max-w-5xl centered layout with padding
```

---

### 3.2 — Layout file (app/layout.tsx)

```
Update app/layout.tsx to wrap all pages with my Navbar and Footer components.

Requirements:
- Import Navbar from @/components/Navbar
- Import Footer from @/components/Footer
- Layout: Navbar at top, main content fills remaining height, Footer at bottom
- Use flex flex-col min-h-screen so footer sticks to bottom
- Update metadata:
  - title: 'MCP Registry — Discover MCP Servers for AI Agents'
  - description: 'The open-source registry for Model Context Protocol servers'
- Keep Inter font from next/font/google
- TypeScript
```

---

### 3.3 — Server detail page (app/servers/[id]/page.tsx)

```
Create a server detail page at app/servers/[id]/page.tsx.

Next.js 14 App Router server component. Receives params.id.

Requirements:
- Fetch server using getServerById(params.id) from @/lib/db
- If not found, show a 'Server not found' message with a Back button
- Layout:
  - Back button (← Back to Registry)
  - Server name as h1, verified badge next to it
  - Description paragraph
  - Two-column layout on desktop:
    LEFT: Category tags, GitHub stars, submission date
    RIGHT: Dark code block showing install_command with a Copy button
  - Large 'View on GitHub ↗' button
  - 'Report an issue' link at the bottom
- TypeScript, Tailwind CSS
```

---

### 3.4 — Submit server page (app/submit/page.tsx)

```
Create a submit server form page at app/submit/page.tsx.

'use client' component.

Requirements:
- Form fields (all required):
  1. Server name (text input)
  2. Description (textarea, max 200 chars with live counter)
  3. GitHub URL (url input, validate it starts with github.com)
  4. Install command (text input, placeholder: 'npx my-mcp-server')
  5. Categories (comma-separated text input with helper text)
- Form state using useState
- On submit: call submitServer(), show loading state on button, show success or error
- Validation: show inline error messages if fields are empty or invalid
- After success: show 'Your server has been submitted for review!' with a Back link
- Tailwind CSS, TypeScript, clean form design
```

---

### 3.5 — Login page (app/login/page.tsx)

```
Create a simple login page at app/login/page.tsx.

'use client' component.

Requirements:
- Centered card layout
- Heading: 'Sign in to MCP Registry'
- Subtext explaining why login is needed (to submit servers)
- Large 'Continue with GitHub' button with GitHub logo SVG icon
- On button click: call supabase.auth.signInWithOAuth({ provider: 'github' })
- Loading state while OAuth is processing
- Link back to homepage at the bottom
- Clean, minimal design with Tailwind CSS
```

---

## PHASE 4 — Extra Features & Polish

### 4.1 — Copy to clipboard button

```
Create a CopyButton component at components/CopyButton.tsx.

Props: text (string) — the text to copy

Requirements:
- Button that copies text to clipboard using navigator.clipboard.writeText()
- Default state: copy icon (SVG) and 'Copy' text
- After clicking: checkmark icon and 'Copied!' for 2 seconds, then resets
- Use useState and useEffect for the timeout
- 'use client' directive
- Tailwind CSS, TypeScript
```

---

### 4.2 — Search that updates the URL

```
Update components/SearchBar.tsx so that:

1. When user types and presses Enter or clicks Search, it navigates to /?search=VALUE using Next.js useRouter and usePathname
2. The input is pre-filled from the current URL search param using useSearchParams()
3. There's a clear button (×) that appears when there's a value, which clears the search
4. Use 'use client', useRouter, useSearchParams, usePathname from next/navigation
5. Keep the existing styling

Show me the complete updated file.
```

---

### 4.3 — GitHub star count API sync

```
Create a Next.js API route at app/api/sync-stars/route.ts.

This route fetches the current GitHub star count for each MCP server and updates the database.

Requirements:
- GET handler
- Fetch all servers from Supabase that have a github_url
- For each server, extract owner/repo from the GitHub URL
- Call the GitHub API: https://api.github.com/repos/{owner}/{repo}
- Update github_stars field with the stargazers_count value
- Add basic auth protection: only run if request has a secret header matching process.env.SYNC_SECRET
- Return a JSON summary of how many servers were updated
- Handle errors gracefully
- TypeScript
```

---

### 4.4 — Add pagination

```
Add pagination to app/page.tsx so it shows 12 servers per page.

Requirements:
- Add a page query param to searchParams (e.g. ?page=2)
- Update getAllServers in lib/db.ts to accept a page number and return paginated results using Supabase's .range() method
- Add a Pagination component at components/Pagination.tsx with Previous/Next buttons and page numbers
- Show 'Showing 1-12 of 47 results' text above the grid
- Use Next.js Link for pagination
- TypeScript, Tailwind CSS
```

---

### 4.5 — SEO and metadata

```
Add proper SEO metadata to my Next.js pages.

1. Update app/layout.tsx with base metadata:
   - title template: '%s | MCP Registry'
   - description, keywords, openGraph, twitter card

2. Add generateMetadata to app/servers/[id]/page.tsx:
   - title: server name
   - description: server description
   - openGraph with title and description

3. Create app/sitemap.ts that generates a sitemap with:
   - Homepage URL
   - All server detail page URLs fetched from Supabase

Use Next.js 14 Metadata API. TypeScript.
```

---

## PHASE 5 — Testing & Deployment

### 5.1 — Pre-deployment checklist

```
Review my MCP Registry Next.js project for common issues before deployment to Vercel.

Check for:
1. Any hardcoded localhost URLs that should be environment variables
2. Missing error handling in async functions
3. Missing loading states for user actions
4. Environment variables that need to be set in Vercel
5. Any console.log statements to remove
6. Missing 'use client' directives on components that use hooks
7. TypeScript errors (list the most common ones to watch for)
8. Images that should use next/image instead of <img>

For each issue, tell me what to look for and how to fix it.
```

---

### 5.2 — Create the README.md

```
Write a complete, professional README.md for my open-source MCP Registry project on GitHub.

Include:
1. Project title with logo emoji and a one-line description
2. A 'Why this exists' section (2-3 sentences on the problem)
3. Features list with emojis
4. Tech stack (Next.js, Supabase, TypeScript, Tailwind, Vercel)
5. Quick Start section: how to clone, install, set up .env.local, run locally
6. Environment variables table (show variable names and where to get them)
7. Deployment section (Vercel deploy button if possible)
8. Contributing section (how to submit a pull request)
9. License (MIT)

Make it look great — this is the viral landing page for the project.
Use proper Markdown with headers, code blocks, and badges.
```

> 💡 A great README is critical for GitHub stars. Spend time on this one.

---

### 5.3 — Environment variables for Vercel

```
List every environment variable my MCP Registry project needs, where to get each one, and whether it should be set in Vercel as a regular variable or secret.

My project uses:
- Supabase (database + auth)
- GitHub OAuth (via Supabase)
- A sync secret for the star sync API route

For each variable, give me:
1. Variable name
2. Where to find the value
3. Whether to prefix with NEXT_PUBLIC_ or not (and why)
4. Whether it's sensitive (should be a Vercel Secret)
```

---

### 5.4 — Fix Vercel build errors

```
My Next.js project builds fine locally but is failing on Vercel. Here are the errors I'm seeing:

[PASTE YOUR ACTUAL VERCEL ERROR LOGS HERE]

For each error:
1. Explain what caused it in simple terms
2. Give me the exact code fix
3. Tell me which file to update

Common things to check: missing environment variables, dynamic imports, useSearchParams needing Suspense wrapper, server vs client component issues.
```

---

## PHASE 6 — Debugging & Common Fixes

### 6.1 — Debug any error (universal prompt)

```
I'm getting this error in my Next.js MCP Registry project:

ERROR: [PASTE YOUR EXACT ERROR HERE]

This happens when: [DESCRIBE WHAT YOU WERE DOING]

The relevant file is: [FILE NAME]

Here is the relevant code:
[PASTE THE CODE THAT IS CAUSING THE ERROR]

Please:
1. Explain what the error means in simple terms
2. Show me exactly what to change to fix it
3. Explain why this fix works
```

---

### 6.2 — Fix TypeScript errors

```
I have TypeScript errors in my MCP Registry project. Here are the errors:

[PASTE TYPESCRIPT ERRORS]

For each error:
1. Show the fix
2. Explain what TypeScript was complaining about
3. If it's a 'possibly null' error, show me the safest way to handle it

Do not just add 'as any' or '!' to suppress the errors — fix them properly.
```

---

### 6.3 — Fix Supabase query not returning data

```
My Supabase query is not returning the data I expect. Here's the function:

[PASTE YOUR SUPABASE QUERY CODE]

Expected result: [DESCRIBE WHAT YOU EXPECT]
Actual result: [DESCRIBE WHAT YOU GET — null, empty array, wrong data, etc.]

Please:
1. Review my query for mistakes
2. Show me how to add proper error logging to debug Supabase issues
3. Check if my Row Level Security policies could be blocking the query
4. Give me the corrected query
```

---

### 6.4 — Fix styling issues

```
My component doesn't look right. Here is the component code:

[PASTE COMPONENT CODE]

The problem is: [DESCRIBE THE STYLING ISSUE]

Fix the Tailwind CSS classes to achieve: [DESCRIBE WHAT YOU WANT IT TO LOOK LIKE]

Show me just the updated JSX with fixed class names.
```

---

### 6.5 — Add any new feature

```
I want to add a new feature to my MCP Registry project.

Feature: [DESCRIBE THE FEATURE IN PLAIN ENGLISH]

My current stack is: Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase.

Please:
1. Explain the best way to implement this
2. List all the files I need to create or modify
3. Give me the complete code for each file
4. Tell me if I need to add anything to the database
```

---

## ✅ Pro Tips for Working with Copilot

**Do this for best results:**
- Always open the relevant file in VS Code before using Copilot Chat — it gives context
- Be specific: always mention your stack (Next.js 14 App Router, TypeScript, Tailwind, Supabase)
- If you don't like the output, add: "Do it again but simpler / without X / using Y instead"
- Ask Copilot to explain code you don't understand: "Explain this line by line"
- Use `@workspace` in Copilot Chat to give it access to your whole project
- Always read the generated code before pasting — don't blindly copy

**Avoid these mistakes:**
- Don't give vague prompts like "make a nice page" — be specific about every requirement
- Don't skip reviewing generated code — Copilot sometimes makes things up
- Don't ask for too much in one prompt — split big features into smaller prompts
- Don't ignore TypeScript errors — they cause bugs later, fix them early
- Don't forget to save files after pasting Copilot's code (`Ctrl+S` / `Cmd+S`)

**When completely stuck:**
- Copy the error + your code and paste it to Claude (claude.ai) for a second opinion
- Search the exact error message on Stack Overflow
- Check official docs: [nextjs.org/docs](https://nextjs.org/docs) and [supabase.com/docs](https://supabase.com/docs)
- Post in the Supabase Discord — very beginner-friendly community

---

> *You have everything you need. Phase 0 → Phase 5. One prompt at a time. 🚀*
