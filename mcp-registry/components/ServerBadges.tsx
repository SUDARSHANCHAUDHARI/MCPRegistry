interface ServerBadgesProps {
  badges?: Array<{
    badge_type: string
    reason?: string
  }>
}

export function ServerBadges({ badges = [] }: ServerBadgesProps) {
  const badgeConfig: Record<string, { icon: string; color: string; label: string }> = {
    verified: { icon: '✓', color: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200', label: 'Verified' },
    trending: { icon: '🔥', color: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200', label: 'Trending' },
    popular: { icon: '⭐', color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200', label: 'Popular' },
    new: { icon: '✨', color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200', label: 'New' },
    featured: { icon: '🏆', color: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200', label: 'Featured' },
    maintaining: {
      icon: '🔧',
      color: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200',
      label: 'Maintaining',
    },
    archived: { icon: '📦', color: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200', label: 'Archived' },
  }

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, idx) => {
        const config = badgeConfig[badge.badge_type] || { icon: '🏷️', color: 'bg-gray-100', label: badge.badge_type }
        return (
          <span key={idx} className={`px-2 py-1 rounded text-xs font-medium ${config.color}`} title={badge.reason}>
            {config.icon} {config.label}
          </span>
        )
      })}
    </div>
  )
}
