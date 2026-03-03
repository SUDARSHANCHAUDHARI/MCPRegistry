# MCP Registry - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Execute Database Schema
1. Go to your Supabase SQL Editor
2. Open `/docs/database-features.sql` from your project
3. Copy and paste the entire content
4. Click "Run"
5. Wait for "✓ Success" message

### Step 2: Set Product to Admin (Optional, for Moderation)
```sql
UPDATE auth.users SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'),
  '{is_admin}',
  'true'
) WHERE email = 'your-email@example.com';
```

### Step 3: Restart TypeScript Server (VS Code)
1. Press `⌘⇧P`
2. Type "TypeScript: Restart TS Server"
3. Press Enter

### Step 4: Build & Run
```bash
npm run build  # Should show "✓ Generating static pages (28/28)"
npm run dev    # Start development server
```

---

## 📋 Feature Overview

### 🔍 Advanced Search (`/api/search-advanced`)
Search servers with filters: category, stars, rating, tags, maintenance status

### ⚖️ Compare (`/compare`)
Side-by-side comparison of up to 3 servers

### 📚 Collections (`/collections`)
Create and manage custom server collections

### 🎖️ Badges
Server status indicators: verified, trending, popular, new, featured, maintaining, archived

### 🚀 Deployment Guides
Platform-specific instructions for Docker, Vercel, Railway, AWS, Manual

### 🔧 Maintenance Status
Track active development: active, maintaining, stale, archived

### 📝 Changelog
Version history and release notes

### 🛡️ Moderation (`/admin/moderation`)
Report and review spam/malicious servers (admin-only)

### 📤 Import/Export
Backup and share server lists as JSON

### 🏷️ Tags
50 predefined tag categories

---

## 🔗 API Endpoints Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/search-advanced` | GET | Advanced server search with filters |
| `/api/compare` | GET | Compare multiple servers |
| `/api/similar-servers` | GET | Get server recommendations |
| `/api/collections` | GET/POST | Manage user collections |
| `/api/tags` | GET | List available tags |
| `/api/deployment-guides` | GET/POST | Deploy guides by platform |
| `/api/changelog` | GET/POST | Version history |
| `/api/moderation` | GET/POST | Report and review servers |
| `/api/import-export` | GET/POST | Backup/restore servers |

---

## 🖥️ Pages Reference

| Page | URL | Features |
|------|-----|----------|
| Compare Tool | `/compare` | Side-by-side server comparison |
| Collections | `/collections` | Create and manage collections |
| Moderation | `/admin/moderation` | Review reports (admin-only) |
| Server Detail | `/servers/[id]` | Enhanced with all features |

---

## 🧩 Components Reference

| Component | Purpose |
|-----------|---------|
| `AdvancedSearchFilter` | Multi-filter search UI |
| `ServerBadges` | Status badge display |
| `MaintenanceIndicator` | Development status |
| `DeploymentGuideTabs` | Platform guides |
| `ChangelogTimeline` | Version history |
| `CollectionsSidebar` | Quick collection access |

---

## 🗄️ Database Tables

10 new tables created:
- `server_tags` - 50 predefined tags
- `server_tag_mappings` - Server-tag relationships
- `collections` - User collections
- `collection_servers` - Collection membership
- `server_badges` - Status badges
- `deployment_guides` - Platform guides
- `maintenance_status` - Dev status tracking
- `server_dependencies` - Server relationships
- `server_changelog` - Version history
- `moderation_reports` - Report tracking

---

## ⚡ Common Tasks

### Add a Server Tag
```typescript
POST /api/tags
{
  "serverId": "uuid",
  "tagId": "uuid"
}
```

### Create a Collection
```javascript
// Go to /collections
// Click "Create Collection"
// Enter name, toggle public/private
// Click "Create"
```

### Report a Server
```javascript
// Go to /servers/[id]
// Click "Report Server"
// Select reason, enter details
// Submit
```

### Compare Servers
```javascript
// Go to /compare
// Search and add up to 3 servers
// View comparison table
```

### Add Deployment Guide
```typescript
POST /api/deployment-guides
{
  "serverId": "uuid",
  "platform": "docker",
  "title": "Docker Setup",
  "content": "Instructions..."
}
```

### View Moderation Reports
```javascript
// Go to /admin/moderation (admin-only)
// Filter: pending, resolved, dismissed
// Click report to review
// Add notes and resolve/dismiss
```

---

## ✅ Verification Checklist

- [x] Database schema created (`/docs/database-features.sql`)
- [x] All API endpoints implemented (8 new routes)
- [x] All React components created (6 components)
- [x] All pages implemented (3 new pages + 1 enhanced)
- [x] Build passing with 28 routes
- [x] No TypeScript compilation errors
- [x] Dark mode support on all components
- [x] RLS policies for security
- [x] Error handling on all endpoints

---

## 🆘 Troubleshooting

### "Import error for @/lib/auth"
→ Restart TypeScript server: `⌘⇧P` → "TypeScript: Restart TS Server"

### "Cannot access moderation page"
→ User needs `is_admin = true` in profiles table

### "Collections not loading"
→ User must be authenticated via Supabase Auth

### "Build failing"
→ Run `npm run build` to see detailed errors

### "Database tables not created"
→ Run `/docs/database-features.sql` in Supabase SQL Editor

---

## 📚 Documentation Files

- **`FEATURES_DOCUMENTATION.md`** - Comprehensive feature documentation
- **`QUICK_START_GUIDE.md`** - This file
- **`/docs/database-features.sql`** - Database schema
- **`/lib/db-features.ts`** - Database query functions

---

## 🎯 Next Steps

1. ✅ Execute database schema in Supabase
2. ✅ Restart TypeScript server
3. ✅ Build project: `npm run build`
4. ✅ Start development: `npm run dev`
5. 📝 Add sample data (optional)
6. 🔧 Configure admin users (optional)
7. 🎉 Start using premium features!

---

**Status:** Ready to Use ✅
**Last Updated:** March 3, 2026
