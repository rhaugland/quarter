import { describe, it, expect } from 'vitest'
import { calculateRoundScore, calculateTotalScore } from '@/engine/scoring'
import type { ScoringConfig } from '@/engine/types'

describe('scoring', () => {
  describe('calculateRoundScore', () => {
    it('calculates completion-time score with time bonus', () => {
      const scoring: ScoringConfig = {
        type: 'completion-time',
        bonusPerRound: 1000,
        timeBonusPerSecond: 50,
      }
      const score = calculateRoundScore(scoring, { timeRemaining: 10, completed: true })
      expect(score).toBe(1500)
    })

    it('returns zero for incomplete round (death)', () => {
      const scoring: ScoringConfig = {
        type: 'completion-time',
        bonusPerRound: 1000,
        timeBonusPerSecond: 50,
      }
      const score = calculateRoundScore(scoring, { timeRemaining: 15, completed: false })
      expect(score).toBe(0)
    })

    it('calculates survival-time score', () => {
      const scoring: ScoringConfig = {
        type: 'survival-time',
        bonusPerRound: 500,
        timeBonusPerSecond: 100,
      }
      const score = calculateRoundScore(scoring, { timeSurvived: 20, completed: false })
      expect(score).toBe(2000)
    })

    it('calculates survival-time score with completion bonus', () => {
      const scoring: ScoringConfig = {
        type: 'survival-time',
        bonusPerRound: 500,
        timeBonusPerSecond: 100,
      }
      const score = calculateRoundScore(scoring, { timeSurvived: 30, completed: true })
      expect(score).toBe(3500)
    })
  })

  describe('calculateTotalScore', () => {
    it('sums all round scores', () => {
      const total = calculateTotalScore([1500, 1200, 800])
      expect(total).toBe(3500)
    })

    it('handles partial completion (died in round 2)', () => {
      const total = calculateTotalScore([1500, 0])
      expect(total).toBe(1500)
    })
  })
})
