# Deployment Guide

## Pre-Deployment Checklist

- [ ] `pnpm build` passes with no errors
- [ ] All pages work locally (`pnpm dev`)
- [ ] GitHub OAuth login works locally
- [ ] Can submit and approve servers via admin panel
- [ ] `.env.local` is NOT committed (it's in `.gitignore`)

---

## Deploy to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/mcp-registry.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your `mcp-registry` repository
3. Add these **Environment Variables**:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |
| `SYNC_SECRET` | A random secret string (32+ chars) |
| `GITHUB_TOKEN` | *(Optional)* For higher GitHub API rate limits |

4. Click **Deploy**

### 3. Update GitHub OAuth Callback

After deploying, update your GitHub OAuth app:

- GitHub → Settings → Developer Settings → OAuth Apps → your app
- Update **Authorization callback URL** to:
  ```
  https://your-app.vercel.app/auth/callback
  ```

---

## Custom Domain

1. In Vercel → Project → **Settings** → **Domains**
2. Add your domain (e.g. `mcpregistry.dev`)
3. Follow DNS instructions
4. Update GitHub OAuth callback URL to the new domain

---

## Cron Jobs (Recommended)

Set up these scheduled tasks via Vercel Cron or an external scheduler:

| Job | Endpoint | Schedule | Purpose |
|-----|----------|----------|---------|
| Sync GitHub stars | `POST /api/sync-github-stars` | Daily | Update star counts |
| Health checks | `POST /api/health-check` | Every 6h | Monitor server availability |

Both endpoints require the `x-sync-secret` header with your `SYNC_SECRET` value.

Example with curl:
```bash
curl -X POST https://your-app.vercel.app/api/sync-github-stars \
  -H "x-sync-secret: your-sync-secret"
```

---

## Monitoring

- **Vercel Dashboard** — Deployments, logs, performance
- **Supabase Dashboard** — Database usage, auth logs
- **Admin Analytics** — `/admin/analytics` in your app

---

## Other Hosting Options

While Vercel is recommended, the app can run on any Node.js host:

```bash
pnpm build
pnpm start   # Starts on port 3000
```

Set all environment variables in your host's config panel.
