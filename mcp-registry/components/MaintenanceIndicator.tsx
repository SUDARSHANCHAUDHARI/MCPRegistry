interface MaintenanceIndicatorProps {
  status?: string
  lastUpdate?: string
}

export function MaintenanceIndicator({ status = 'active', lastUpdate }: MaintenanceIndicatorProps) {
  const statusConfig: Record<string, { icon: string; color: string; label: string }> = {
    active: {
      icon: '✅',
      color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
      label: 'Actively Maintained',
    },
    maintaining: {
      icon: '🔧',
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
      label: 'Maintaining',
    },
    stale: { icon: '⚠️', color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20', label: 'Stale' },
    archived: {
      icon: '📦',
      color: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20',
      label: 'Archived',
    },
  }

  const config = statusConfig[status] || statusConfig.active

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm ${config.color}`}>
      <span className="text-lg">{config.icon}</span>
      <div>
        <div>{config.label}</div>
        {lastUpdate && <div className="text-xs opacity-75">Updated {lastUpdate}</div>}
      </div>
    </div>
  )
}
