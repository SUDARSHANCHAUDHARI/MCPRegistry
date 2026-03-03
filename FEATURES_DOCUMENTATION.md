# MCP Registry - 15 Premium Features Documentation

## Overview

This document provides comprehensive documentation for all 15 premium features added to the MCP Registry. These features enhance the core registry with advanced search, server comparison, collections, badges, deployment guides, and moderation capabilities.

---

## Table of Contents

1. [Database Schema](#database-schema)
2. [API Endpoints](#api-endpoints)
3. [React Components](#react-components)
4. [Pages](#pages)
5. [Setup Instructions](#setup-instructions)
6. [Usage Guide](#usage-guide)

---

## Database Schema

### Tables Created

#### 1. `server_tags`
Predefined tags for categorizing servers.

```sql
CREATE TABLE server_tags (
  id UUID PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  icon VARCHAR(10) DEFAULT '🏷️',
  created_at TIMESTAMP DEFAULT NOW()
)
```

**Default Tags (50 total):**
- AI & Machine Learning: AI, ML, Neural Networks, LLM, Transformers, NLP, Computer Vision, Embeddings
- DevOps & Infrastructure: DevOps, Docker, Kubernetes, AWS, Cloud, CI/CD, Terraform, Infrastructure
- Databases: Database, SQL, NoSQL, MongoDB, PostgreSQL, Redis, Elasticsearch, Cache
- Security: Security, Authentication, Encryption, OAuth, JWT, CORS, Firewall
- Web Development: Web, REST, GraphQL, WebSocket, HTTP, API, Frontend, Backend
- And 27 more...

#### 2. `server_tag_mappings`
Many-to-many relationship between servers and tags.

```sql
CREATE TABLE server_tag_mappings (
  id UUID PRIMARY KEY,
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES server_tags(id),
  created_at TIMESTAMP DEFAULT NOW()
)
```

#### 3. `collections`
User-created collections to organize servers.

```sql
CREATE TABLE collections (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

#### 4. `collection_servers`
Many-to-many mapping for collections and servers.

```sql
CREATE TABLE collection_servers (
  id UUID PRIMARY KEY,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW()
)
```

#### 5. `server_badges`
Status badges for servers (verified, trending, popular, etc.).

```sql
CREATE TABLE server_badges (
  id UUID PRIMARY KEY,
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)
```

**Badge Types:**
- `verified` - Server verified by administrators
- `trending` - Rapidly growing in popularity
- `popular` - High number of stars
- `new` - Recently added
- `featured` - Manually featured
- `maintaining` - Actively maintained
- `archived` - No longer maintained

#### 6. `deployment_guides`
Platform-specific deployment instructions.

```sql
CREATE TABLE deployment_guides (
  id UUID PRIMARY KEY,
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  external_link VARCHAR(500),
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW()
)
```

**Platforms:** docker, vercel, railway, aws, manual

#### 7. `maintenance_status`
Track active development and maintenance status.

```sql
CREATE TABLE maintenance_status (
  id UUID PRIMARY KEY,
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  last_update TIMESTAMP,
  updated_by UUID,
  created_at TIMESTAMP DEFAULT NOW()
)
```

**Statuses:** active, maintaining, stale, archived

#### 8. `server_dependencies`
Track relationships between servers.

```sql
CREATE TABLE server_dependencies (
  id UUID PRIMARY KEY,
  server_id UUID NOT NULL REFERENCES servers(id),
  depends_on_server_id UUID NOT NULL REFERENCES servers(id),
  relationship_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
)
```

#### 9. `server_changelog`
Version history and release notes.

```sql
CREATE TABLE server_changelog (
  id UUID PRIMARY KEY,
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  version VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  release_date TIMESTAMP,
  release_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
)
```

#### 10. `moderation_reports`
Spam/abuse reports with admin review.

```sql
CREATE TABLE moderation_reports (
  id UUID PRIMARY KEY,
  server_id UUID NOT NULL REFERENCES servers(id),
  reason VARCHAR(50) NOT NULL,
  details TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  reported_by UUID,
  reported_at TIMESTAMP DEFAULT NOW(),
  reviewed_by UUID,
  reviewed_at TIMESTAMP,
  admin_notes TEXT
)
```

**Reason Types:** spam, malicious, duplicate, inactive, other

---

## API Endpoints

### 1. Advanced Search (`/api/search-advanced`)

**GET** - Search servers with multiple filters

**Query Parameters:**
```
searchText?: string           # Search term
category?: string             # Filter by category
minStars?: number            # Minimum GitHub stars
maxStars?: number            # Maximum GitHub stars
minRating?: number           # Minimum user rating
tags?: string[]              # Filter by tags (comma-separated)
maintenanceStatus?: string   # active, maintaining, stale, archived
sortBy?: string              # stars, rating, created, updated
limit?: number               # Results per page (default: 10)
offset?: number              # Pagination offset (default: 0)
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Server Name",
      "description": "Description",
      "stars": 1250,
      "rating": 4.5,
      "tags": ["AI", "DevOps"],
      "badgeCount": 3,
      "maintenanceStatus": "active"
    }
  ],
  "total": 42,
  "limit": 10,
  "offset": 0
}
```

---

### 2. Compare Servers (`/api/compare`)

**GET** - Side-by-side comparison of up to 3 servers

**Query Parameters:**
```
ids: string   # Comma-separated server IDs (max 3)
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Server Name",
      "description": "Description",
      "stars": 1250,
      "rating": 4.5,
      "category": "DevOps",
      "verified": true,
      "badges": ["trending", "popular"],
      "maintenanceStatus": "active",
      "tagCount": 5
    }
  ]
}
```

---

### 3. Similar Servers (`/api/similar-servers`)

**GET** - Get recommendation engine for similar servers

**Query Parameters:**
```
serverId: string    # Server ID to find similarities for
limit?: number      # Results limit (default: 5, max: 20)
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Similar Server",
      "similarity": 0.85,
      "reason": "Same category and similar rating"
    }
  ]
}
```

---

### 4. Collections (`/api/collections`)

**GET** - List user's collections

**Query Parameters:**
```
action: string    # 'list', 'create', or 'addServer'
```

**Response (list):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "My Collection",
      "description": "Description",
      "isPublic": false,
      "serverCount": 5,
      "createdAt": "2026-03-03T10:00:00Z"
    }
  ]
}
```

**POST** - Create collection or add server

**Request Body (create):**
```json
{
  "action": "create",
  "name": "My Collection",
  "description": "Optional description",
  "isPublic": false
}
```

**Request Body (addServer):**
```json
{
  "action": "addServer",
  "collectionId": "uuid",
  "serverId": "uuid"
}
```

---

### 5. Import/Export (`/api/import-export`)

**GET** - Export servers as JSON

**Query Parameters:**
```
serverIds: string    # Comma-separated server IDs to export
format?: string      # 'json' (default)
```

**Response:**
```json
{
  "version": "1.0",
  "exportedAt": "2026-03-03T10:00:00Z",
  "count": 5,
  "servers": [
    {
      "id": "uuid",
      "name": "Server Name",
      "description": "Description",
      "category": "DevOps",
      "stars": 1250
    }
  ]
}
```

**POST** - Import servers from JSON

**Request Body:**
```json
{
  "servers": [
    {
      "name": "Server Name",
      "description": "Description",
      "category": "DevOps",
      "url": "https://example.com",
      "command": "command to run"
    }
  ]
}
```

---

### 6. Tags (`/api/tags`)

**GET** - Get all available tags or tags for a server

**Query Parameters:**
```
serverId?: string    # Get tags for specific server
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "AI",
      "icon": "🤖",
      "usageCount": 142
    }
  ]
}
```

---

### 7. Deployment Guides (`/api/deployment-guides`)

**GET** - Get deployment guides for a server

**Query Parameters:**
```
serverId: string    # Server ID
```

**Response:**
```json
{
  "docker": [
    {
      "id": "uuid",
      "title": "Docker Setup Guide",
      "content": "Step-by-step guide...",
      "externalLink": "https://example.com"
    }
  ],
  "vercel": [
    {
      "id": "uuid",
      "title": "Vercel Deployment",
      "content": "Guide content...",
      "externalLink": null
    }
  ]
}
```

**POST** - Create deployment guide (authenticated)

**Request Body:**
```json
{
  "serverId": "uuid",
  "platform": "docker",
  "title": "Docker Setup Guide",
  "content": "Complete setup instructions...",
  "externalLink": "https://example.com"
}
```

---

### 8. Moderation (`/api/moderation`)

**GET** - Get moderation reports (admin-only)

**Query Parameters:**
```
action?: string    # 'getPending' or omit for all
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "serverId": "uuid",
      "serverName": "Server Name",
      "reason": "spam",
      "details": "Report details",
      "status": "pending",
      "reportedAt": "2026-03-03T10:00:00Z",
      "reportedBy": "User Name"
    }
  ]
}
```

**POST** - Submit report or review report (admin)

**Request Body (report):**
```json
{
  "action": "report",
  "serverId": "uuid",
  "reason": "spam",
  "details": "Details about the report"
}
```

**Request Body (review):**
```json
{
  "action": "review",
  "reportId": "uuid",
  "status": "resolved",
  "adminNotes": "Action taken..."
}
```

---

### 9. Changelog (`/api/changelog`)

**GET** - Get version history for a server

**Query Parameters:**
```
serverId: string    # Server ID
limit?: number      # Results limit (default: 10)
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "version": "1.2.0",
      "description": "Major feature release",
      "releaseDate": "2026-03-01T00:00:00Z",
      "releaseUrl": "https://github.com/..."
    }
  ]
}
```

**POST** - Add changelog entry (authenticated)

**Request Body:**
```json
{
  "serverId": "uuid",
  "version": "1.2.0",
  "description": "Release notes...",
  "releaseDate": "2026-03-01T00:00:00Z",
  "releaseUrl": "https://github.com/..."
}
```

---

## React Components

### 1. `AdvancedSearchFilter`

Multi-dimensional filter UI for advanced server search.

**Location:** `/components/AdvancedSearchFilter.tsx`

**Props:**
```typescript
interface AdvancedSearchFilterProps {
  onSearch: (filters: SearchFilters) => void
  tags?: Tag[]
}

interface SearchFilters {
  searchText: string
  category: string
  minStars: number
  maxStars: number
  minRating: number
  tags: string[]
  maintenanceStatus: string
  sortBy: string
}
```

**Features:**
- Expandable/collapsible interface
- Category selection (chips)
- Star range slider (0-5000+)
- Rating range slider (0.0-5.0)
- Tag multi-select dropdown
- Maintenance status filter
- Sort options (stars, rating, created, updated)

**Usage:**
```jsx
<AdvancedSearchFilter 
  onSearch={(filters) => {
    # Handle search with filters
  }}
  tags={availableTags}
/>
```

---

### 2. `ServerBadges`

Visual status indicator display with color coding.

**Location:** `/components/ServerBadges.tsx`

**Props:**
```typescript
interface ServerBadgesProps {
  badges: {
    type: 'verified' | 'trending' | 'popular' | 'new' | 'featured' | 'maintaining' | 'archived'
    reason?: string
  }[]
}
```

**Badge Styles:**
- `verified` - Blue background, checkmark icon
- `trending` - Orange background, trending arrow
- `popular` - Yellow background, star icon
- `new` - Green background, sparkle icon
- `featured` - Purple background, crown icon
- `maintaining` - Indigo background, wrench icon
- `archived` - Gray background, archive icon

**Usage:**
```jsx
<ServerBadges badges={[
  { type: 'verified', reason: 'Officially verified' },
  { type: 'trending' }
]}/>
```

---

### 3. `MaintenanceIndicator`

Maintenance status display with color-coded icons.

**Location:** `/components/MaintenanceIndicator.tsx`

**Props:**
```typescript
interface MaintenanceIndicatorProps {
  status: 'active' | 'maintaining' | 'stale' | 'archived'
  lastUpdate?: string
}
```

**Statuses:**
- `active` - Green, checkmark (actively developed)
- `maintaining` - Blue, wrench (stable, occasional updates)
- `stale` - Yellow, warning (not recently updated)
- `archived` - Gray, box (no longer maintained)

**Usage:**
```jsx
<MaintenanceIndicator 
  status="active"
  lastUpdate="2026-03-01"
/>
```

---

### 4. `DeploymentGuideTabs`

Tabbed interface for platform-specific deployment instructions.

**Location:** `/components/DeploymentGuideTabs.tsx`

**Props:**
```typescript
interface DeploymentGuide {
  id: string
  platform: 'docker' | 'vercel' | 'railway' | 'aws' | 'manual'
  title: string
  content: string
  externalLink?: string
}

interface DeploymentGuideTabsProps {
  guides: DeploymentGuide[]
  loading?: boolean
}
```

**Platforms:**
- 🐳 Docker
- ▲ Vercel
- 🚂 Railway
- ☁️ AWS
- ⚙️ Manual

**Usage:**
```jsx
<DeploymentGuideTabs 
  guides={deploymentGuides}
  loading={isLoading}
/>
```

---

### 5. `ChangelogTimeline`

Vertical timeline visualization for version history.

**Location:** `/components/ChangelogTimeline.tsx`

**Props:**
```typescript
interface ChangelogEntry {
  id: string
  version: string
  description: string
  releaseDate: string
  releaseUrl?: string
}

interface ChangelogTimelineProps {
  entries: ChangelogEntry[]
  loading?: boolean
}
```

**Features:**
- Vertical timeline with blue dots
- Gray connecting lines between versions
- Release date display
- Optional external link to release

**Usage:**
```jsx
<ChangelogTimeline 
  entries={changelog}
  loading={isLoading}
/>
```

---

### 6. `CollectionsSidebar`

Quick-access sidebar for user collections.

**Location:** `/components/CollectionsSidebar.tsx`

**Props:**
```typescript
interface Collection {
  id: string
  name: string
  isPublic: boolean
}

interface CollectionsSidebarProps {
  serverId: string
  collections: Collection[]
  onAddToCollection: (collectionId: string) => void
}
```

**Features:**
- Expandable collection list
- Public (🌐) and private (🔒) indicators
- Quick "Add to collection" action
- Link to full collections management page

**Usage:**
```jsx
<CollectionsSidebar 
  serverId={serverId}
  collections={userCollections}
  onAddToCollection={handleAdd}
/>
```

---

## Pages

### 1. Compare Page (`/compare`)

**Location:** `/app/compare/page.tsx`

**Features:**
- Search to add servers (up to 3)
- Side-by-side comparison table
- Remove server option
- Display metrics: name, stars, category, verified status, maintenance status

**Key Metrics Compared:**
- Server name & description
- GitHub stars
- User rating
- Category
- Verified status
- Maintenance status
- Badge count
- Tag count

**Usage:**
Navigate to `/compare` to access the tool.

---

### 2. Collections Page (`/collections`)

**Location:** `/app/collections/page.tsx`

**Features:**
- View all user collections
- Create new collection (public/private toggle)
- Manage servers in collection
- Add/remove servers from collections
- View collection details

**Layout:**
- Left sidebar: Collections list with counts
- Main area: Selected collection with servers
- Public/private toggle for each collection

**Usage:**
Navigate to `/collections` to manage your server collections.

---

### 3. Moderation Page (`/admin/moderation`)

**Location:** `/app/admin/moderation/page.tsx`

**Features:**
- Admin-only moderation dashboard
- Filter reports (all, pending, resolved, dismissed)
- Detailed report view
- Review reports with admin notes
- Resolve or dismiss actions
- Statistics cards (pending, resolved, dismissed, total)

**Statistics:**
- Pending reports count
- Resolved reports count
- Dismissed reports count
- Total reports count

**Moderation Actions:**
- Review reports with detailed information
- Add internal notes
- Resolve (action taken)
- Dismiss (false report)

**Access Control:**
- Requires `is_admin` flag in user profile
- Redirects unauthorized users to home

**Usage:**
Navigate to `/admin/moderation` (admin access required).

---

### 4. Enhanced Server Detail Page (`/servers/[id]`)

**Location:** `/app/servers/[id]/page.tsx`

**Enhancements:**
- Server badges display (verified, trending, popular, etc.)
- Maintenance status indicator
- Deployment guides with platform tabs
- Version history timeline
- Collections sidebar for quick actions
- Quick actions panel (compare, export JSON)
- Moderation report link

**Layout:**
- Main content area with server details
- Right sidebar with quick actions
- Collections sidebar for adding to collections
- Tabs for deployment guides
- Timeline for changelog

**Usage:**
Navigate to `/servers/[serverId]` to view all enhanced features.

---

## Setup Instructions

### 1. Execute Database Schema

1. Go to your Supabase project
2. Open SQL Editor
3. Copy the contents of `/docs/database-features.sql`
4. Run the SQL script
5. Verify all tables are created

**Tables Created:**
- `server_tags` (with 50 default tags)
- `server_tag_mappings`
- `collections`
- `collection_servers`
- `server_badges`
- `deployment_guides`
- `maintenance_status`
- `server_dependencies`
- `server_changelog`
- `moderation_reports`

---

### 2. Configure Admin Users

To enable moderation access for specific users:

1. Go to Supabase Auth > Users
2. Find the user who needs admin access
3. Edit the `profiles` table for that user
4. Set `is_admin = true`

---

### 3. Optional: Add Sample Data

#### Add Server Tags
```sql
INSERT INTO server_tags (id, name, icon) VALUES
  (gen_random_uuid(), 'AI', '🤖'),
  (gen_random_uuid(), 'DevOps', '⚙️'),
  (gen_random_uuid(), 'Security', '🔒');
```

#### Add Server Badges
```sql
INSERT INTO server_badges (id, server_id, type, reason) VALUES
  (gen_random_uuid(), 'server-uuid', 'verified', 'Officially verified'),
  (gen_random_uuid(), 'server-uuid', 'trending', 'Rapidly growing');
```

#### Add Deployment Guides
```sql
INSERT INTO deployment_guides (id, server_id, platform, title, content) VALUES
  (gen_random_uuid(), 'server-uuid', 'docker', 'Docker Setup', 'Step-by-step guide...');
```

---

## Usage Guide

### How to Use Advanced Search

1. Navigate to home page or any search interface
2. Click "Advanced Filters" to expand options
3. Set desired filters:
   - Search text
   - Category
   - Star range
   - Rating range
   - Tags
   - Maintenance status
   - Sort order
4. Results update in real-time

### How to Compare Servers

1. Go to `/compare`
2. Search for first server using search box
3. Click "Add Server" (up to 3 servers)
4. View side-by-side comparison
5. Click ×  to remove server from comparison

### How to Create a Collection

1. Go to `/collections`
2. Click "Create Collection"
3. Enter name and optional description
4. Toggle public/private
5. Click "Create"
6. Add servers from comparison or server detail pages

### How to Report a Server

1. Go to server detail page (`/servers/[id]`)
2. Click "Report Server" button
3. Select reason: spam, malicious, duplicate, inactive, other
4. Enter details
5. Submit report
6. Admins review in moderation dashboard

### How to Add Deployment Guides

1. Go to server detail page
2. Scroll to "Deployment Guides" section
3. Click "Add Guide"
4. Select platform (Docker, Vercel, Railway, AWS, Manual)
5. Enter title and instructions
6. Save guide

### How to View Changelog

1. Go to server detail page
2. Scroll to "Version History" section
3. Click version to expand details
4. Click "Release Notes" link to view on GitHub (if available)

---

## Error Handling

### Common Issues

**"Cannot find module '@/lib/auth'"**
- Solution: Restart VS Code's TypeScript server
- Press ⌘⇧P → "TypeScript: Restart TS Server"

**"You don't have permission to access this page"**
- For moderation dashboard: User doesn't have `is_admin` flag
- Solution: Set `is_admin = true` in profiles table for the user

**"No reports found"**
- No moderation reports have been submitted yet
- Users can submit reports via server detail pages

**Collections not appearing**
- User must be authenticated
- Collections are created per user
- Check `/api/collections` response for errors

---

## Performance Considerations

- **Caching**: API endpoints cache results (60s for dynamic data, 3600s for static)
- **Pagination**: Search results paginated at 10 per page (configurable)
- **Real-time**: Collections and reports load on-demand with loading states
- **RLS**: Row-Level Security policies ensure data isolation

---

## Security

- **Authentication**: All write operations require authentication
- **Authorization**: Admin operations protected with role checks
- **RLS Policies**: Database-level security on all tables
- **CORS**: Properly configured for public API access
- **Input Validation**: All API endpoints validate input

---

## Future Enhancements

- [ ] Automated GitHub changelog sync
- [ ] Email notifications for moderation actions
- [ ] Batch import/export UI improvements
- [ ] Advanced analytics dashboard
- [ ] Server health status checks
- [ ] Integration with GitHub Marketplace
- [ ] WebSocket for real-time updates
- [ ] Full-text search optimization

---

## Support & Questions

For issues or questions:
1. Check this documentation
2. Review API endpoint specifications
3. Check database table structures
4. Review component prop interfaces
5. Check Supabase logs for database errors

---

**Last Updated:** March 3, 2026
**Documentation Version:** 1.0
**Status:** Production Ready ✅
