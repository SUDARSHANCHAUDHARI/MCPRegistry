'use client'

import { useTheme } from '@/lib/theme-provider'

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      title="Toggle dark mode"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
