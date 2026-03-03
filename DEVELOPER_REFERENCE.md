# MCP Registry - Developer Reference Guide

## 📖 Overview

This guide helps developers understand the architecture of the 15 premium features and how to extend them.

---

## 🏗️ Architecture

### Layers

```
┌─────────────────────────────────────────────┐
│        React Components (UI Layer)          │
├─────────────────────────────────────────────┤
│      Next.js Pages & API Routes             │
├─────────────────────────────────────────────┤
│    Database Query Functions (/lib)          │
├─────────────────────────────────────────────┤
│     Supabase (PostgreSQL + Auth)            │
└─────────────────────────────────────────────┘
```

### Tech Stack

- **Frontend**: React 18, Next.js 14, TypeScript
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth + Row-Level Security
- **Styling**: Tailwind CSS
- **State**: React Hooks + useEffect

---

## 📁 Project Structure

```
mcp-registry/
├── app/
│   ├── api/
│   │   ├── search-advanced/route.ts       # Advanced search
│   │   ├── compare/route.ts               # Server comparison
│   │   ├── similar-servers/route.ts       # Recommendations
│   │   ├── collections/route.ts           # User collections
│   │   ├── tags/route.ts                  # Tag management
│   │   ├── deployment-guides/route.ts     # Deploy guides
│   │   ├── moderation/route.ts            # Report management
│   │   ├── changelog/route.ts             # Version history
│   │   └── import-export/route.ts         # Backup/restore
│   ├── compare/page.tsx                   # Compare tool page
│   ├── collections/page.tsx               # Collections page
│   ├── admin/
│   │   └── moderation/page.tsx            # Moderation dashboard
│   └── servers/
│       └── [id]/page.tsx                  # Enhanced server detail
├── components/
│   ├── AdvancedSearchFilter.tsx           # Multi-filter UI
│   ├── ServerBadges.tsx                   # Badge display
│   ├── MaintenanceIndicator.tsx           # Status indicator
│   ├── DeploymentGuideTabs.tsx            # Guide tabs
│   ├── ChangelogTimeline.tsx              # Timeline
│   └── CollectionsSidebar.tsx             # Sidebar widget
├── lib/
│   ├── db-features.ts                     # Database queries
│   ├── auth.ts                            # Auth hook
│   ├── db.ts                              # Existing queries
│   ├── supabase.ts                        # Supabase client
│   └── db-extended.ts                     # Extended queries
└── docs/
    └── database-features.sql              # Database schema
```

---

## 🔄 Data Flow Examples

### Advanced Search Flow

```
User Input
    ↓
AdvancedSearchFilter Component
    ↓
onSearch() callback with filters
    ↓
POST /api/search-advanced?filters
    ↓
searchServersAdvanced() query function
    ↓
PostgreSQL query with WHERE clauses
    ↓
JSON response with results
    ↓
Display in UI with pagination
```

### Collection Management Flow

```
User Creates Collection
    ↓
POST /api/collections { action: "create" }
    ↓
createCollection() query function
    ↓
INSERT INTO collections
    ↓
Return collection ID
    ↓
Add servers with POST /api/collections { action: "addServer" }
    ↓
INSERT INTO collection_servers
    ↓
Display in Collections page
```

### Moderation Report Flow

```
User Submits Report
    ↓
POST /api/moderation { action: "report" }
    ↓
createModerationReport() query function
    ↓
INSERT INTO moderation_reports (pending)
    ↓
Admin Reviews in /admin/moderation
    ↓
POST /api/moderation { action: "review", status: "resolved" }
    ↓
updateModerationReport() query function
    ↓
UPDATE moderation_reports (status, admin_notes)
```

---

## 🗄️ Database Schema Reference

### Key Relationships

```
servers (existing)
  ├─→ server_tags (many-to-many via server_tag_mappings)
  ├─→ server_badges (one-to-many)
  ├─→ deployment_guides (one-to-many)
  ├─→ maintenance_status (one-to-one)
  ├─→ server_changelog (one-to-many)
  ├─→ server_dependencies (many-to-many)
  └─→ moderation_reports (one-to-many)

collections (auth.users)
  └─→ collection_servers (many-to-many via servers)
```

### Table Schemas

#### `server_tags`
```sql
CREATE TABLE server_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  icon VARCHAR(10) DEFAULT '🏷️',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `server_tag_mappings`
```sql
CREATE TABLE server_tag_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES server_tags(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `collections`
```sql
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `collection_servers`
```sql
CREATE TABLE collection_servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW()
);
```

#### `server_badges`
```sql
CREATE TABLE server_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `deployment_guides`
```sql
CREATE TABLE deployment_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  external_link VARCHAR(500),
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `maintenance_status`
```sql
CREATE TABLE maintenance_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  last_update TIMESTAMP,
  updated_by UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `server_dependencies`
```sql
CREATE TABLE server_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  depends_on_server_id UUID NOT NULL REFERENCES servers(id),
  relationship_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `server_changelog`
```sql
CREATE TABLE server_changelog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  version VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  release_date TIMESTAMP,
  release_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `moderation_reports`
```sql
CREATE TABLE moderation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  reason VARCHAR(50) NOT NULL,
  details TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  reported_by UUID,
  reported_at TIMESTAMP DEFAULT NOW(),
  reviewed_by UUID,
  reviewed_at TIMESTAMP,
  admin_notes TEXT
);
```

---

## 🔑 Key Query Functions

### Location: `/lib/db-features.ts`

#### Tag Functions
```typescript
// Get all tags
getAllTags(): Promise<Tag[]>

// Get tags for a server
getServerTags(serverId: string): Promise<Tag[]>

// Add tag to server
addTagToServer(serverId: string, tagId: string): Promise<void>
```

#### Collection Functions
```typescript
// Get user's collections
getUserCollections(userId: string): Promise<Collection[]>

// Create new collection
createCollection(userId: string, name: string, description?: string, isPublic?: boolean): Promise<Collection>

// Add server to collection
addServerToCollection(collectionId: string, serverId: string): Promise<void>

// Get servers in collection
getCollectionServers(collectionId: string): Promise<Server[]>
```

#### Badge Functions
```typescript
// Get server badges
getServerBadges(serverId: string): Promise<Badge[]>

// Add badge to server
addServerBadge(serverId: string, type: string, reason?: string): Promise<void>

// Remove badge
removeServerBadge(badgeId: string): Promise<void>
```

#### Maintenance Functions
```typescript
// Get maintenance status
getMaintenanceStatus(serverId: string): Promise<MaintenanceStatus>

// Update maintenance status
updateMaintenanceStatus(serverId: string, status: string, userId?: string): Promise<void>
```

#### Similarity Functions
```typescript
// Get similar servers
getSimilarServers(serverId: string, limit: number = 5): Promise<SimilarServer[]>
```

#### Guide Functions
```typescript
// Get deployment guides
getDeploymentGuides(serverId: string): Promise<Record<string, DeploymentGuide[]>>

// Create deployment guide
createDeploymentGuide(serverId: string, platform: string, title: string, content: string, externalLink?: string): Promise<void>
```

#### Changelog Functions
```typescript
// Get server changelog
getServerChangelog(serverId: string, limit: number = 10): Promise<ChangelogEntry[]>

// Add changelog entry
addChangelogEntry(serverId: string, version: string, description: string, releaseDate?: string, releaseUrl?: string): Promise<void>
```

#### Moderation Functions
```typescript
// Get pending reports
getPendingReports(): Promise<ModerationReport[]>

// Create moderation report
createModerationReport(serverId: string, reason: string, details: string, reportedBy?: string): Promise<void>

// Review moderation report
reviewModerationReport(reportId: string, status: string, adminNotes?: string, reviewedBy?: string): Promise<void>
```

#### Search Functions
```typescript
// Advanced search with filters
searchServersAdvanced(filters: SearchFilters): Promise<SearchResult>
```

#### Import/Export Functions
```typescript
// Export servers as JSON
exportServersToJson(serverIds: string[]): Promise<ExportData>

// Import servers from JSON
importServersFromJson(jsonData: ImportData): Promise<ImportResult>
```

---

## 🔌 API Route Pattern

### Standard API Route Structure

```typescript
// /app/api/[feature]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { someQueryFunction } from '@/lib/db-features'

export async function GET(request: NextRequest) {
  try {
    // 1. Get query parameters
    const searchParams = request.nextUrl.searchParams
    const param1 = searchParams.get('param1')

    // 2. Validate input
    if (!param1) {
      return NextResponse.json(
        { error: 'Missing required parameter' },
        { status: 400 }
      )
    }

    // 3. Call query function
    const data = await someQueryFunction(param1)

    // 4. Return response with caching headers
    return NextResponse.json({ data }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Get authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Parse request body
    const body = await request.json()

    // 3. Validate input
    if (!body.requiredField) {
      return NextResponse.json(
        { error: 'Missing required field' },
        { status: 400 }
      )
    }

    // 4. Execute mutation
    const result = await createSomething(body)

    // 5. Return response
    return NextResponse.json({ data: result }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## ⚛️ React Component Pattern

### Standard Component Structure

```typescript
'use client'

import { useState, useEffect } from 'react'

interface Props {
  // Define prop interface
  serverId: string
  onAction?: (data: any) => void
}

interface State {
  // Define state interface
  data: any[]
  loading: boolean
  error: string | null
}

export default function ComponentName({ serverId, onAction }: Props) {
  const [state, setState] = useState<State>({
    data: [],
    loading: true,
    error: null
  })

  // Load data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/endpoint?serverId=${serverId}`)
        if (!response.ok) throw new Error('Failed to fetch')
        
        const { data } = await response.json()
        setState({ data, loading: false, error: null })
      } catch (error) {
        setState({ 
          data: [], 
          loading: false, 
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    fetchData()
  }, [serverId])

  // Handle action
  const handleAction = async (item: any) => {
    try {
      const response = await fetch('/api/endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'execute', item })
      })
      
      if (response.ok) {
        // Update UI
        onAction?.(item)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Render
  if (state.loading) return <div>Loading...</div>
  if (state.error) return <div className="text-red-600">{state.error}</div>

  return (
    <div className="space-y-4">
      {state.data.map((item) => (
        <div key={item.id} className="p-4 border rounded">
          <h3>{item.name}</h3>
          <button 
            onClick={() => handleAction(item)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Action
          </button>
        </div>
      ))}
    </div>
  )
}
```

---

## 🔒 Security Patterns

### Row-Level Security (RLS)

All new tables use RLS policies:

```sql
-- Public read
ALTER TABLE server_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON server_tags 
  FOR SELECT USING (true);

-- Authenticated write (collections)
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User owns collection" ON collections 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create" ON collections 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin only (moderation)
ALTER TABLE moderation_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read" ON moderation_reports 
  FOR SELECT USING (
    auth.jwt() ->> 'is_admin' = 'true'
  );
```

### API Authentication Pattern

```typescript
// Check authentication
const { data: { session } } = await supabase.auth.getSession()
if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

// Check admin (for moderation)
const { data: profile } = await supabase
  .from('profiles')
  .select('is_admin')
  .eq('user_id', session.user.id)
  .single()

if (!profile?.is_admin) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

---

## 🧪 Testing Patterns

### Testing Database Queries

```typescript
// Test data
const testServerId = 'test-uuid'
const testUserId = 'test-user-uuid'

// Test getting tags
const tags = await getServerTags(testServerId)
expect(tags).toBeInstanceOf(Array)
expect(tags[0]).toHaveProperty('id', 'name', 'icon')

// Test creating collection
const collection = await createCollection(
  testUserId, 
  'Test Collection'
)
expect(collection.id).toBeDefined()
expect(collection.name).toBe('Test Collection')
```

### Testing API Endpoints

```typescript
// Test GET request
const response = await fetch('/api/tags?serverId=test-uuid')
expect(response.status).toBe(200)
const { data } = await response.json()
expect(data).toBeInstanceOf(Array)

// Test POST request
const response = await fetch('/api/moderation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'report',
    serverId: 'uuid',
    reason: 'spam',
    details: 'Test'
  })
})
expect(response.status).toBe(200 | 201)
```

---

## 📊 Performance Optimization

### Query Optimization
```typescript
// Add indexes in migration
CREATE INDEX ON server_tags(name);
CREATE INDEX ON server_tag_mappings(server_id);
CREATE INDEX ON collections(user_id);
CREATE INDEX ON collection_servers(server_id);
CREATE INDEX ON server_badges(server_id);
CREATE INDEX ON moderation_reports(status);
```

### API Caching
```typescript
// Cache control headers
return NextResponse.json({ data }, {
  headers: {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
  }
})
```

### Component Optimization
```typescript
// Use useCallback to prevent unnecessary re-renders
const handleSearch = useCallback((filters: SearchFilters) => {
  // ... search logic
}, [])

// Memoize expensive components
export default memo(AdvancedSearchFilter)
```

---

## 🔄 Extending Features

### Adding a New Table

1. **Create migration** in `/docs/database-features.sql`:
```sql
CREATE TABLE new_feature (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  data TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

2. **Create query functions** in `/lib/db-features.ts`:
```typescript
export async function getNewFeatureData(serverId: string) {
  const { data, error } = await supabase
    .from('new_feature')
    .select('*')
    .eq('server_id', serverId)
  
  return data || []
}
```

3. **Create API endpoint** in `/app/api/new-feature/route.ts`:
```typescript
export async function GET(request: NextRequest) {
  const serverId = request.nextUrl.searchParams.get('serverId')
  const data = await getNewFeatureData(serverId)
  return NextResponse.json({ data })
}
```

4. **Create component** in `/components/`:
```typescript
export default function NewFeatureComponent({ serverId }) {
  const [data, setData] = useState([])
  
  useEffect(() => {
    fetch(`/api/new-feature?serverId=${serverId}`)
      .then(r => r.json())
      .then(({ data }) => setData(data))
  }, [serverId])
  
  return <div>{/* render data */}</div>
}
```

5. **Add to page or component**:
```typescript
import NewFeatureComponent from '@/components/NewFeatureComponent'

export default function Page({ params }) {
  return (
    <NewFeatureComponent serverId={params.id} />
  )
}
```

---

## 📝 Code Standards

### TypeScript
- Use strict mode: `"strict": true` in tsconfig.json
- Define interfaces for all data structures
- Avoid `any` type, use generics instead
- Export types for reuse

### React
- Use functional components with hooks
- Add 'use client' directive for client components
- Use TypeScript for prop types
- Keep components small and focused
- Memoize when necessary

### API Routes
- Always validate input
- Return appropriate HTTP status codes
- Include CORS headers when needed
- Add error handling with try-catch
- Add caching headers for performance

### Database
- Use prepared statements (Supabase handles this)
- Add RLS policies for security
- Use CASCADE delete for relationships
- Add indexes on frequently queried columns
- Document table relationships

---

## 🐛 Debugging Tips

### Database Issues
```typescript
// Log Supabase errors
const { data, error } = await supabase
  .from('table')
  .select('*')

if (error) {
  console.error('Supabase error:', error.message)
  console.error('Error details:', error)
}
```

### API Issues
```typescript
// Check request/response
console.log('Request:', request.nextUrl.searchParams)
console.log('Response status:', status)
console.log('Response body:', JSON.stringify(data))
```

### Component Issues
```typescript
// Log state changes
useEffect(() => {
  console.log('State updated:', state)
}, [state])

// Log async operations
const handleAction = async () => {
  console.log('Starting action...')
  const result = await fetch('/api/endpoint')
  console.log('Action result:', result)
}
```

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

---

**Last Updated:** March 3, 2026
**Version:** 1.0
**Status:** Production Ready ✅
