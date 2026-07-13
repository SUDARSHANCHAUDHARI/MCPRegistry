// All new database functions for premium features
import { supabase } from './supabase'

// ============ TAGS FUNCTIONS ============

export async function getAllTags() {
  try {
    const { data, error } = await supabase
      .from('server_tags')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

export async function getServerTags(serverId: string) {
  try {
    const { data, error } = await supabase
      .from('server_tag_mappings')
      .select('tag:server_tags(*)')
      .eq('server_id', serverId)

    if (error) throw error
    return data?.map((m: any) => m.tag) || []
  } catch (error) {
    console.error('Error fetching server tags:', error)
    return []
  }
}

export async function addTagToServer(serverId: string, tagId: string) {
  try {
    const { error } = await supabase
      .from('server_tag_mappings')
      .insert([{ server_id: serverId, tag_id: tagId }])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error adding tag:', error)
    return false
  }
}

// ============ COLLECTIONS FUNCTIONS ============

export async function getUserCollections(userId: string) {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching collections:', error)
    return []
  }
}

export async function createCollection(
  userId: string,
  name: string,
  description: string,
  isPublic: boolean = false
) {
  try {
    const { data, error } = await supabase
      .from('collections')
      .insert([
        {
          user_id: userId,
          name,
          description,
          is_public: isPublic,
        },
      ])
      .select()

    if (error) throw error
    return data?.[0]
  } catch (error) {
    console.error('Error creating collection:', error)
    return null
  }
}

export async function addServerToCollection(collectionId: string, serverId: string) {
  try {
    const { error } = await supabase
      .from('collection_servers')
      .insert([{ collection_id: collectionId, server_id: serverId }])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error adding server to collection:', error)
    return false
  }
}

export async function getCollectionServers(collectionId: string) {
  try {
    const { data, error } = await supabase
      .from('collection_servers')
      .select('server:mcp_servers(*)')
      .eq('collection_id', collectionId)

    if (error) throw error
    return data?.map((cs: any) => cs.server) || []
  } catch (error) {
    console.error('Error fetching collection servers:', error)
    return []
  }
}

// ============ BADGES FUNCTIONS ============

export async function getServerBadges(serverId: string) {
  try {
    const { data, error } = await supabase
      .from('server_badges')
      .select('*')
      .eq('server_id', serverId)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching badges:', error)
    return []
  }
}

export async function addServerBadge(
  serverId: string,
  badgeType: string,
  reason?: string,
  expiresAt?: Date
) {
  try {
    const { error } = await supabase
      .from('server_badges')
      .upsert([
        {
          server_id: serverId,
          badge_type: badgeType,
          reason,
          expires_at: expiresAt?.toISOString(),
        },
      ])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error adding badge:', error)
    return false
  }
}

// ============ MAINTENANCE STATUS FUNCTIONS ============

export async function getMaintenanceStatus(serverId: string) {
  try {
    const { data, error } = await supabase
      .from('maintenance_status')
      .select('*')
      .eq('server_id', serverId)
      .single()

    if (error?.code === 'PGRST116') return null // Not found
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching maintenance status:', error)
    return null
  }
}

export async function updateMaintenanceStatus(
  serverId: string,
  status: 'active' | 'maintaining' | 'stale' | 'archived',
  reason?: string
) {
  try {
    const { error } = await supabase
      .from('maintenance_status')
      .upsert([
        {
          server_id: serverId,
          status,
          reason,
          last_update: new Date().toISOString(),
        },
      ])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error updating maintenance status:', error)
    return false
  }
}

// ============ SIMILARITIES FUNCTIONS ============

export async function getSimilarServers(serverId: string, limit: number = 5) {
  try {
    // Get current server info
    const { data: currentServer, error: err1 } = await supabase
      .from('mcp_servers')
      .select('category')
      .eq('id', serverId)
      .single()

    if (err1) throw err1
    if (!currentServer) return []

    // Find servers in same category ordered by stars
    const { data: similar, error: err2 } = await supabase
      .from('mcp_servers')
      .select('*')
      .neq('id', serverId)
      .eq('status', 'approved')
      .contains('category', currentServer.category ? [currentServer.category] : [])
      .order('github_stars', { ascending: false })
      .limit(limit)

    if (err2) throw err2
    return similar || []
  } catch (error) {
    console.error('Error fetching similar servers:', error)
    return []
  }
}

// ============ DEPLOYMENT GUIDES FUNCTIONS ============

export async function getDeploymentGuides(serverId: string) {
  try {
    const { data, error } = await supabase
      .from('deployment_guides')
      .select('*')
      .eq('server_id', serverId)
      .order('platform')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching deployment guides:', error)
    return []
  }
}

export async function createDeploymentGuide(
  serverId: string,
  platform: string,
  title: string,
  content: string,
  url?: string,
  userId?: string
) {
  try {
    const { data, error } = await supabase
      .from('deployment_guides')
      .insert([
        {
          server_id: serverId,
          platform,
          title,
          content,
          url,
          created_by: userId,
        },
      ])
      .select()

    if (error) throw error
    return data?.[0]
  } catch (error) {
    console.error('Error creating deployment guide:', error)
    return null
  }
}

// ============ CHANGELOG FUNCTIONS ============

export async function getServerChangelog(serverId: string) {
  try {
    const { data, error } = await supabase
      .from('server_changelog')
      .select('*')
      .eq('server_id', serverId)
      .order('release_date', { ascending: false })
      .limit(10)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching changelog:', error)
    return []
  }
}

export async function addChangelogEntry(
  serverId: string,
  version: string,
  description: string,
  releaseDate?: Date,
  url?: string
) {
  try {
    const { data, error } = await supabase
      .from('server_changelog')
      .insert([
        {
          server_id: serverId,
          version,
          description,
          release_date: releaseDate?.toISOString(),
          url,
        },
      ])
      .select()

    if (error) throw error
    return data?.[0]
  } catch (error) {
    console.error('Error adding changelog entry:', error)
    return null
  }
}

// ============ MODERATION FUNCTIONS ============

export async function getPendingReports() {
  try {
    const { data, error } = await supabase
      .from('moderation_reports')
      .select('*, server:mcp_servers(*)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching reports:', error)
    return []
  }
}

export async function createModerationReport(
  serverId: string,
  reason: string,
  details?: string,
  reportedBy?: string
) {
  try {
    const { data, error } = await supabase
      .from('moderation_reports')
      .insert([
        {
          server_id: serverId,
          reason,
          details,
          reported_by: reportedBy,
        },
      ])
      .select()

    if (error) throw error
    return data?.[0]
  } catch (error) {
    console.error('Error creating report:', error)
    return null
  }
}

export async function reviewModerationReport(
  reportId: string,
  status: 'approved' | 'dismissed',
  adminNotes?: string,
  userId?: string
) {
  try {
    const { error } = await supabase
      .from('moderation_reports')
      .update({
        status,
        admin_notes: adminNotes,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', reportId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error reviewing report:', error)
    return false
  }
}

// ============ ADVANCED SEARCH FUNCTIONS ============

export async function searchServersAdvanced(filters: {
  search?: string
  category?: string
  minStars?: number
  minRating?: number
  tags?: string[]
  status?: 'active' | 'maintaining' | 'stale' | 'archived'
  page?: number
  limit?: number
}) {
  try {
    const page = filters.page || 1
    const limit = filters.limit || 12
    const offset = (page - 1) * limit

    let query = supabase
      .from('mcp_servers')
      .select('*, maintenance_status(*), server_badges(*)', { count: 'exact' })
      .eq('status', 'approved')

    if (filters.search) {
      // The value is interpolated into a PostgREST `.or()` filter string, where
      // `,` `(` `)` are structural delimiters and `%` `_` `\` are ilike wildcards.
      // Strip the delimiters (they can't be escaped inside .or()) and escape the
      // wildcards, so a crafted search can't inject extra filter conditions.
      const safeSearch = filters.search
        .slice(0, 100)
        .replace(/[(),*]/g, ' ')
        .replace(/[%_\\]/g, '\\$&')
        .trim()
      if (safeSearch) {
        query = query.or(
          `name.ilike.%${safeSearch}%,description.ilike.%${safeSearch}%`
        )
      }
    }

    if (filters.category) {
      query = query.contains('category', [filters.category])
    }

    if (filters.minStars) {
      query = query.gte('github_stars', filters.minStars)
    }

    // Add maintenance status filter if needed
    // This would need a join in practice

    const { data, error, count } = await query
      .order('github_stars', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return {
      servers: data || [],
      total: count || 0,
      page,
      limit,
    }
  } catch (error) {
    console.error('Error searching:', error)
    return { servers: [], total: 0, page: 1, limit: 12 }
  }
}

// ============ IMPORT/EXPORT FUNCTIONS ============

export async function exportServersToJson(serverIds: string[]) {
  try {
    const { data, error } = await supabase
      .from('mcp_servers')
      .select('*')
      .in('id', serverIds)

    if (error) throw error

    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      servers: data || [],
    }
  } catch (error) {
    console.error('Error exporting:', error)
    return null
  }
}

export async function importServersFromJson(jsonData: { servers: unknown[] }): Promise<string[]> {
  try {
    const serverIds: string[] = []
    const MAX_IMPORT_SIZE = 100
    const servers = (jsonData.servers || []).slice(0, MAX_IMPORT_SIZE)

    for (const rawServer of servers) {
      const server = rawServer as Record<string, unknown>

      // Validate required fields
      const name = typeof server.name === 'string' ? server.name.trim().slice(0, 100) : ''
      const description = typeof server.description === 'string' ? server.description.trim().slice(0, 500) : ''
      const github_url = typeof server.github_url === 'string' ? server.github_url.trim() : ''
      const install_command = typeof server.install_command === 'string' ? server.install_command.trim().slice(0, 500) : ''
      const category = typeof server.category === 'string' ? server.category.trim().slice(0, 50) : ''

      if (!name || name.length < 3) continue
      if (!description || description.length < 10) continue
      if (!github_url.startsWith('https://github.com/')) continue
      if (!install_command) continue

      const { data, error } = await supabase
        .from('mcp_servers')
        .upsert([
          {
            name,
            description,
            github_url,
            install_command,
            category,
            status: 'pending',
          },
        ])
        .select()

      if (!error && data) {
        serverIds.push(data[0].id)
      }
    }

    return serverIds
  } catch (error) {
    console.error('Error importing:', error)
    return []
  }
}
