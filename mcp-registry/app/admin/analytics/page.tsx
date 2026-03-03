import { getAnalyticsSummary } from '@/lib/db-extended'
import { getServerCount } from '@/lib/db'
import Link from 'next/link'

export default async function AnalyticsPage() {
  const analytics = await getAnalyticsSummary()
  const totalServers = await getServerCount()

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">📊 Analytics</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Admin view — Registry performance</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Servers</p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{totalServers}</p>
        </div>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Page Views</p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{analytics.total_views}</p>
        </div>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Searches</p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{analytics.total_searches}</p>
        </div>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">API Calls</p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {analytics.total_api_calls}
          </p>
        </div>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Submissions</p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {analytics.total_submissions}
          </p>
        </div>
      </div>

      <Link
        href="/admin"
        className="text-blue-600 hover:text-blue-700 text-sm"
      >
        ← Back to Admin Panel
      </Link>
    </main>
  )
}
