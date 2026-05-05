'use client'

import { useEffect, useState } from 'react'

interface MobileControlsProps {
  onInput: (key: string, type: 'down' | 'up') => void
}

export function MobileControls({ onInput }: MobileControlsProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  if (!isMobile) return null

  const handleTouchStart = (key: string) => (e: React.TouchEvent) => {
    e.preventDefault()
    onInput(key, 'down')
  }

  const handleTouchEnd = (key: string) => (e: React.TouchEvent) => {
    e.preventDefault()
    onInput(key, 'up')
  }

  return (
    <div className="flex justify-center gap-4 mt-4 select-none">
      {/* Left/Right controls */}
      <div className="flex gap-2">
        <button
          className="touch-btn w-16 h-16 border-2 border-green-500/60 rounded-lg
                     flex items-center justify-center text-green-400 text-2xl font-mono"
          onTouchStart={handleTouchStart('ArrowLeft')}
          onTouchEnd={handleTouchEnd('ArrowLeft')}
        >
          ←
        </button>
        <button
          className="touch-btn w-16 h-16 border-2 border-green-500/60 rounded-lg
                     flex items-center justify-center text-green-400 text-2xl font-mono"
          onTouchStart={handleTouchStart('ArrowRight')}
          onTouchEnd={handleTouchEnd('ArrowRight')}
        >
          →
        </button>
      </div>

      {/* Jump button */}
      <button
        className="touch-btn w-24 h-16 border-2 border-green-500/60 rounded-lg
                   flex items-center justify-center text-green-400 text-sm font-mono ml-4"
        onTouchStart={handleTouchStart(' ')}
        onTouchEnd={handleTouchEnd(' ')}
      >
        JUMP
      </button>
    </div>
  )
}
