// API for moderation reports
import { NextResponse } from 'next/server'
import { getPendingReports, createModerationReport, reviewModerationReport } from '@/lib/db-features'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const supabase = await createServerClient()
    const user = await supabase.auth.getUser()
    if (!user.data.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.data.user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const reports = await getPendingReports()
    return NextResponse.json({ reports })
  } catch (error) {
    console.error('Moderation error:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const user = await supabase.auth.getUser()
    const { action, serverId, reason, details, reportId, status, adminNotes } =
      await request.json()

    if (action === 'report') {
      if (!user.data.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      if (!serverId || !reason) {
        return NextResponse.json(
          { error: 'serverId and reason required' },
          { status: 400 }
        )
      }

      const report = await createModerationReport(
        serverId,
        reason,
        details,
        user.data.user?.id
      )
      return NextResponse.json({ report })
    }

    if (action === 'review') {
      // Check if admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.data.user?.id)
        .single()

      if (!profile?.is_admin) {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
      }

      const success = await reviewModerationReport(
        reportId,
        status,
        adminNotes,
        user.data.user?.id
      )
      return NextResponse.json({ success })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Moderation error:', error)
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 })
  }
}
