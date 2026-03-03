import { getLeaderboard } from '@/lib/db-extended'
import Link from 'next/link'

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard()

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">🏆 Leaderboard</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Top MCP server creators</p>

      {leaderboard.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No creators yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((creator, index) => (
            <div
              key={creator.github_username}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 dark:bg-gray-900 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                {creator.avatar_url && (
                  <img
                    src={creator.avatar_url}
                    alt={creator.github_username}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {creator.github_username}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {creator.server_count} {creator.server_count === 1 ? 'server' : 'servers'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
