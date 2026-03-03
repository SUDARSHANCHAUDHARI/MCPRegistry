// API for advanced search with filters
import { NextResponse } from 'next/server'
import { searchServersAdvanced } from '@/lib/db-features'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      minStars: searchParams.get('minStars') ? parseInt(searchParams.get('minStars')!) : undefined,
      minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined,
      tags: searchParams.getAll('tags'),
      status: (searchParams.get('status') as any) || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: Math.min(parseInt(searchParams.get('limit') || '12'), 100),
    }

    const result = await searchServersAdvanced(filters)

    return NextResponse.json(result, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=60',
      },
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
