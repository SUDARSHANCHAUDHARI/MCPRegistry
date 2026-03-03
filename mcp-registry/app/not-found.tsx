import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-8xl mb-6">🔌</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-3">Page Not Found</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        This MCP server or page doesn't exist yet. Maybe it's waiting to be submitted!
      </p>
      <Link
        href="/"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Back to Registry
      </Link>
    </main>
  )
}
