'use client'

import { getRankTitle } from '@/lib/streaks'

interface ArcadeCardProps {
  playerName: string
  currentStreak: number
  longestStreak: number
  totalDaysPlayed: number
  totalDeaths: number
  totalVictories: number
  bestScore: number
  bestScoreTheme: string | null
}

export function ArcadeCard({
  playerName,
  currentStreak,
  longestStreak,
  totalDaysPlayed,
  totalDeaths,
  totalVictories,
  bestScore,
  bestScoreTheme,
}: ArcadeCardProps) {
  const title = getRankTitle(currentStreak)

  return (
    <div className="border-2 border-green-500 bg-black p-6 font-mono max-w-sm w-full
                    shadow-[0_0_20px_rgba(0,255,136,0.2)]">
      <div className="text-center border-b border-green-500/30 pb-3 mb-4">
        <div className="text-green-400 text-xs tracking-widest">QUARTER</div>
        <div className="text-white text-xl font-bold mt-1">{playerName}</div>
        <div className="text-yellow-400 text-sm mt-1">{title}</div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-green-400/60">Streak</span>
          <span className="text-green-400">{currentStreak} days 🔥</span>
        </div>
        <div className="flex justify-between">
          <span className="text-green-400/60">Best Streak</span>
          <span className="text-green-400">{longestStreak} days</span>
        </div>
        <div className="flex justify-between">
          <span className="text-green-400/60">Quarters Spent</span>
          <span className="text-green-400">{totalDaysPlayed}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-green-400/60">Deaths</span>
          <span className="text-red-400">{totalDeaths}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-green-400/60">Victories</span>
          <span className="text-yellow-400">{totalVictories}</span>
        </div>

        {bestScore > 0 && (
          <>
            <div className="border-t border-green-500/20 my-2" />
            <div className="flex justify-between">
              <span className="text-green-400/60">Best Score</span>
              <span className="text-white font-bold">{bestScore.toLocaleString()}</span>
            </div>
            {bestScoreTheme && (
              <div className="text-green-400/40 text-xs text-right">{bestScoreTheme}</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
