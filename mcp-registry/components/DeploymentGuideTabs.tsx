import { useState } from 'react'

interface DeploymentGuide {
  id: string
  platform: string
  title: string
  content: string
  url?: string
}

interface DeploymentGuideTabsProps {
  guides?: DeploymentGuide[]
  loading?: boolean
}

export function DeploymentGuideTabs({ guides = [], loading = false }: DeploymentGuideTabsProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(guides[0]?.platform || null)

  const currentGuide = guides.find((g) => g.platform === selectedPlatform)

  const platformIcons: Record<string, string> = {
    docker: '🐳',
    vercel: '▲',
    railway: '🚂',
    aws: '☁️',
    manual: '⚙️',
  }

  if (loading) {
    return <div className="text-gray-500 dark:text-gray-400">Loading guides...</div>
  }

  if (guides.length === 0) {
    return <div className="text-gray-500 dark:text-gray-400">No deployment guides available</div>
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        {guides.map((guide) => (
          <button
            key={guide.platform}
            onClick={() => setSelectedPlatform(guide.platform)}
            className={`flex-1 px-4 py-3 font-medium transition-colors ${
              selectedPlatform === guide.platform
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            {platformIcons[guide.platform] || '📦'} {guide.platform}
          </button>
        ))}
      </div>

      {currentGuide && (
        <div className="p-6 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{currentGuide.title}</h3>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 mb-4">
            {currentGuide.content.split('\n').map((line, idx) => (
              <p key={idx} className="mb-2 text-sm leading-relaxed">
                {line}
              </p>
            ))}
          </div>
          {currentGuide.url && (
            <a
              href={currentGuide.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              → View Full Guide
            </a>
          )}
        </div>
      )}
    </div>
  )
}
