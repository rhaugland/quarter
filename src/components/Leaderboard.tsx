'use client'

import { useEffect, useState } from 'react'
import { getBrowserClient } from '@/lib/supabase-browser'

interface LeaderboardEntry {
  rank: number
  score: number
  roundReached: number
  status: string
  playerName: string
}

interface LeaderboardProps {
  dayNumber: number
  currentPlayerId?: string
}

export function Leaderboard({ dayNumber, currentPlayerId }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [playerRank, setPlayerRank] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      const supabase = getBrowserClient()
      const { data, error } = await supabase
        .from('scores')
        .select('score, round_reached, status, player_id, players(display_name, device_id)')
        .eq('day_number', dayNumber)
        .order('score', { ascending: false })
        .limit(100)

      if (error || !data) {
        setLoading(false)
        return
      }

      const mapped = data.map((row: any, index: number) => {
        const entry: LeaderboardEntry = {
          rank: index + 1,
          score: row.score,
          roundReached: row.round_reached,
          status: row.status,
          playerName: row.players?.display_name ?? `Player ${row.player_id.slice(0, 6)}`,
        }
        if (row.player_id === currentPlayerId) {
          setPlayerRank(index + 1)
        }
        return entry
      })

      setEntries(mapped)
      setLoading(false)
    }

    fetchLeaderboard()
  }, [dayNumber, currentPlayerId])

  if (loading) {
    return <div className="text-green-400/60 font-mono text-sm animate-pulse">LOADING SCORES...</div>
  }

  if (entries.length === 0) {
    return <div className="text-green-400/40 font-mono text-sm">NO SCORES YET. BE THE FIRST.</div>
  }

  return (
    <div className="w-full max-w-md">
      {playerRank && (
        <div className="text-center text-green-400 font-mono text-sm mb-3">
          YOUR RANK: #{playerRank}
        </div>
      )}
      <div className="space-y-1">
        {entries.slice(0, 20).map((entry) => (
          <div
            key={entry.rank}
            className={`flex justify-between font-mono text-sm px-2 py-1 ${
              entry.rank <= 3 ? 'text-yellow-400' : 'text-green-300/80'
            }`}
          >
            <span>
              {entry.rank <= 3 ? ['👑', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}{' '}
              {entry.playerName}
            </span>
            <span>
              {entry.status === 'victory' ? '✓' : `R${entry.roundReached}`} {entry.score.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
