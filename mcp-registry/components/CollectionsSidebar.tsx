import { useState } from 'react'

interface CollectionsSidebarProps {
  serverId: string
  collections?: Array<{ id: string; name: string; is_public: boolean }>
  loading?: boolean
  onAddToCollection?: (collectionId: string) => void
}

export function CollectionsSidebar({ serverId, collections = [], loading = false, onAddToCollection }: CollectionsSidebarProps) {
  const [expanded, setExpanded] = useState(false)

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="text-gray-500 dark:text-gray-400 text-sm">Loading collections...</div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full mb-3"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white">📚 My Collections</h3>
        <span className="text-gray-600 dark:text-gray-400">{expanded ? '▼' : '▶'}</span>
      </button>

      {expanded && (
        <>
          {collections.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              <p>No collections yet</p>
              <a href="/collections" className="text-blue-600 dark:text-blue-400 hover:underline">
                Create one →
              </a>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => onAddToCollection?.(collection.id)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{collection.is_public ? '🌐' : '🔒'}</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">{collection.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {collection.is_public ? 'Public' : 'Private'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <a
        href="/collections"
        className="block mt-4 px-3 py-2 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-sm font-medium text-center transition-colors"
      >
        → View Collections
      </a>
    </div>
  )
}
