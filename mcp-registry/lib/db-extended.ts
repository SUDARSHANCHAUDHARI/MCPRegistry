import { supabase } from './supabase'

/**
 * Add or update a rating for a server
 */
export async function submitRating(
  serverId: string,
  userId: string,
  rating: number,
  review?: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('ratings').upsert([
    {
      server_id: serverId,
      user_id: userId,
      rating: Math.max(1, Math.min(5, rating)),
      review: review?.trim() || null,
    },
  ])

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/**
 * Get average rating for a server
 */
export async function getServerRating(serverId: string): Promise<{
  average: number
  count: number
  userRating?: number
  userReview?: string
}> {
  const { data, error } = await supabase
    .from('ratings')
    .select('rating, review')
    .eq('server_id', serverId)

  if (error || !data) return { average: 0, count: 0 }

  const average =
    data.length > 0 ? (data.reduce((sum, r) => sum + r.rating, 0) / data.length).toFixed(1) : 0

  return {
    average: parseFloat(String(average)),
    count: data.length,
  }
}

/**
 * Get trending servers (most rated this week)
 */
export async function getTrendingServers(): Promise<any[]> {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('ratings')
    .select('server_id, rating')
    .eq('status', 'approved')
    .gt('created_at', weekAgo)

  if (error || !data) return []

  const grouped = data.reduce(
    (acc: any, r: any) => {
      acc[r.server_id] = (acc[r.server_id] || 0) + 1
      return acc
    },
    {}
  )

  const sorted = Object.entries(grouped)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 10)
    .map(([id]) => id)

  const { data: servers } = await supabase
    .from('mcp_servers')
    .select('*')
    .in('id', sorted)
    .eq('status', 'approved')

  return servers || []
}

/**
 * Get leaderboard (top creators)
 */
export async function getLeaderboard(): Promise<
  Array<{
    github_username: string
    avatar_url: string
    server_count: number
    total_ratings: number
  }>
> {
  const { data, error } = await supabase
    .from('mcp_servers')
    .select('submitted_by')
    .eq('status', 'approved')

  if (error || !data) return []

  const submitted = data.reduce(
    (acc: any, s: any) => {
      if (s.submitted_by) acc[s.submitted_by] = (acc[s.submitted_by] || 0) + 1
      return acc
    },
    {}
  )

  const userIds = Object.keys(submitted)

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, github_username, avatar_url')
    .in('id', userIds)

  if (!profiles) return []

  return profiles
    .map(p => ({
      github_username: p.github_username,
      avatar_url: p.avatar_url,
      server_count: submitted[p.id] || 0,
      total_ratings: 0,
    }))
    .sort((a, b) => b.server_count - a.server_count)
    .slice(0, 20)
}

/**
 * Check server health
 */
export async function checkServerHealth(
  serverId: string,
  githubUrl: string
): Promise<{ success: boolean }> {
  try {
    // Check if GitHub repo exists
    const repoMatch = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (!repoMatch) return { success: false }

    const [, owner, repo] = repoMatch
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
    const isHealthy = response.ok

    await supabase.from('server_health').upsert([
      {
        server_id: serverId,
        is_healthy: isHealthy,
        github_repo_exists: isHealthy,
        last_checked: new Date().toISOString(),
      },
    ])

    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

/**
 * Get user's submitted servers
 */
export async function getUserServers(userId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('mcp_servers')
    .select('*')
    .eq('submitted_by', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Database error:', error)
    return []
  }
  return data || []
}

/**
 * Track analytics event
 */
export async function trackEvent(
  eventType: string,
  serverId?: string,
  userId?: string,
  metadata?: any
): Promise<void> {
  try {
    await supabase.from('analytics').insert([
      {
        event_type: eventType,
        server_id: serverId || null,
        user_id: userId || null,
        metadata: metadata || {},
      },
    ])
  } catch (error) {
    console.error('Analytics error:', error)
  }
}

/**
 * Get analytics summary (admin only)
 */
export async function getAnalyticsSummary(): Promise<{
  total_views: number
  total_searches: number
  total_submissions: number
  total_api_calls: number
}> {
  const { data, error } = await supabase
    .from('analytics')
    .select('event_type')

  if (error || !data) {
    return { total_views: 0, total_searches: 0, total_submissions: 0, total_api_calls: 0 }
  }

  return {
    total_views: data.filter(e => e.event_type === 'view').length,
    total_searches: data.filter(e => e.event_type === 'search').length,
    total_submissions: data.filter(e => e.event_type === 'submit').length,
    total_api_calls: data.filter(e => e.event_type === 'api_call').length,
  }
}
