import { getAllServers, getCategories, getServerCount } from '@/lib/db'
import { getTrendingServers } from '@/lib/db-extended'
import ServerCard from '@/components/ServerCard'
import SearchBar from '@/components/SearchBar'
import CategoryFilter from '@/components/CategoryFilter'
import EmptyState from '@/components/EmptyState'
import Pagination from '@/components/Pagination'
import { SearchParams } from '@/types'

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const search = searchParams.search
  const category = searchParams.category
  const trending = searchParams.trending === 'true'
  const page = parseInt(searchParams.page || '1', 10)

  let servers, total
  
  if (trending) {
    // Get trending servers (no pagination for trending)
    const trendingServers = await getTrendingServers()
    servers = trendingServers.slice((page - 1) * 12, page * 12)
    total = trendingServers.length
  } else {
    const result = await getAllServers(search, category, page)
    servers = result.servers
    total = result.total
  }

  const allCategories = await getCategories()
  const totalCount = await getServerCount()
  const totalPages = Math.ceil(total / 12)

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">MCP Registry</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Discover AI integrations instantly</p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
          <strong>{totalCount}</strong> servers available
        </p>
      </div>

      <SearchBar />

      <div className="mt-8 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <CategoryFilter categories={allCategories} selectedCategory={category} />
        
        <div className="flex gap-2">
          <a
            href={trending ? '/' : '/?trending=true'}
            className={`text-sm font-medium px-3 py-1 rounded transition ${
              trending
                ? 'bg-blue-600 dark:bg-blue-700 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {trending ? '🔥 Trending' : '⭐ Trending'}
          </a>
          <a
            href={trending ? '/' : '/'}
            className={`text-sm font-medium px-3 py-1 rounded transition ${
              !trending
                ? 'bg-blue-600 dark:bg-blue-700 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            📋 All
          </a>
        </div>
      </div>

      {servers.length > 0 ? (
        <>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            Showing {(page - 1) * 12 + 1} to {Math.min(page * 12, total)} of {total} {trending ? 'trending' : ''} results
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {servers.map(server => (
              <ServerCard key={server.id} server={server} />
            ))}
          </div>
          {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} />}
        </>
      ) : (
        <EmptyState
          title="No servers found"
          description={search ? `No servers match "${search}"` : trending ? 'No trending servers yet' : 'No servers yet'}
          action={{ label: '+ Submit Server', href: '/submit' }}
        />
      )}
    </main>
  )
}
