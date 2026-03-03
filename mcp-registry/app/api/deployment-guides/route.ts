// API for deployment guides
import { NextResponse } from 'next/server'
import { getDeploymentGuides, createDeploymentGuide } from '@/lib/db-features'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serverId = searchParams.get('serverId')

    if (!serverId) {
      return NextResponse.json({ error: 'serverId required' }, { status: 400 })
    }

    const guides = await getDeploymentGuides(serverId)
    return NextResponse.json(
      { guides },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600',
        },
      }
    )
  } catch (error) {
    console.error('Deployment guides error:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await supabase.auth.getUser()
    if (!user.data.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { serverId, platform, title, content, url } = await request.json()

    const guide = await createDeploymentGuide(
      serverId,
      platform,
      title,
      content,
      url,
      user.data.user.id
    )

    return NextResponse.json({ guide })
  } catch (error) {
    console.error('Deployment guides error:', error)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
