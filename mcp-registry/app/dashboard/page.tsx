'use client'

import { getUserServers } from '@/lib/db-extended'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [servers, setServers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        window.location.href = '/login'
        return
      }

      setUser(currentUser)
      const userServers = await getUserServers(currentUser.id)
      setServers(userServers)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="text-center py-12">Loading...</div>
  if (!user) return null

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your submitted MCP servers</p>
      </div>

      <div className="mb-8">
        <Link
          href="/submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          + Submit New Server
        </Link>
      </div>

      {servers.length === 0 ? (
        <div className="text-center py-12 border border-gray-200 dark:border-gray-700 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't submitted any servers yet</p>
          <Link href="/submit" className="text-blue-600 hover:text-blue-700">
            Submit your first server →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {servers.map(server => (
            <div
              key={server.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 dark:bg-gray-900"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{server.name}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    server.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : server.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{server.description}</p>
              {server.rejection_reason && (
                <p className="text-red-600 dark:text-red-400 text-sm mb-4">
                  ❌ Rejection reason: {server.rejection_reason}
                </p>
              )}
              <Link
                href={`/servers/${server.id}`}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                View server →
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
