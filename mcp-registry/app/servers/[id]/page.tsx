'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getServerById } from '@/lib/db'
import { getServerRating } from '@/lib/db-extended'
import CopyButton from '@/components/CopyButton'
import RatingComponent from '@/components/RatingComponent'
import { ServerBadges } from '@/components/ServerBadges'
import { MaintenanceIndicator } from '@/components/MaintenanceIndicator'
import { DeploymentGuideTabs } from '@/components/DeploymentGuideTabs'
import { ChangelogTimeline } from '@/components/ChangelogTimeline'
import { CollectionsSidebar } from '@/components/CollectionsSidebar'

interface ServerPageProps {
  params: { id: string }
}

export default function ServerPage({ params }: ServerPageProps) {
  const [server, setServer] = useState<any>(null)
  const [rating, setRating] = useState<any>(null)
  const [badges, setBadges] = useState<Array<{ badge_type: string; reason?: string }>>([])
  const [maintenance, setMaintenance] = useState<any>(null)
  const [guides, setGuides] = useState<any[]>([])
  const [changelog, setChangelog] = useState<any[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadServerData = async () => {
      try {
        const serverData = await getServerById(params.id)
        if (!serverData) {
          setLoading(false)
          return
        }

        setServer(serverData)
        const ratingData = await getServerRating(serverData.id)
        setRating(ratingData)

        const badgesRes = await fetch(`/api/compare?ids=${serverData.id}`)
        if (badgesRes.ok) {
          const badgesData = await badgesRes.json()
          if (badgesData.data[0]?.badges) setBadges(badgesData.data[0].badges)
        }

        const maintenanceRes = await fetch(`/api/compare?ids=${serverData.id}`)
        if (maintenanceRes.ok) {
          const maintenanceData = await maintenanceRes.json()
          if (maintenanceData.data[0]?.maintenance) setMaintenance(maintenanceData.data[0].maintenance)
        }

        const guidesRes = await fetch(`/api/deployment-guides?serverId=${serverData.id}`)
        if (guidesRes.ok) {
          const guidesData = await guidesRes.json()
          setGuides(guidesData.data || [])
        }

        const changelogRes = await fetch(`/api/changelog?serverId=${serverData.id}`)
        if (changelogRes.ok) {
          const changelogData = await changelogRes.json()
          setChangelog(changelogData.data || [])
        }

        const collectionsRes = await fetch('/api/collections?action=list')
        if (collectionsRes.ok) {
          const collectionsData = await collectionsRes.json()
          setCollections(collectionsData.data || [])
        }
      } catch (error) {
        console.error('Error loading server data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadServerData()
  }, [params.id])

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </main>
    )
  }

  if (!server) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Server not found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">This MCP server doesn't exist yet.</p>
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            ← Back to Registry
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 inline-block">
        ← Back to Registry
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">{server.name}</h1>
            {badges.length > 0 && (
              <div className="mb-4">
                <ServerBadges badges={badges} />
              </div>
            )}
            <p className="text-gray-600 dark:text-gray-400 text-lg">{server.description}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-2">CATEGORIES</p>
              <div className="flex flex-wrap gap-2">
                {server.category.map((cat: string) => (
                  <span key={cat} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-2 py-1 rounded">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-2">GitHub Stars</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">⭐ {server.github_stars}</p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-2">Community Rating</p>
              {rating ? (
                <p className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">
                  {rating.average.toFixed(1)} <span className="text-sm text-gray-500 dark:text-gray-400">({rating.count})</span>
                </p>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No ratings yet</p>
              )}
            </div>
          </div>

          {/* Maintenance Status */}
          {maintenance && (
            <div className="mb-8">
              <MaintenanceIndicator status={maintenance.status} />
            </div>
          )}

          {/* Install Command */}
          <div className="bg-gray-900 dark:bg-gray-950 text-gray-100 dark:text-gray-200 p-6 rounded-lg mb-8 font-mono">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Install command:</p>
            <div className="flex items-center justify-between">
              <code className="text-sm overflow-x-auto whitespace-nowrap">{server.install_command}</code>
              <CopyButton text={server.install_command} />
            </div>
          </div>

          {/* GitHub Link */}
          <a
            href={server.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition mb-8"
          >
            View on GitHub ↗
          </a>

          {/* Deployment Guides */}
          {guides.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📝 Deployment Guides</h2>
              <DeploymentGuideTabs guides={guides} />
            </div>
          )}

          {/* Changelog */}
          {changelog.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📜 Version History</h2>
              <ChangelogTimeline entries={changelog} />
            </div>
          )}

          {/* Community Reviews */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">⭐ Community Reviews</h2>
            {rating && rating.count > 0 ? (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-bold">{rating.average.toFixed(1)}</span> out of 5 stars ({rating.count} {rating.count === 1 ? 'review' : 'reviews'})
                </p>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 mb-4">Be the first to rate this server!</p>
            )}
            <RatingComponent serverId={server.id} />
          </div>

          {/* Report Issue */}
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
            <a
              href={`https://github.com/sudarshan/mcp-registry/issues?title=Report: ${server.name}`}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Report an issue
            </a>
            {' • '}
            <a
              href={`/admin/moderation?serverId=${server.id}`}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Report for moderation
            </a>
          </p>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <CollectionsSidebar
            serverId={server.id}
            collections={collections}
            onAddToCollection={async (collectionId) => {
              try {
                await fetch('/api/collections', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: 'addServer',
                    collectionId,
                    serverId: server.id,
                  }),
                })
              } catch (error) {
                console.error('Error adding to collection:', error)
              }
            }}
          />

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">⚡ Quick Actions</h3>
            <div className="space-y-2">
              <a
                href={`/compare?servers=${server.id}`}
                className="block px-3 py-2 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-sm font-medium text-center transition-colors"
              >
                Compare with Others
              </a>
              <button
                onClick={() => {
                  const json = JSON.stringify([server], null, 2)
                  const blob = new Blob([json], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `${server.name}.json`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                className="block w-full px-3 py-2 rounded bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 text-sm font-medium text-center transition-colors"
              >
                Export as JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
