'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SearchBar() {
  const router = useRouter()
  const [search, setSearch] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/?search=${encodeURIComponent(search)}`)
    } else {
      router.push('/')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search MCP servers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
        >
          🔍
        </button>
      </div>
    </form>
  )
}
