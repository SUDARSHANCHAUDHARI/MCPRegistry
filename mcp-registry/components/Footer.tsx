import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-8 mt-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-6">
          <div>
            <p className="font-bold text-gray-900 dark:text-white mb-2">🔌 MCP Registry</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Discover AI integrations instantly</p>
          </div>
          
          <div className="flex gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">Registry</h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/" className="hover:text-gray-900 dark:hover:text-white">All Servers</Link></li>
                <li><Link href="/leaderboard" className="hover:text-gray-900 dark:hover:text-white">Leaderboard</Link></li>
                <li><Link href="/submit" className="hover:text-gray-900 dark:hover:text-white">Submit Server</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">Developer</h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="/api/servers" className="hover:text-gray-900 dark:hover:text-white">API Docs</a></li>
                <li><a href="https://github.com/sudarshan/mcp-registry" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white">GitHub</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
          <p>© 2025 MCP Registry — Open Source</p>
          <p>Built for the AI community 💛</p>
        </div>
      </div>
    </footer>
  )
}
