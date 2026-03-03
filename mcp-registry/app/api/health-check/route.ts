import { NextResponse } from 'next/server'
import { getAllServers } from '@/lib/db'
import { checkServerHealth } from '@/lib/db-extended'

export async function POST() {
  try {
    const { servers } = await getAllServers()

    for (const server of servers) {
      await checkServerHealth(server.id, server.github_url)
    }

    return NextResponse.json(
      { status: 'success', checked: servers.length },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Health check failed' },
      { status: 500 }
    )
  }
}
