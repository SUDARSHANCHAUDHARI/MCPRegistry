// API for import/export functionality
import { NextResponse } from 'next/server'
import { exportServersToJson, importServersFromJson } from '@/lib/db-features'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serverIds = searchParams.getAll('ids')

    if (!serverIds.length) {
      return NextResponse.json({ error: 'No server IDs specified' }, { status: 400 })
    }

    const exported = await exportServersToJson(serverIds)

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
    const jsonData = await request.json()

    if (!jsonData.servers || !Array.isArray(jsonData.servers)) {
      return NextResponse.json(
        { error: 'Invalid format: must have servers array' },
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
