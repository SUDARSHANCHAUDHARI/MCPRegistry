'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { submitServer } from '@/lib/db'
import { validateSubmission } from '@/lib/validate'
import { useRouter } from 'next/navigation'

export default function SubmitPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    description: '',
    github_url: '',
    install_command: '',
    category: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [user, setUser] = useState<any>(null)

  const [charCount, setCharCount] = useState(0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    // Validate
    const { errors: validationErrors, isValid } = validateSubmission(form)
    if (!isValid) {
      setErrors(validationErrors)
      setLoading(false)
      return
    }

    // Get current user
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()
    if (!currentUser) {
      setErrors({ general: 'You must be logged in to submit a server' })
      setLoading(false)
      return
    }

    // Submit
    const { success, error } = await submitServer(form, currentUser.id)
    if (!success) {
      setErrors({ general: error || 'Failed to submit server' })
      setLoading(false)
      return
    }

    setSubmitted(true)
    setTimeout(() => router.push('/'), 3000)
  }

  if (submitted) {
    return (
      <main className="max-w-xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Server submitted!</h2>
          <p className="text-gray-600 mb-4">
            Your MCP server has been submitted for review. It will appear in the registry once approved.
          </p>
          <p className="text-sm text-gray-500">Redirecting to home page...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit an MCP Server</h1>
      <p className="text-gray-600 mb-8">
        Share your MCP server with the community. It will be reviewed and approved by our moderators.
      </p>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Server Name *
          </label>
          <input
            type="text"
            placeholder="e.g., postgres-mcp"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            maxLength={50}
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          <p className="text-xs text-gray-500 mt-1">{form.name.length} / 50</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Description *
          </label>
          <textarea
            placeholder="What does this MCP server do? (20-200 characters)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            value={form.description}
            onChange={e => {
              setForm({ ...form, description: e.target.value })
              setCharCount(e.target.value.length)
            }}
            maxLength={200}
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
          <p className="text-xs text-gray-500 mt-1">{charCount} / 200</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            GitHub URL *
          </label>
          <input
            type="url"
            placeholder="https://github.com/username/repo"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.github_url}
            onChange={e => setForm({ ...form, github_url: e.target.value })}
          />
          {errors.github_url && <p className="text-red-600 text-sm mt-1">{errors.github_url}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Install Command *
          </label>
          <input
            type="text"
            placeholder="e.g., npx postgres-mcp"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.install_command}
            onChange={e => setForm({ ...form, install_command: e.target.value })}
          />
          {errors.install_command && (
            <p className="text-red-600 text-sm mt-1">{errors.install_command}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Categories
          </label>
          <input
            type="text"
            placeholder="database, api, filesystem (comma separated)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          />
          <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Server'}
        </button>
      </form>
    </main>
  )
}
