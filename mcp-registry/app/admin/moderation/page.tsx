'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

interface ModerationReport {
  id: string
  server_id: string
  server_name?: string
  reason: 'spam' | 'malicious' | 'duplicate' | 'inactive' | 'other'
  details: string
  status: 'pending' | 'resolved' | 'dismissed'
  reported_at: string
  reported_by?: string
  admin_notes?: string
  reviewed_by?: string
  reviewed_at?: string
}

export default function ModerationPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [reports, setReports] = useState<ModerationReport[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('pending')
  const [selectedReport, setSelectedReport] = useState<ModerationReport | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    checkAdminAccess()
  }, [user, router])

  const checkAdminAccess = async () => {
    try {
      // Check if user is admin by attempting to fetch reports
      const response = await fetch('/api/moderation?action=getPending')
      if (response.status === 403) {
        router.push('/')
        return
      }

      if (response.ok) {
        setIsAdmin(true)
        await fetchReports()
      }
    } catch (error) {
      console.error('Error checking admin access:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReports = async () => {
    try {
      const response = await fetch(`/api/moderation`)
      if (response.ok) {
        const data = await response.json()
        setReports(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    }
  }

  const handleReviewReport = async (reportId: string, status: 'resolved' | 'dismissed') => {
    try {
      const response = await fetch('/api/moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'review',
          reportId: reportId,
          status: status,
          adminNotes: adminNotes,
        }),
      })

      if (response.ok) {
        setReports(reports.map((r) => (r.id === reportId ? { ...r, status } : r)))
        setSelectedReport(null)
        setAdminNotes('')
        setReviewingId(null)
      }
    } catch (error) {
      console.error('Error reviewing report:', error)
    }
  }

  const filteredReports = reports.filter((r) => (filter === 'all' ? true : r.status === filter))

  const reasonLabels: Record<string, string> = {
    spam: '📧 Spam',
    malicious: '⚠️ Malicious',
    duplicate: '🔁 Duplicate',
    inactive: '😐 Inactive',
    other: '❓ Other',
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    resolved: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    dismissed: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
  }

  if (!isAdmin) {
    return (
      <main className="max-w-full mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
          <p className="text-red-700 dark:text-red-200">You don't have permission to access this page</p>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">
        ← Back to Registry
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Moderation Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Review and manage server reports</p>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-6 mb-6">
          {(['all', 'pending', 'resolved', 'dismissed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                filter === tab
                  ? 'bg-blue-600 dark:bg-blue-700 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({filteredReports.length})
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <div className="text-yellow-600 dark:text-yellow-300 text-sm font-medium">Pending</div>
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-200">
              {reports.filter((r) => r.status === 'pending').length}
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="text-green-600 dark:text-green-300 text-sm font-medium">Resolved</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-200">
              {reports.filter((r) => r.status === 'resolved').length}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">Dismissed</div>
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-200">
              {reports.filter((r) => r.status === 'dismissed').length}
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="text-blue-600 dark:text-blue-300 text-sm font-medium">Total</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-200">{reports.length}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Reports List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reports</h2>

          {filteredReports.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>No {filter} reports</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredReports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => {
                    setSelectedReport(report)
                    setAdminNotes(report.admin_notes || '')
                  }}
                  className={`w-full text-left p-3 rounded transition-colors border ${
                    selectedReport?.id === report.id
                      ? 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{report.server_name || 'Unknown'}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{reasonLabels[report.reason]}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(report.reported_at).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${statusColors[report.status]}`}
                    >
                      {report.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Report Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          {selectedReport ? (
            <>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Report Details</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Server
                  </label>
                  <Link
                    href={`/servers/${selectedReport.server_id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {selectedReport.server_name || 'Unknown'}
                  </Link>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reason
                  </label>
                  <p className="text-gray-800 dark:text-gray-200">{reasonLabels[selectedReport.reason]}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Details
                  </label>
                  <p className="text-gray-800 dark:text-gray-200 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    {selectedReport.details}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                      statusColors[selectedReport.status]
                    }`}
                  >
                    {selectedReport.status}
                  </span>
                </div>

                {selectedReport.reviewed_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reviewed
                    </label>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {new Date(selectedReport.reviewed_at).toLocaleString()} by {selectedReport.reviewed_by || 'Admin'}
                    </p>
                  </div>
                )}
              </div>

              {selectedReport.status === 'pending' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Admin Notes
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm"
                      rows={3}
                      placeholder="Add internal notes..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReviewReport(selectedReport.id, 'resolved')}
                      className="flex-1 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded hover:bg-green-700 dark:hover:bg-green-600 font-medium"
                    >
                      ✓ Resolved
                    </button>
                    <button
                      onClick={() => handleReviewReport(selectedReport.id, 'dismissed')}
                      className="flex-1 px-4 py-2 bg-gray-400 dark:bg-gray-600 text-white rounded hover:bg-gray-500 dark:hover:bg-gray-700 font-medium"
                    >
                      ✕ Dismiss
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>Select a report to view details</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
