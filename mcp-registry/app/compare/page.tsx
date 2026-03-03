'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'

interface ComparisonServer {
  id: string
  name: string
  description: string
  category: string[]
  github_stars: number
  github_url: string
  install_command: string
  verified: boolean
  rating?: { average: number; count: number }
  badges?: Array<{ badge_type: string; reason?: string }>
  maintenance?: { status: string }
}

export default function ComparePage() {
  const [servers, setServers] = useState<ComparisonServer[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleAddServer = async () => {
    if (!searchQuery) return

    try {
      setLoading(true)
      const response = await fetch(`/api/servers?search=${encodeURIComponent(searchQuery)}&limit=5`)
      const data = await response.json()

      if (data.data && data.data.length > 0) {
        const server = data.data[0]
        const detailResponse = await fetch(`/api/servers?search=${encodeURIComponent(server.id)}`)
        const detail = await detailResponse.json()

        if (!servers.some((s) => s.id === server.id)) {
          setServers([...servers, server])
        }
        setSearchQuery('')
      }
    } catch (error) {
      console.error('Error adding server:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeServer = (id: string) => {
    setServers(servers.filter((s) => s.id !== id))
  }

  const features = [
    { label: 'Name', key: 'name' },
    { label: '⭐ Stars', key: 'github_stars' },
    { label: '📊 Category', key: 'category' },
    { label: '✓ Verified', key: 'verified' },
    { label: '⏷ Status', key: 'maintenance' },
  ]

  return (
    <main className="max-w-full mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">
        ← Back to Registry
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Server Comparison</h1>
        <p className="text-gray-600 dark:text-gray-400">Compare up to 3 servers side-by-side</p>

        <div className="mt-6 flex gap-2">
          <input
            type="text"
            placeholder="Search servers to compare..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddServer()}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleAddServer}
            disabled={servers.length >= 3 || loading}
            className={`px-4 py-2 rounded font-medium ${
              servers.length >= 3 || loading
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
            }`}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>

        {servers.length === 0 ? (
          <div className="mt-8 text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Add servers to start comparing</p>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-3 font-semibold text-gray-900 dark:text-white">Feature</th>
                  {servers.map((server) => (
                    <th key={server.id} className="text-left py-3 px-3 font-semibold text-gray-900 dark:text-white">
                      <div className="flex justify-between items-center">
                        <span>{server.name}</span>
                        <button
                          onClick={() => removeServer(server.id)}
                          className="ml-2 text-red-600 dark:text-red-400 hover:text-red-700 text-lg"
                        >
                          ✕
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature) => (
                  <tr key={feature.key} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3 px-3 font-medium text-gray-700 dark:text-gray-300">{feature.label}</td>
                    {servers.map((server) => (
                      <td key={`${server.id}-${feature.key}`} className="py-3 px-3 text-gray-600 dark:text-gray-400">
                        {feature.key === 'name' && (
                          <a
                            href={`/servers/${server.id}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {server.name}
                          </a>
                        )}
                        {feature.key === 'github_stars' && `⭐ ${server.github_stars.toLocaleString()}`}
                        {feature.key === 'category' && server.category.join(', ')}
                        {feature.key === 'verified' && (
                          <span className={server.verified ? 'text-green-600' : 'text-gray-400'}>
                            {server.verified ? '✓ Yes' : '○ No'}
                          </span>
                        )}
                        {feature.key === 'maintenance' && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700">
                            {server.maintenance?.status || 'Active'}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
