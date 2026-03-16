import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-6xl font-bold text-gray-200 dark:text-gray-700">404</h1>
      <h2 className="text-2xl font-bold">Page not found</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        Back to registry
      </Link>
    </div>
  )
}
