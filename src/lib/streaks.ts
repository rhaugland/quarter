export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastPlayedDay: number
  totalDaysPlayed: number
  totalDeaths: number
  totalVictories: number
  bestScore: number
  bestScoreDay: number | null
  bestScoreTheme: string | null
}

interface PlayInput {
  dayNumber: number
  score: number
  status: 'dead' | 'victory'
  themeName: string
}

export function calculateStreakUpdate(current: StreakData, play: PlayInput): StreakData {
  const { dayNumber, score, status, themeName } = play
  const result = { ...current }

  // Don't double-count same day
  if (dayNumber === current.lastPlayedDay) {
    if (score > result.bestScore) {
      result.bestScore = score
      result.bestScoreDay = dayNumber
      result.bestScoreTheme = themeName
    }
    return result
  }

  // Update streak
  if (current.lastPlayedDay === dayNumber - 1) {
    result.currentStreak = current.currentStreak + 1
  } else {
    result.currentStreak = 1
  }

  // Update longest
  if (result.currentStreak > result.longestStreak) {
    result.longestStreak = result.currentStreak
  }

  // Update stats
  result.lastPlayedDay = dayNumber
  result.totalDaysPlayed = current.totalDaysPlayed + 1
  if (status === 'dead') result.totalDeaths = current.totalDeaths + 1
  if (status === 'victory') result.totalVictories = current.totalVictories + 1

  // Update best score
  if (score > result.bestScore) {
    result.bestScore = score
    result.bestScoreDay = dayNumber
    result.bestScoreTheme = themeName
  }

  return result
}

const RANK_TITLES: [number, string][] = [
  [365, 'The Operator'],
  [200, 'Quarter Legend'],
  [100, 'Machine Lord'],
  [60, 'Cabinet Rat'],
  [30, 'Veteran'],
  [7, 'Regular'],
  [1, 'Rookie'],
]

export function getRankTitle(streak: number): string {
  for (const [threshold, title] of RANK_TITLES) {
    if (streak >= threshold) return title
  }
  return 'Rookie'
}
