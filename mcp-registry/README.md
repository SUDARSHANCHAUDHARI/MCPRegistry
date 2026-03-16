# MCP Registry

A full-featured registry for Model Context Protocol (MCP) servers — discover, compare, rate, and manage MCP tools in one place.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Database:** Supabase (PostgreSQL with Row-Level Security)
- **Auth:** GitHub OAuth via Supabase Auth
- **Styling:** Tailwind CSS 4
- **Hosting:** Vercel-ready

## Features

- Browse and search 50+ MCP servers
- Advanced filtering (category, stars, rating, tags, maintenance status)
- Side-by-side server comparison
- 5-star rating system with reviews
- User collections (public/private)
- Server badges (verified, trending, popular, etc.)
- Deployment guides (Docker, Vercel, Railway, AWS)
- Version changelog timeline
- Moderation & abuse reporting
- Admin analytics dashboard
- GitHub star sync
- Server health checks
- Import/export (JSON)

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env.local
# Fill in your Supabase URL, anon key, and a random SYNC_SECRET

# 3. Run database migrations
# In Supabase SQL editor, run: docs/database-schema.sql
#                              docs/database-additions.sql
#                              docs/database-features.sql

# 4. Start dev server
pnpm dev
# Open http://localhost:3000
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `NEXT_PUBLIC_APP_URL` | Yes | App base URL (e.g. `http://localhost:3000`) |
| `SYNC_SECRET` | Yes | Secret for protecting `/api/sync-github-stars` and `/api/health-check` |
| `GITHUB_TOKEN` | Optional | Increases GitHub API rate limit for star sync |
| `RESEND_API_KEY` | Optional | Enables email notifications |

## Project Structure

```
mcp-registry/
├── app/
│   ├── api/           # 13 REST API routes
│   ├── admin/         # Admin moderation + analytics pages
│   ├── auth/          # OAuth callback handler
│   ├── servers/[id]/  # Server detail page
│   ├── submit/        # Submit a new server
│   └── ...            # Other pages (compare, collections, leaderboard)
├── components/        # 17 reusable React components
├── lib/
│   ├── db.ts          # Core DB queries
│   ├── db-extended.ts # Ratings, trending, leaderboard, analytics
│   ├── db-features.ts # Tags, collections, badges, changelog, moderation, search
│   ├── auth.ts        # useAuth hook
│   ├── validate.ts    # Form validation
│   ├── email.ts       # Email notification templates
│   └── webhooks.ts    # Webhook handler + delivery
├── docs/              # SQL migrations + documentation
└── types/             # TypeScript interfaces
```

## Documentation

All docs are in the [`docs/`](docs/) folder:

| File | Description |
|------|-------------|
| [docs/setup.md](docs/setup.md) | Local setup and configuration guide |
| [docs/deployment.md](docs/deployment.md) | Production deployment to Vercel |
| [docs/api.md](docs/api.md) | API endpoint reference |
| [docs/features.md](docs/features.md) | All 15 premium features explained |
| [docs/developer.md](docs/developer.md) | Architecture, patterns, extending the project |

## API Overview

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/servers` | GET | Public | List/search servers |
| `/api/search-advanced` | GET | Public | Advanced multi-filter search |
| `/api/compare` | GET | Public | Compare up to 3 servers |
| `/api/similar-servers` | GET | Public | Server recommendations |
| `/api/tags` | GET | Public | List tags |
| `/api/stats` | GET | Public | Registry statistics |
| `/api/changelog` | GET/POST | GET: Public, POST: Auth | Server version history |
| `/api/deployment-guides` | GET/POST | GET: Public, POST: Auth | Deployment instructions |
| `/api/collections` | GET/POST | Auth | User collections |
| `/api/moderation` | GET/POST | Admin/Auth | Reporting & moderation |
| `/api/import-export` | GET/POST | POST: Auth | Backup/restore |
| `/api/sync-github-stars` | POST | Secret | Sync GitHub star counts |
| `/api/health-check` | POST | Secret | Check server availability |

## Deployment

See [docs/deployment.md](docs/deployment.md) for full instructions. Quick deploy:

```bash
pnpm build   # Verify build passes
vercel --prod   # Deploy to Vercel
```

Set all environment variables in your Vercel project settings before deploying.
