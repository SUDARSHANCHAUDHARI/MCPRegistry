// API for tags
import { NextResponse } from 'next/server'
import { getAllTags, getServerTags } from '@/lib/db-features'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serverId = searchParams.get('serverId')

    if (serverId) {
      const tags = await getServerTags(serverId)
      return NextResponse.json({ tags })
    }

    const tags = await getAllTags()
    return NextResponse.json(
      { tags },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600',
        },
      }
    )
  } catch (error) {
    console.error('Tags error:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
