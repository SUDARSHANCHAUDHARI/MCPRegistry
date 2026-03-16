import { getAllServers } from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || undefined
    const category = searchParams.get('category') || undefined
    const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '50', 10) || 50), 100)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)

    const { servers, total } = await getAllServers(search, category, page)

    return NextResponse.json(
      {
        status: 'success',
        data: servers.slice(0, limit),
        total,
        page,
        limit,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, s-maxage=60',
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch servers' },
      { status: 500 }
    )
  }
}
