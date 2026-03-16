'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
