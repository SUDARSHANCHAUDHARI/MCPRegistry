# Developer Guide

## Architecture

The app follows a 4-layer architecture:

```
Browser → Next.js Pages → API Routes → Supabase (PostgreSQL)
```

- **Pages** (`app/`) — Server and client React components
- **API Routes** (`app/api/`) — REST endpoints, thin controllers
- **Library** (`lib/`) — All business logic and DB queries
- **Database** — Supabase with Row-Level Security

---

## Project Structure

```
mcp-registry/
├── app/
│   ├── api/                  # 13 API route handlers
│   ├── admin/                # Moderation + analytics (admin only)
│   ├── auth/callback/        # OAuth callback handler
│   ├── servers/[id]/         # Server detail page
│   ├── submit/               # Server submission form
│   ├── collections/          # User collections
│   ├── compare/              # Side-by-side comparison
│   ├── leaderboard/          # Top creators
│   ├── dashboard/            # User dashboard
│   └── login/                # Login page
├── components/               # 17 reusable React components
├── lib/
│   ├── supabase.ts           # Supabase client init
│   ├── auth.ts               # useAuth() hook
│   ├── validate.ts           # Form validation
│   ├── db.ts                 # Core DB: getAllServers, getServerById, submitServer
│   ├── db-extended.ts        # Ratings, trending, leaderboard, health, analytics
│   ├── db-features.ts        # Tags, collections, badges, maintenance, changelog, moderation, search, import/export
│   ├── email.ts              # Email templates (Resend/SendGrid ready)
│   └── webhooks.ts           # Webhook signature verification + delivery
├── docs/
│   ├── database-schema.sql   # Core schema
│   ├── database-additions.sql
│   ├── database-features.sql
│   ├── setup.md
│   ├── deployment.md
│   ├── api.md
│   ├── features.md
│   └── developer.md          # This file
├── types/
│   └── index.ts              # TypeScript interfaces
└── public/                   # Static assets
```

---

## Database Schema

### Core Tables
| Table | Purpose |
|---|---|
| `mcp_servers` | Main server listings |
| `profiles` | User profiles (linked to Supabase Auth) |
| `ratings` | 1–5 star ratings with optional review text |
| `analytics` | Event tracking (view, search, submit, api_call) |
| `server_health` | GitHub repo availability checks |

### Feature Tables
| Table | Purpose |
|---|---|
| `server_tags` | 50 predefined tags |
| `server_tag_mappings` | Many-to-many server ↔ tag |
| `collections` | User-created server lists |
| `collection_servers` | Server membership in collections |
| `server_badges` | Status badges with optional expiry |
| `deployment_guides` | Platform-specific deployment instructions |
| `maintenance_status` | Dev activity status per server |
| `server_changelog` | Version history |
| `moderation_reports` | Abuse/spam reports |

---

## Key Patterns

### Authentication in API Routes

```typescript
const user = await supabase.auth.getUser()
if (!user.data.user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### Admin Check

```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('is_admin')
  .eq('id', user.data.user.id)
  .single()

if (!profile?.is_admin) {
  return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
}
```

### Secret-Protected Endpoints (timing-safe)

```typescript
import crypto from 'crypto'

const secret = request.headers.get('x-sync-secret') || ''
const expected = process.env.SYNC_SECRET || ''
if (!expected || secret.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(secret), Buffer.from(expected))) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

---

## Adding a New Feature

1. **Database** — Add table to `docs/database-features.sql` with RLS policies
2. **Library** — Add query functions to `lib/db-features.ts`
3. **API** — Create `app/api/your-feature/route.ts`
4. **Component** — Create `components/YourFeature.tsx` if needed
5. **Page** — Wire it into the relevant page

---

## Email Notifications

`lib/email.ts` has templates ready. To enable:

1. Add `RESEND_API_KEY` to `.env.local`
2. Uncomment the Resend integration in `sendEmail()`
3. Install: `pnpm install resend`

---

## Webhooks

`lib/webhooks.ts` provides:
- `verifyWebhookSignature()` — HMAC-SHA256 with timing-safe comparison
- `processWebhook()` — Routes events to handlers
- `scheduleWebhookDelivery()` — Outgoing webhooks with exponential backoff retry

The 4 webhook handlers (`handleGitHubStarsWebhook`, `handleServerHealthWebhook`, `handleAnalyticsWebhook`, `handleSubmissionAutoApproveWebhook`) are stubbed with TODO comments — implement the DB calls to complete them.

---

## TypeScript

Strict mode is enabled. Avoid `any` types — define interfaces in `types/index.ts` instead.

To check types:
```bash
npx tsc --noEmit
```
