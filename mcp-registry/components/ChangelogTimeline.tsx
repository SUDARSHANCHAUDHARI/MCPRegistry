interface ChangelogEntry {
  id: string
  version: string
  description: string
  release_date: string
  url?: string
}

interface ChangelogTimelineProps {
  entries?: ChangelogEntry[]
  loading?: boolean
}

export function ChangelogTimeline({ entries = [], loading = false }: ChangelogTimelineProps) {
  if (loading) {
    return <div className="text-gray-500 dark:text-gray-400">Loading changelog...</div>
  }

  if (entries.length === 0) {
    return <div className="text-gray-500 dark:text-gray-400">No version history available</div>
  }

  return (
    <div className="space-y-6">
      {entries.map((entry, idx) => (
        <div key={entry.id} className="flex gap-4">
          {/* Timeline dot and line */}
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400 mt-1.5"></div>
            {idx < entries.length - 1 && <div className="w-1 bg-gray-200 dark:bg-gray-700 flex-1 my-2" style={{ height: '60px' }}></div>}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-baseline gap-3 mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-white text-lg">v{entry.version}</h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(entry.release_date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 leading-relaxed">{entry.description}</p>
            {entry.url && (
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                → View Release
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
