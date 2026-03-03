'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'

interface Collection {
  id: string
  name: string
  description: string
  is_public: boolean
  server_count?: number
}

interface ServerInCollection {
  id: string
  name: string
  description: string
  category: string[]
  github_stars: number
  github_url: string
}

export default function CollectionsPage() {
  const { user } = useAuth()
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [servers, setServers] = useState<ServerInCollection[]>([])
  const [newCollectionName, setNewCollectionName] = useState('')
  const [newCollectionDesc, setNewCollectionDesc] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showNewCollection, setShowNewCollection] = useState(false)

  useEffect(() => {
    if (user) {
      fetchCollections()
    }
  }, [user])

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections?action=list')
      const data = await response.json()
      setCollections(data.data || [])
    } catch (error) {
      console.error('Error fetching collections:', error)
    }
  }

  const fetchCollectionServers = async (collectionId: string) => {
    try {
      const response = await fetch(`/api/collections?action=list&collectionId=${collectionId}`)
      const data = await response.json()
      setServers(data.data || [])
    } catch (error) {
      console.error('Error fetching servers:', error)
    }
  }

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return

    try {
      setLoading(true)
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          name: newCollectionName,
          description: newCollectionDesc,
          is_public: isPublic,
        }),
      })

      if (response.ok) {
        const newCollection = await response.json()
        setCollections([...collections, newCollection.data])
        setNewCollectionName('')
        setNewCollectionDesc('')
        setIsPublic(true)
        setShowNewCollection(false)
      }
    } catch (error) {
      console.error('Error creating collection:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectCollection = async (collection: Collection) => {
    setSelectedCollection(collection)
    await fetchCollectionServers(collection.id)
  }

  const handleRemoveFromCollection = async (serverId: string) => {
    if (!selectedCollection) return

    try {
      setLoading(true)
      const response = await fetch('/api/collections', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionId: selectedCollection.id,
          serverId: serverId,
        }),
      })

      if (response.ok) {
        setServers(servers.filter((s) => s.id !== serverId))
      }
    } catch (error) {
      console.error('Error removing from collection:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <main className="max-w-full mx-auto px-4 py-8">
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">
          ← Back to Registry
        </Link>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">Please log in to manage collections</p>
          <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Go to login
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">
        ← Back to Registry
      </Link>

      <div className="grid grid-cols-3 gap-8">
        {/* Collections Sidebar */}
        <div className="col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Collections</h2>
              <button
                onClick={() => setShowNewCollection(!showNewCollection)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-bold"
              >
                +
              </button>
            </div>

            {showNewCollection && (
              <div className="mb-4 p-3 border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700">
                <input
                  type="text"
                  placeholder="Collection name"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="w-full px-2 py-1 mb-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-white"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newCollectionDesc}
                  onChange={(e) => setNewCollectionDesc(e.target.value)}
                  className="w-full px-2 py-1 mb-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-white text-sm"
                  rows={2}
                />
                <label className="flex items-center mb-3 text-sm">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Public</span>
                </label>
                <button
                  onClick={handleCreateCollection}
                  disabled={loading}
                  className="w-full px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            )}

            <div className="space-y-2">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => handleSelectCollection(collection)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
                    selectedCollection?.id === collection.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="font-medium">{collection.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{collection.description}</div>
                  <div className="text-xs text-gray-400 mt-1">{collection.server_count || 0} servers</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Collection Details */}
        <div className="col-span-2">
          {selectedCollection ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCollection.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedCollection.description}</p>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {selectedCollection.is_public ? '🌐 Public' : '🔒 Private'} • {servers.length} servers
                </div>
              </div>

              {servers.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p>No servers in this collection yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {servers.map((server) => (
                    <div
                      key={server.id}
                      className="flex justify-between items-start p-3 border border-gray-100 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div>
                        <Link
                          href={`/servers/${server.id}`}
                          className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {server.name}
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{server.description}</p>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          ⭐ {server.github_stars} • {server.category.join(', ')}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCollection(server.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">Select a collection to view servers</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
