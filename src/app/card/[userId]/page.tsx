import { getServiceClient } from '@/lib/supabase-server'
import { ArcadeCard } from '@/components/ArcadeCard'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ userId: string }>
}

export default async function CardPage({ params }: PageProps) {
  const { userId } = await params
  const supabase = getServiceClient()

  const { data: player } = await supabase
    .from('players')
    .select('id, display_name, device_id')
    .eq('id', userId)
    .single()

  if (!player) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 font-mono">PLAYER NOT FOUND</div>
      </div>
    )
  }

  const { data: streak } = await supabase
    .from('streaks')
    .select('*')
    .eq('player_id', userId)
    .single()

  const playerName = player.display_name ?? `Player ${player.device_id.slice(0, 6)}`

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 p-4">
      <ArcadeCard
        playerName={playerName}
        currentStreak={streak?.current_streak ?? 0}
        longestStreak={streak?.longest_streak ?? 0}
        totalDaysPlayed={streak?.total_days_played ?? 0}
        totalDeaths={streak?.total_deaths ?? 0}
        totalVictories={streak?.total_victories ?? 0}
        bestScore={streak?.best_score ?? 0}
        bestScoreTheme={streak?.best_score_theme ?? null}
      />

      <Link
        href="/"
        className="text-pink-400/60 font-mono text-sm hover:text-pink-400"
      >
        ← BACK TO QUARTER
      </Link>
    </div>
  )
}
