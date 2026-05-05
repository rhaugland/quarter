import { getServiceClient } from './supabase-server'
import { calculateStreakUpdate, type StreakData } from './streaks'

interface SubmitScoreInput {
  playerId: string
  dayNumber: number
  score: number
  roundReached: number
  status: 'dead' | 'victory'
  themeName: string
}

export async function submitScore(input: SubmitScoreInput): Promise<StreakData | null> {
  const { playerId, dayNumber, score, roundReached, status, themeName } = input
  const supabase = getServiceClient()

  // Insert/update score
  const { error: scoreError } = await supabase
    .from('scores')
    .upsert({
      player_id: playerId,
      day_number: dayNumber,
      score,
      round_reached: roundReached,
      status,
    }, { onConflict: 'player_id,day_number' })

  if (scoreError) {
    console.error('Failed to submit score:', scoreError)
    return null
  }

  // Get current streak data
  const { data: streakRow } = await supabase
    .from('streaks')
    .select('current_streak, longest_streak, last_played_day, total_days_played, total_deaths, total_victories, best_score, best_score_day, best_score_theme')
    .eq('player_id', playerId)
    .single()

  const currentStreak: StreakData = streakRow ? {
    currentStreak: streakRow.current_streak,
    longestStreak: streakRow.longest_streak,
    lastPlayedDay: streakRow.last_played_day,
    totalDaysPlayed: streakRow.total_days_played,
    totalDeaths: streakRow.total_deaths,
    totalVictories: streakRow.total_victories,
    bestScore: streakRow.best_score,
    bestScoreDay: streakRow.best_score_day,
    bestScoreTheme: streakRow.best_score_theme,
  } : {
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedDay: 0,
    totalDaysPlayed: 0,
    totalDeaths: 0,
    totalVictories: 0,
    bestScore: 0,
    bestScoreDay: null,
    bestScoreTheme: null,
  }

  // Calculate new streak
  const updated = calculateStreakUpdate(currentStreak, { dayNumber, score, status, themeName })

  // Persist updated streak
  await supabase
    .from('streaks')
    .upsert({
      player_id: playerId,
      current_streak: updated.currentStreak,
      longest_streak: updated.longestStreak,
      last_played_day: updated.lastPlayedDay,
      total_days_played: updated.totalDaysPlayed,
      total_deaths: updated.totalDeaths,
      total_victories: updated.totalVictories,
      best_score: updated.bestScore,
      best_score_day: updated.bestScoreDay,
      best_score_theme: updated.bestScoreTheme,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'player_id' })

  return updated
}
