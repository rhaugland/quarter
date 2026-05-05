'use client'

import { useState } from 'react'

interface GraveyardInputProps {
  onSubmit: (message: string) => Promise<void>
}

export function GraveyardInput({ onSubmit }: GraveyardInputProps) {
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!message.trim() || message.length > 100) return
    await onSubmit(message.trim())
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-pink-400/60 font-mono text-sm">
        💀 &quot;{message}&quot; — carved into the cabinet
      </div>
    )
  }

  return (
    <div className="flex gap-2 w-full max-w-md">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value.slice(0, 100))}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="leave your last words..."
        className="flex-1 bg-black border border-pink-500/50 text-pink-400 font-mono text-sm
                   px-3 py-2 placeholder:text-pink-400/30 focus:outline-none focus:border-pink-400"
      />
      <button
        onClick={handleSubmit}
        disabled={!message.trim()}
        className="border border-pink-500/50 text-pink-400 font-mono text-sm px-4 py-2
                   hover:bg-pink-500/10 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        CARVE
      </button>
    </div>
  )
}
