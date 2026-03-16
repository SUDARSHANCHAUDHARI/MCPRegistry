# Features

## 15 Premium Features

### 1. Advanced Search
**Endpoint:** `GET /api/search-advanced`

Multi-filter search supporting: text query, category, minimum stars, minimum rating, tags, maintenance status, pagination, and sorting.

### 2. Server Comparison
**Endpoint:** `GET /api/compare`

Compare up to 3 servers side-by-side. Shows: name, stars, rating, category, badges, maintenance status.

**Component:** `components/` — comparison view on `/compare` page.

### 3. Similar Servers
**Endpoint:** `GET /api/similar-servers`

Recommendation engine based on same-category servers ordered by stars. Shown on server detail pages.

### 4. User Collections
**Endpoint:** `GET/POST /api/collections`

Users can create named lists of servers (public or private) and add servers to them.

**Component:** `components/CollectionsSidebar.tsx`

### 5. Tags
**Endpoint:** `GET /api/tags`

50 predefined tags (AI, DevOps, Database, Security, etc.). Servers can be tagged and filtered by tag.

**Component:** integrated in `AdvancedSearchFilter.tsx`

### 6. Deployment Guides
**Endpoint:** `GET/POST /api/deployment-guides`

Per-platform deployment instructions (Docker, Vercel, Railway, AWS, Manual). Community-submitted.

**Component:** `components/DeploymentGuideTabs.tsx`

### 7. Maintenance Status
Tracks development activity per server: `active`, `maintaining`, `stale`, `archived`.

**Component:** `components/MaintenanceIndicator.tsx`

### 8. Server Badges
Visual status indicators with optional expiry dates. Types: `verified`, `trending`, `popular`, `new`, `featured`, `maintaining`, `archived`.

**Component:** `components/ServerBadges.tsx`

### 9. Changelog / Version History
**Endpoint:** `GET/POST /api/changelog`

Timeline of server releases with version numbers, descriptions, dates, and links.

**Component:** `components/ChangelogTimeline.tsx`

### 10. Moderation System
**Endpoint:** `GET/POST /api/moderation`

Users can report servers (spam, malicious, duplicate, inactive). Admins review reports via `/admin/moderation`.

### 11. Import / Export
**Endpoint:** `GET/POST /api/import-export`

Export a set of servers as JSON, or bulk-import up to 100 servers. Requires auth for import.

### 12. GitHub Stars Sync
**Endpoint:** `POST /api/sync-github-stars`

Fetches current star counts from GitHub API for all approved servers. Secret-protected. Run via daily cron.

### 13. Server Health Checks
**Endpoint:** `POST /api/health-check`

Pings each server's GitHub repository to verify it still exists. Results stored in `server_health` table. Secret-protected.

### 14. Analytics
**Endpoint:** `GET /api/stats`

Registry-wide stats: total servers, categories. Admin analytics at `/admin/analytics` includes view/search/submit event counts.

### 15. Rating System

Users can submit 1–5 star ratings with optional review text. Aggregate average and count shown on server cards.

**Component:** `components/RatingComponent.tsx`

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — search, browse, grid |
| `/servers/[id]` | Server detail — all features displayed |
| `/submit` | Submit a new server (auth required) |
| `/compare` | Side-by-side server comparison |
| `/collections` | Manage user collections (auth required) |
| `/leaderboard` | Top server creators |
| `/dashboard` | User's submitted servers |
| `/login` | GitHub OAuth login |
| `/admin/moderation` | Review reports (admin only) |
| `/admin/analytics` | Usage stats (admin only) |

---

## Components

| Component | Purpose |
|---|---|
| `Navbar` | Top navigation, auth status, theme toggle |
| `Footer` | Links and credits |
| `ServerCard` | Server listing card |
| `SearchBar` | Text search input |
| `CategoryFilter` | Category pill buttons |
| `Pagination` | Page navigation |
| `LoadingSpinner` | Loading state |
| `EmptyState` | No results display |
| `CopyButton` | Copy-to-clipboard for install commands |
| `ThemeToggle` | Dark/light mode switch |
| `RatingComponent` | Star rating display and input |
| `AdvancedSearchFilter` | Multi-filter search UI |
| `ServerBadges` | Badge display with colors |
| `MaintenanceIndicator` | Dev status pill |
| `DeploymentGuideTabs` | Tabbed platform guides |
| `ChangelogTimeline` | Vertical version timeline |
| `CollectionsSidebar` | Quick collection access |
