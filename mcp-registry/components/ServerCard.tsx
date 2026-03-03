import Link from 'next/link'
import { McpServer } from '@/types'

export default function ServerCard({ server }: { server: McpServer }) {
  return (
    <Link href={`/servers/${server.id}`}>
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer h-full">
        <div className="flex justify-between items-start mb-2">
          <h2 className="font-semibold text-lg text-gray-900 flex-1">{server.name}</h2>
          {server.verified && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
              ✓ Verified
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">{server.description}</p>
        <div className="flex gap-2 mt-3 flex-wrap">
          {server.category.slice(0, 3).map(cat => (
            <span key={cat} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
              {cat}
            </span>
          ))}
          {server.category.length > 3 && (
            <span className="text-gray-500 text-xs">+{server.category.length - 3}</span>
          )}
        </div>
        <p className="text-gray-400 text-xs mt-3">⭐ {server.github_stars} stars</p>
      </div>
    </Link>
  )
}
