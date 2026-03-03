export type ServerStatus = 'pending' | 'approved' | 'rejected'

export interface McpServer {
  id: string
  name: string
  description: string
  github_url: string
  install_command: string
  category: string[]
  github_stars: number
  verified: boolean
  status: ServerStatus
  submitted_by: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  github_username: string
  avatar_url: string
  is_admin: boolean
  created_at: string
}

export interface SubmitServerForm {
  name: string
  description: string
  github_url: string
  install_command: string
  category: string
}

export interface SearchParams {
  search?: string
  category?: string
  page?: string
  trending?: string
}
