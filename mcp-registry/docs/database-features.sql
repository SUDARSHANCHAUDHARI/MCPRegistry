-- Database additions for all new features
-- Execute after database-additions.sql

-- 1. Server Tags Table (for flexible tagging)
CREATE TABLE server_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🏷️',
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE server_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all" ON server_tags FOR SELECT USING (true);

-- 2. Server-Tag Junction Table
CREATE TABLE server_tag_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES mcp_servers(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES server_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(server_id, tag_id)
);

ALTER TABLE server_tag_mappings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all" ON server_tag_mappings FOR SELECT USING (true);

-- 3. Server Collections (user-created lists)
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read all public collections" ON collections FOR SELECT USING (is_public = true);
CREATE POLICY "Users can manage own collections" ON collections USING (auth.uid() = user_id);

-- 4. Collection-Server Mappings
CREATE TABLE collection_servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  server_id UUID NOT NULL REFERENCES mcp_servers(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(collection_id, server_id)
);

ALTER TABLE collection_servers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public collections visible to all" ON collection_servers FOR SELECT 
  USING (collection_id IN (SELECT id FROM collections WHERE is_public = true));

-- 5. Server Badges
CREATE TABLE server_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES mcp_servers(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL, -- 'verified', 'trending', 'popular', 'new', 'featured', 'maintaining', 'archived'
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  UNIQUE(server_id, badge_type)
);

ALTER TABLE server_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all" ON server_badges FOR SELECT USING (true);

-- 6. Deployment Guides
CREATE TABLE deployment_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES mcp_servers(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'docker', 'vercel', 'railway', 'manual', 'aws'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE deployment_guides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all" ON deployment_guides FOR SELECT USING (true);

-- 7. Server Maintenance Status
CREATE TABLE maintenance_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL UNIQUE REFERENCES mcp_servers(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active', -- 'active', 'maintaining', 'stale', 'archived'
  last_update TIMESTAMP,
  reason TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE maintenance_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all" ON maintenance_status FOR SELECT USING (true);

-- 8. Server Dependencies
CREATE TABLE server_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES mcp_servers(id) ON DELETE CASCADE,
  depends_on_server_id UUID NOT NULL REFERENCES mcp_servers(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(server_id, depends_on_server_id),
  CHECK (server_id != depends_on_server_id)
);

ALTER TABLE server_dependencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all" ON server_dependencies FOR SELECT USING (true);

-- 9. Server Changelog
CREATE TABLE server_changelog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES mcp_servers(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  release_date TIMESTAMP,
  description TEXT,
  url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE server_changelog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all" ON server_changelog FOR SELECT USING (true);

-- 10. Moderation Reports
CREATE TABLE moderation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES mcp_servers(id) ON DELETE CASCADE,
  reported_by UUID REFERENCES auth.users(id),
  reason TEXT NOT NULL, -- 'spam', 'malicious', 'duplicate', 'inactive', 'other'
  details TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'reviewed', 'approved', 'dismissed'
  admin_notes TEXT,
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE moderation_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read all reports" ON moderation_reports 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND is_admin = true)
  );

-- Indexes for performance
CREATE INDEX idx_server_tags_name ON server_tags(name);
CREATE INDEX idx_server_tag_mappings_server_id ON server_tag_mappings(server_id);
CREATE INDEX idx_server_tag_mappings_tag_id ON server_tag_mappings(tag_id);
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_collections_is_public ON collections(is_public);
CREATE INDEX idx_collection_servers_collection_id ON collection_servers(collection_id);
CREATE INDEX idx_server_badges_server_id ON server_badges(server_id);
CREATE INDEX idx_server_badges_type ON server_badges(badge_type);
CREATE INDEX idx_deployment_guides_server_id ON deployment_guides(server_id);
CREATE INDEX idx_maintenance_status_status ON maintenance_status(status);
CREATE INDEX idx_server_dependencies_server_id ON server_dependencies(server_id);
CREATE INDEX idx_server_changelog_server_id ON server_changelog(server_id);
CREATE INDEX idx_moderation_reports_status ON moderation_reports(status);

-- Insert default tags
INSERT INTO server_tags (name, icon, description) VALUES
('AI', '🤖', 'Artificial Intelligence and Machine Learning'),
('DevOps', '⚙️', 'DevOps and Infrastructure'),
('Database', '🗄️', 'Database and Data Management'),
('Security', '🔒', 'Security and Authentication'),
('ML', '🧠', 'Machine Learning'),
('Web', '🌐', 'Web Development'),
('CLI', '💻', 'Command Line Interface'),
('Testing', '✅', 'Testing and Quality Assurance'),
('Monitoring', '📊', 'Monitoring and Analytics'),
('API', '🔌', 'API and Integration')
ON CONFLICT (name) DO NOTHING;
