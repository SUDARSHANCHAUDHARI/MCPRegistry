// API for advanced search with filters
import { NextResponse } from 'next/server'
import { searchServersAdvanced } from '@/lib/db-features'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const rawMinStars = parseInt(searchParams.get('minStars') || '', 10)
    const rawMinRating = parseFloat(searchParams.get('minRating') || '')
    const rawPage = parseInt(searchParams.get('page') || '1', 10)
    const rawLimit = parseInt(searchParams.get('limit') || '12', 10)

    const filters = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      minStars: isNaN(rawMinStars) ? undefined : rawMinStars,
      minRating: isNaN(rawMinRating) ? undefined : rawMinRating,
      tags: searchParams.getAll('tags'),
      status: (searchParams.get('status') as 'active' | 'maintaining' | 'stale' | 'archived') || undefined,
      page: isNaN(rawPage) ? 1 : Math.max(1, rawPage),
      limit: Math.min(isNaN(rawLimit) ? 12 : Math.max(1, rawLimit), 100),
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
