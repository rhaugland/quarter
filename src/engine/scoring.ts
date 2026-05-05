import type { ScoringConfig } from './types'

interface CompletionTimeInput {
  timeRemaining: number
  completed: boolean
}

interface SurvivalTimeInput {
  timeSurvived: number
  completed: boolean
}

type RoundInput = CompletionTimeInput | SurvivalTimeInput

export function calculateRoundScore(scoring: ScoringConfig, input: RoundInput): number {
  switch (scoring.type) {
    case 'completion-time': {
      const { timeRemaining, completed } = input as CompletionTimeInput
      if (!completed) return 0
      return scoring.bonusPerRound + (timeRemaining * (scoring.timeBonusPerSecond ?? 0))
    }
    case 'survival-time': {
      const { timeSurvived, completed } = input as SurvivalTimeInput
      const timeScore = timeSurvived * (scoring.timeBonusPerSecond ?? 0)
      const bonus = completed ? scoring.bonusPerRound : 0
      return timeScore + bonus
    }
    case 'points-collected': {
      const { timeRemaining, completed } = input as CompletionTimeInput
      if (!completed) return 0
      return scoring.bonusPerRound + (timeRemaining * (scoring.timeBonusPerSecond ?? 0))
    }
    case 'distance': {
      const { timeSurvived } = input as SurvivalTimeInput
      return timeSurvived * (scoring.pointsPerDistance ?? 10)
    }
    default:
      return 0
  }
}

export function calculateTotalScore(roundScores: number[]): number {
  return roundScores.reduce((sum, score) => sum + score, 0)
}
