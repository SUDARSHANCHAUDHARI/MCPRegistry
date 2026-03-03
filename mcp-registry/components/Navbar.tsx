'use client'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import ThemeToggle from '@/components/ThemeToggle'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
  }, [])

  async function loginWithGitHub() {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-50">
      <Link href="/" className="font-bold text-blue-600 dark:text-blue-400 text-lg">
        🔌 MCP Registry
      </Link>
      <div className="flex gap-3 items-center">
        <Link href="/leaderboard" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          🏆 Leaderboard
        </Link>
        <Link href="/compare" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          ⚖️ Compare
        </Link>
        <Link href="/collections" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          📚 Collections
        </Link>
        <Link
          href="/submit"
          className="text-sm border border-gray-300 dark:border-gray-600 px-3 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          + Submit
        </Link>
        {user && (
          <>
            <Link
              href="/dashboard"
              className="text-sm border border-gray-300 dark:border-gray-600 px-3 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/admin/moderation"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              🛡️ Moderation
            </Link>
          </>
        )}
        <ThemeToggle />
        {!loading && !user ? (
          <button
            onClick={loginWithGitHub}
            className="text-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-1 rounded hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            Login
          </button>
        ) : (
          user && (
            <button
              onClick={logout}
              className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          )
        )}
      </div>
    </nav>
  )
}
