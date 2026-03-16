# API Reference

Base URL: `https://your-app.vercel.app` (or `http://localhost:3000` locally)

All public endpoints include CORS headers. Authenticated endpoints require a logged-in Supabase session cookie.

---

## Public Endpoints

### GET /api/servers

List servers with optional search and pagination.

**Query params:**
| Param | Type | Default | Description |
|---|---|---|---|
| `search` | string | — | Text search on name/description |
| `category` | string | — | Filter by category |
| `page` | number | 1 | Page number |
| `limit` | number | 50 | Results per page (max 100) |

**Response:**
```json
{
  "status": "success",
  "data": [ { "id": "...", "name": "...", ... } ],
  "total": 42,
  "page": 1,
  "limit": 50
}
```

---

### GET /api/search-advanced

Advanced multi-filter search.

**Query params:**
| Param | Type | Description |
|---|---|---|
| `search` | string | Text search |
| `category` | string | Filter by category |
| `minStars` | number | Minimum GitHub stars |
| `minRating` | number | Minimum average rating (1–5) |
| `tags` | string[] | Filter by tag IDs (repeatable) |
| `status` | string | `active`, `maintaining`, `stale`, `archived` |
| `page` | number | Page number (default 1) |
| `limit` | number | Results per page (default 12, max 100) |

**Response:**
```json
{
  "servers": [ ... ],
  "total": 20,
  "page": 1,
  "limit": 12
}
```

---

### GET /api/compare

Compare up to 3 servers side-by-side.

**Query params:** `ids` (repeatable, max 3)

```
GET /api/compare?ids=abc&ids=def&ids=ghi
```

**Response:**
```json
{
  "servers": [
    { "id": "abc", "name": "...", "rating": {...}, "badges": [...], "maintenance": {...} }
  ]
}
```

---

### GET /api/similar-servers

Get recommended servers similar to a given one.

**Query params:** `id` (required), `limit` (default 5, max 20)

**Response:**
```json
{ "similar": [ { "id": "...", "name": "..." } ] }
```

---

### GET /api/tags

List all available tags.

**Query params:** `serverId` (optional — get tags for a specific server)

**Response:**
```json
{ "tags": [ { "id": "...", "name": "AI", "color": "#..." } ] }
```

---

### GET /api/stats

Registry-wide statistics.

**Response:**
```json
{
  "status": "success",
  "total_servers": 42,
  "total_categories": 8,
  "categories": [ { "name": "...", "count": 10 } ]
}
```

---

### GET /api/changelog

Server version history.

**Query params:** `serverId` (required)

**Response:**
```json
{ "changelog": [ { "version": "1.2.0", "description": "...", "release_date": "..." } ] }
```

---

### GET /api/deployment-guides

Platform-specific deployment instructions for a server.

**Query params:** `serverId` (required)

**Response:**
```json
{ "guides": [ { "platform": "docker", "title": "...", "content": "..." } ] }
```

---

## Authenticated Endpoints

### POST /api/collections

Manage user collections.

**Body:**
```json
{ "action": "create", "name": "My List", "description": "...", "isPublic": false }
{ "action": "addServer", "collectionId": "...", "serverId": "..." }
```

### GET /api/collections

Get user or collection servers.

**Query params:** `userId` or `collectionId`

---

### POST /api/changelog

Add a changelog entry (must be server owner or admin).

**Body:**
```json
{ "serverId": "...", "version": "1.3.0", "description": "...", "releaseDate": "2026-01-01", "url": "..." }
```

---

### POST /api/deployment-guides

Add a deployment guide.

**Body:**
```json
{ "serverId": "...", "platform": "docker", "title": "...", "content": "...", "url": "..." }
```

---

### POST /api/moderation

Report a server or review a report (admin only for review).

**Report a server:**
```json
{ "action": "report", "serverId": "...", "reason": "spam", "details": "..." }
```

**Review a report (admin):**
```json
{ "action": "review", "reportId": "...", "status": "resolved", "adminNotes": "..." }
```

---

### GET/POST /api/import-export

Export servers as JSON (GET) or import from JSON (POST, requires auth).

**Export:** `GET /api/import-export?ids=abc&ids=def`

**Import:**
```json
{ "servers": [ { "name": "...", "github_url": "https://github.com/...", ... } ] }
```
Max 100 servers per import.

---

## Secret-Protected Endpoints

These require the `x-sync-secret` header with your `SYNC_SECRET` value.

### POST /api/sync-github-stars

Syncs GitHub star counts for all approved servers. Run daily via cron.

### POST /api/health-check

Checks GitHub repo availability for all servers. Run every 6 hours via cron.
