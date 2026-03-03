'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  async function loginWithGitHub() {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <main className="max-w-md mx-auto px-4 py-20">
      <div className="text-center">
        <div className="text-6xl mb-6">🔐</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in to MCP Registry</h1>
        <p className="text-gray-600 mb-8">
          Log in with your GitHub account to submit and manage MCP servers.
        </p>

        <button
          onClick={loginWithGitHub}
          className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
        >
          <span>🐙</span>
          Continue with GitHub
        </button>

        <p className="text-gray-500 text-sm mt-8">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700"
          >
            Back to Registry
          </button>
        </p>
      </div>
    </main>
  )
}
