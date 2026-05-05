import { describe, it, expect } from 'vitest'
import { calculateStreakUpdate, getRankTitle } from '@/lib/streaks'

describe('streaks', () => {
  describe('calculateStreakUpdate', () => {
    it('starts a new streak on first play', () => {
      const result = calculateStreakUpdate({
        currentStreak: 0,
        longestStreak: 0,
        lastPlayedDay: 0,
        totalDaysPlayed: 0,
        totalDeaths: 0,
        totalVictories: 0,
        bestScore: 0,
        bestScoreDay: null,
        bestScoreTheme: null,
      }, { dayNumber: 100, score: 1500, status: 'dead', themeName: 'Test' })

      expect(result.currentStreak).toBe(1)
      expect(result.longestStreak).toBe(1)
      expect(result.lastPlayedDay).toBe(100)
      expect(result.totalDaysPlayed).toBe(1)
      expect(result.totalDeaths).toBe(1)
      expect(result.bestScore).toBe(1500)
    })

    it('continues streak on consecutive day', () => {
      const result = calculateStreakUpdate({
        currentStreak: 5,
        longestStreak: 10,
        lastPlayedDay: 99,
        totalDaysPlayed: 20,
        totalDeaths: 15,
        totalVictories: 5,
        bestScore: 3000,
        bestScoreDay: 50,
        bestScoreTheme: 'Old Game',
      }, { dayNumber: 100, score: 2000, status: 'victory', themeName: 'New Game' })

      expect(result.currentStreak).toBe(6)
      expect(result.longestStreak).toBe(10)
      expect(result.totalDaysPlayed).toBe(21)
      expect(result.totalVictories).toBe(6)
    })

    it('breaks streak on missed day', () => {
      const result = calculateStreakUpdate({
        currentStreak: 5,
        longestStreak: 10,
        lastPlayedDay: 97,
        totalDaysPlayed: 20,
        totalDeaths: 15,
        totalVictories: 5,
        bestScore: 3000,
        bestScoreDay: 50,
        bestScoreTheme: 'Old Game',
      }, { dayNumber: 100, score: 1000, status: 'dead', themeName: 'New Game' })

      expect(result.currentStreak).toBe(1)
      expect(result.longestStreak).toBe(10)
    })

    it('updates best score when beaten', () => {
      const result = calculateStreakUpdate({
        currentStreak: 5,
        longestStreak: 10,
        lastPlayedDay: 99,
        totalDaysPlayed: 20,
        totalDeaths: 15,
        totalVictories: 5,
        bestScore: 3000,
        bestScoreDay: 50,
        bestScoreTheme: 'Old Game',
      }, { dayNumber: 100, score: 5000, status: 'victory', themeName: 'New Game' })

      expect(result.bestScore).toBe(5000)
      expect(result.bestScoreDay).toBe(100)
      expect(result.bestScoreTheme).toBe('New Game')
    })

    it('updates longest streak when current exceeds it', () => {
      const result = calculateStreakUpdate({
        currentStreak: 10,
        longestStreak: 10,
        lastPlayedDay: 99,
        totalDaysPlayed: 50,
        totalDeaths: 30,
        totalVictories: 20,
        bestScore: 3000,
        bestScoreDay: 50,
        bestScoreTheme: 'Old Game',
      }, { dayNumber: 100, score: 1000, status: 'dead', themeName: 'New Game' })

      expect(result.currentStreak).toBe(11)
      expect(result.longestStreak).toBe(11)
    })

    it('does not double-count same day', () => {
      const result = calculateStreakUpdate({
        currentStreak: 5,
        longestStreak: 10,
        lastPlayedDay: 100,
        totalDaysPlayed: 20,
        totalDeaths: 15,
        totalVictories: 5,
        bestScore: 3000,
        bestScoreDay: 50,
        bestScoreTheme: 'Old Game',
      }, { dayNumber: 100, score: 2000, status: 'dead', themeName: 'Same Day' })

      expect(result.currentStreak).toBe(5)
      expect(result.totalDaysPlayed).toBe(20)
    })
  })

  describe('getRankTitle', () => {
    it('returns Rookie for streak of 1', () => {
      expect(getRankTitle(1)).toBe('Rookie')
    })

    it('returns Regular for streak of 7', () => {
      expect(getRankTitle(7)).toBe('Regular')
    })

    it('returns Veteran for streak of 30', () => {
      expect(getRankTitle(30)).toBe('Veteran')
    })

    it('returns Cabinet Rat for streak of 60', () => {
      expect(getRankTitle(60)).toBe('Cabinet Rat')
    })

    it('returns Machine Lord for streak of 100', () => {
      expect(getRankTitle(100)).toBe('Machine Lord')
    })

    it('returns Quarter Legend for streak of 200', () => {
      expect(getRankTitle(200)).toBe('Quarter Legend')
    })

    it('returns The Operator for streak of 365', () => {
      expect(getRankTitle(365)).toBe('The Operator')
    })

    it('returns highest applicable title', () => {
      expect(getRankTitle(150)).toBe('Machine Lord')
    })
  })
})
