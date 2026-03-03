// API for server changelog
import { NextResponse } from 'next/server'
import { getServerChangelog, addChangelogEntry } from '@/lib/db-features'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serverId = searchParams.get('serverId')

    if (!serverId) {
      return NextResponse.json({ error: 'serverId required' }, { status: 400 })
    }

    const changelog = await getServerChangelog(serverId)
    return NextResponse.json(
      { changelog },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600',
        },
      }
    )
  } catch (error) {
    console.error('Changelog error:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await supabase.auth.getUser()
    if (!user.data.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { serverId, version, description, releaseDate, url } = await request.json()

    const entry = await addChangelogEntry(
      serverId,
      version,
      description,
      releaseDate ? new Date(releaseDate) : undefined,
      url
    )

    return NextResponse.json({ entry })
  } catch (error) {
    console.error('Changelog error:', error)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
