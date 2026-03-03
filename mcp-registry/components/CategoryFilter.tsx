'use client'

import { useRouter } from 'next/navigation'

export default function CategoryFilter({
  categories,
  selectedCategory,
}: {
  categories: string[]
  selectedCategory?: string
}) {
  const router = useRouter()

  function handleSelect(category: string | null) {
    if (category) {
      router.push(`/?category=${encodeURIComponent(category)}`)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 max-w-5xl mx-auto">
      <button
        onClick={() => handleSelect(null)}
        className={`px-3 py-1 rounded-full whitespace-nowrap transition text-sm ${
          !selectedCategory
            ? 'bg-purple-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => handleSelect(cat)}
          className={`px-3 py-1 rounded-full whitespace-nowrap transition text-sm ${
            selectedCategory === cat
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
