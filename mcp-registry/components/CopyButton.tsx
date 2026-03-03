'use client'

import { useState } from 'react'

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
    >
      {copied ? '✓ Copied!' : 'Copy'}
    </button>
  )
}
