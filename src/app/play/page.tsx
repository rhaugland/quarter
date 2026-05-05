'use client'

import { useState, useEffect } from 'react'
import { GameCanvas } from '@/components/GameCanvas'
import { generateScoreCard } from '@/lib/share'
import type { GameConfig } from '@/engine/types'

export default function PlayPage() {
  const [config, setConfig] = useState<GameConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gameResult, setGameResult] = useState<{ score: number; round: number; status: 'dead' | 'victory' } | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function loadGame() {
      try {
        const res = await fetch('/api/generate', { method: 'POST' })
        if (!res.ok) throw new Error('Failed to generate game')
        const data = await res.json()
        setConfig(data.config)
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    }
    loadGame()
  }, [])

  const handleShare = async () => {
    if (!config || !gameResult) return
    const card = generateScoreCard({
      dayNumber: config.dayNumber,
      themeName: config.theme.name,
      roundReached: gameResult.round,
      score: gameResult.score,
      status: gameResult.status,
    })
    try {
      await navigator.clipboard.writeText(card)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400 font-mono text-2xl animate-pulse">
          GENERATING TODAY&apos;S MACHINE...
        </div>
      </div>
    )
  }

  if (error || !config) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 font-mono text-xl">
          MACHINE BROKEN: {error ?? 'Unknown error'}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 p-4">
      <div className="text-center">
        <h1 className="text-green-400 font-mono text-3xl font-bold tracking-wider">QUARTER</h1>
        <p className="text-green-300/60 font-mono text-sm mt-1">#{config.dayNumber} — {config.theme.name}</p>
      </div>

      <GameCanvas
        config={config}
        onGameEnd={(score, round, status) => setGameResult({ score, round, status })}
      />

      {gameResult && (
        <div className="text-center font-mono space-y-3">
          <p className="text-white text-xl">
            {gameResult.status === 'victory' ? '🏆 MACHINE CLEARED' : `💀 DIED IN ROUND ${gameResult.round}`}
          </p>
          <p className="text-green-400 text-3xl font-bold">{gameResult.score.toLocaleString()}</p>
          <button
            onClick={handleShare}
            className="border border-green-500 text-green-400 font-mono px-6 py-2
                       hover:bg-green-500/10 transition-colors"
          >
            {copied ? 'COPIED!' : 'SHARE SCORE'}
          </button>
        </div>
      )}

      <div className="text-green-300/40 font-mono text-xs">
        ARROWS/WASD to move · SPACE to jump
      </div>
    </div>
  )
}
