// API for import/export functionality
import { NextResponse } from 'next/server'
import { exportServersToJson, importServersFromJson } from '@/lib/db-features'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serverIds = searchParams.getAll('ids')

    if (!serverIds.length) {
      return NextResponse.json({ error: 'No server IDs specified' }, { status: 400 })
    }

    // Limit to 100 IDs per export request
    const limitedIds = serverIds.slice(0, 100)
    const exported = await exportServersToJson(limitedIds)

    return NextResponse.json(exported, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="mcp-servers-${Date.now()}.json"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Require authentication for imports
    const supabase = await createServerClient()
    const user = await supabase.auth.getUser()
    if (!user.data.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const jsonData = await request.json()

    if (!jsonData.servers || !Array.isArray(jsonData.servers)) {
      return NextResponse.json(
        { error: 'Invalid format: must have servers array' },
        { status: 400 }
      )
    }

    if (jsonData.servers.length > 100) {
      return NextResponse.json(
        { error: 'Import limit is 100 servers per request' },
        { status: 400 }
      )
    }

    const importedIds = await importServersFromJson(jsonData)

    return NextResponse.json({
      success: true,
      imported: importedIds.length,
      ids: importedIds,
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ error: 'Import failed' }, { status: 500 })
  }
}
