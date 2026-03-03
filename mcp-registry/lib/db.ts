import { supabase } from './supabase'
import { McpServer, SubmitServerForm } from '@/types'

const PAGE_SIZE = 12

/**
 * Fetch all approved servers with optional filters
 */
export async function getAllServers(
  search?: string,
  category?: string,
  page = 1
): Promise<{ servers: McpServer[]; total: number }> {
  let query = supabase
    .from('mcp_servers')
    .select('*', { count: 'exact' })
    .eq('status', 'approved')
    .order('github_stars', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }
  if (category) {
    query = query.contains('category', [category])
  }

  const { data, error, count } = await query
  if (error) {
    console.error('Database error:', error)
    return { servers: [], total: 0 }
  }
  return { servers: data || [], total: count || 0 }
}

/**
 * Fetch a single server by ID
 */
export async function getServerById(id: string): Promise<McpServer | null> {
  const { data, error } = await supabase
    .from('mcp_servers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Database error:', error)
    return null
  }
  return data
}

/**
 * Get all unique categories
 */
export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('mcp_servers')
    .select('category')
    .eq('status', 'approved')

  if (error || !data) return []

  const allCategories = data.flatMap(row => row.category || [])
  return [...new Set(allCategories)].sort()
}

/**
 * Submit a new server
 */
export async function submitServer(
  form: SubmitServerForm,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('mcp_servers').insert([
    {
      name: form.name.trim(),
      description: form.description.trim(),
      github_url: form.github_url.trim(),
      install_command: form.install_command.trim(),
      category: form.category
        .split(',')
        .map(c => c.trim().toLowerCase())
        .filter(Boolean),
      submitted_by: userId,
      status: 'pending',
    },
  ])

  if (error) {
    return { success: false, error: error.message }
  }
  return { success: true }
}

/**
 * Get all pending servers (admin only)
 */
export async function getPendingServers(): Promise<McpServer[]> {
  const { data, error } = await supabase
    .from('mcp_servers')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Database error:', error)
    return []
  }
  return data || []
}

/**
 * Get total approved server count
 */
export async function getServerCount(): Promise<number> {
  const { count, error } = await supabase
    .from('mcp_servers')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')

  if (error) {
    console.error('Database error:', error)
    return 0
  }
  return count || 0
}
