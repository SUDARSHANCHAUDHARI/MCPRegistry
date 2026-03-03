// API for server comparison
import { NextResponse } from 'next/server'
import { getServerById } from '@/lib/db'
import { getServerRating } from '@/lib/db-extended'
import { getServerBadges, getMaintenanceStatus } from '@/lib/db-features'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const ids = searchParams.getAll('ids').slice(0, 3) // Compare up to 3 servers

    if (ids.length === 0) {
      return NextResponse.json({ error: 'No servers specified' }, { status: 400 })
    }

    const servers = await Promise.all(
      ids.map(async (id) => {
        const server = await getServerById(id)
        const rating = server ? await getServerRating(server.id) : null
        const badges = server ? await getServerBadges(server.id) : []
        const maintenance = server ? await getMaintenanceStatus(server.id) : null

        return {
          ...server,
          rating,
          badges,
          maintenance,
        }
      })
    )

    return NextResponse.json(
      { servers: servers.filter(Boolean) },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, s-maxage=60',
        },
      }
    )
  } catch (error) {
    console.error('Comparison error:', error)
    return NextResponse.json({ error: 'Comparison failed' }, { status: 500 })
  }
}
