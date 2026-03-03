'use client'

import { submitRating, getServerRating } from '@/lib/db-extended'
import { useState, useEffect } from 'react'

export default function RatingComponent({ serverId }: { serverId: string }) {
  const [rating, setRating] = useState(0)
  const [avgRating, setAvgRating] = useState(0)
  const [count, setCount] = useState(0)
  const [review, setReview] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchRating()
    // Get current user
    import('@/lib/supabase').then(({ supabase }) => {
      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user)
      })
    })
  }, [serverId])

  async function fetchRating() {
    const { average, count: cnt } = await getServerRating(serverId)
    setAvgRating(average)
    setCount(cnt)
  }

  async function handleSubmit() {
    if (!user || rating === 0) return

    const { success } = await submitRating(serverId, user.id, rating, review)
    if (success) {
      setSubmitted(true)
      setRating(0)
      setReview('')
      fetchRating()
      setTimeout(() => setSubmitted(false), 2000)
    }
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">⭐ Community Rating</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{avgRating}</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">({count} ratings)</p>
        </div>

        {user && (
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your rating:</p>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  key={i}
                  onClick={() => setRating(i)}
                  className={`text-2xl ${rating >= i ? '⭐' : '☆'} cursor-pointer`}
                >
                  {i}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Share your thoughts (optional)"
              value={review}
              onChange={e => setReview(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-800 dark:text-white resize-none mb-2"
              rows={2}
              maxLength={200}
            />
            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {submitted ? '✓ Submitted!' : 'Submit Rating'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
