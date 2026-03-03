import { getAllServers, getCategories, getServerCount } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { servers } = await getAllServers()
    const categories = await getCategories()
    const totalApproved = await getServerCount()

    return NextResponse.json(
      {
        status: 'success',
        total_servers: totalApproved,
        total_categories: categories.length,
        categories,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, s-maxage=300',
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
