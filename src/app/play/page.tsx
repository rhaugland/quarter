'use client'

import { useState, useEffect, useCallback } from 'react'
import { GameCanvas } from '@/components/GameCanvas'
import { GraveyardInput } from '@/components/GraveyardInput'
import { Leaderboard } from '@/components/Leaderboard'
import { Graveyard } from '@/components/Graveyard'
import { generateScoreCard } from '@/lib/share'
import { getOrCreateDeviceId } from '@/lib/auth'
import type { GameConfig } from '@/engine/types'

export default function PlayPage() {
  const [config, setConfig] = useState<GameConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gameResult, setGameResult] = useState<{ score: number; round: number; status: 'dead' | 'victory' } | null>(null)
  const [streakInfo, setStreakInfo] = useState<{ currentStreak: number; title: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [deviceId, setDeviceId] = useState<string>('')

  useEffect(() => {
    setDeviceId(getOrCreateDeviceId())
  }, [])

  useEffect(() => {
    async function loadGame() {
      try {
        const res = await fetch('/api/daily-game')
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

  const handleGameEnd = useCallback(async (score: number, round: number, status: 'dead' | 'victory') => {
    setGameResult({ score, round, status })

    if (deviceId && config) {
      try {
        const res = await fetch('/api/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deviceId,
            dayNumber: config.dayNumber,
            score,
            roundReached: round,
            status,
            themeName: config.theme.name,
          }),
        })
        if (res.ok) {
          const data = await res.json()
          setStreakInfo({ currentStreak: data.streak.currentStreak, title: data.title })
        }
      } catch {}
    }
  }, [deviceId, config])

  const handleGraveyardSubmit = async (message: string) => {
    if (!config || !deviceId) return
    await fetch('/api/graveyard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId,
        dayNumber: config.dayNumber,
        message,
        roundReached: gameResult?.round ?? 1,
      }),
    })
  }

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
    <div className="min-h-screen bg-black flex flex-col items-center gap-6 p-4 py-8">
      <div className="text-center">
        <h1 className="text-green-400 font-mono text-3xl font-bold tracking-wider">QUARTER</h1>
        <p className="text-green-300/60 font-mono text-sm mt-1">#{config.dayNumber} — {config.theme.name}</p>
      </div>

      <GameCanvas config={config} onGameEnd={handleGameEnd} />

      {gameResult && (
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          <div className="text-center font-mono">
            <p className="text-white text-xl">
              {gameResult.status === 'victory' ? '🏆 MACHINE CLEARED' : `💀 DIED IN ROUND ${gameResult.round}`}
            </p>
            <p className="text-green-400 text-3xl font-bold mt-1">{gameResult.score.toLocaleString()}</p>
            {streakInfo && (
              <p className="text-yellow-400/80 text-sm mt-2">
                🔥 {streakInfo.currentStreak} day streak — {streakInfo.title}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="border border-green-500 text-green-400 font-mono text-sm px-6 py-2
                         hover:bg-green-500/10 transition-colors"
            >
              {copied ? 'COPIED!' : 'SHARE'}
            </button>
          </div>

          {gameResult.status === 'dead' && (
            <GraveyardInput onSubmit={handleGraveyardSubmit} />
          )}

          <div className="border-t border-green-500/20 w-full pt-4 mt-2">
            <Leaderboard dayNumber={config.dayNumber} />
          </div>

          <div className="border-t border-green-500/20 w-full pt-4">
            <Graveyard dayNumber={config.dayNumber} />
          </div>
        </div>
      )}

      <div className="text-green-300/40 font-mono text-xs">
        ARROWS/WASD to move · SPACE to jump
      </div>
    </div>
  )
}
