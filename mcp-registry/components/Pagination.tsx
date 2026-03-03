'use client'

import Link from 'next/link'

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {currentPage > 1 && (
        <Link
          href={`/?page=${currentPage - 1}`}
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
        >
          ← Previous
        </Link>
      )}
      {pages.map(page => (
        <Link
          key={page}
          href={`/?page=${page}`}
          className={`px-3 py-1 rounded ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={`/?page=${currentPage + 1}`}
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
        >
          Next →
        </Link>
      )}
    </div>
  )
}
