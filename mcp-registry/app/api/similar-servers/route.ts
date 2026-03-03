// API for getting similar servers
import { NextResponse } from 'next/server'
import { getSimilarServers } from '@/lib/db-features'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serverId = searchParams.get('id')
    const limit = Math.min(parseInt(searchParams.get('limit') || '5'), 20)

    if (!serverId) {
      return NextResponse.json({ error: 'Server ID required' }, { status: 400 })
    }

    const similar = await getSimilarServers(serverId, limit)

    return NextResponse.json(
      { similar },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, s-maxage=60',
        },
      }
    )
  } catch (error) {
    console.error('Similar servers error:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
