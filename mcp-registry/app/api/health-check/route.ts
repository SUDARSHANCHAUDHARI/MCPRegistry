import { NextRequest, NextResponse } from 'next/server'
import { getAllServers } from '@/lib/db'
import { checkServerHealth } from '@/lib/db-extended'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  // Protect with the same sync secret to prevent unauthorized health checks
  const secret = request.headers.get('x-sync-secret') || ''
  const expectedSecret = process.env.SYNC_SECRET || ''
  if (
    !expectedSecret ||
    secret.length !== expectedSecret.length ||
    !crypto.timingSafeEqual(Buffer.from(secret), Buffer.from(expectedSecret))
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
