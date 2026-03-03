import { NextRequest, NextResponse } from 'next/server'
import { getAllServers } from '@/lib/db'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  // Check auth secret
  const secret = request.headers.get('x-sync-secret')
  if (secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { servers } = await getAllServers()

    for (const server of servers) {
      try {
        // Extract owner/repo from GitHub URL
        const match = server.github_url.match(/github\.com\/([^/]+)\/([^/]+)/)
        if (!match) continue

        const [, owner, repo] = match
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: process.env.GITHUB_TOKEN
            ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
            : {},
        })

        if (response.ok) {
          const data = (await response.json()) as any
          const stars = data.stargazers_count || 0

          // Update in database
          await supabase
            .from('mcp_servers')
            .update({ github_stars: stars, updated_at: new Date().toISOString() })
            .eq('id', server.id)
        }
      } catch (error) {
        console.error(`Failed to sync stars for ${server.name}:`, error)
      }
    }

    return NextResponse.json(
      { status: 'success', synced: servers.length },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Sync failed' },
      { status: 500 }
    )
  }
}
