import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitScore } from '@/lib/score-service'

vi.mock('@/lib/supabase-server', () => ({
  getServiceClient: vi.fn(() => ({
    from: vi.fn((table: string) => {
      if (table === 'scores') {
        return {
          upsert: vi.fn(() => ({ error: null })),
        }
      }
      if (table === 'streaks') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => ({
                data: {
                  current_streak: 5,
                  longest_streak: 10,
                  last_played_day: 99,
                  total_days_played: 20,
                  total_deaths: 15,
                  total_victories: 5,
                  best_score: 3000,
                  best_score_day: 50,
                  best_score_theme: 'Old Game',
                },
                error: null,
              })),
            })),
          })),
          upsert: vi.fn(() => ({ error: null })),
        }
      }
      return { upsert: vi.fn(() => ({ error: null })), select: vi.fn(() => ({ eq: vi.fn(() => ({ single: vi.fn(() => ({ data: null, error: null })) })) })) }
    }),
  })),
}))

describe('submitScore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns updated streak data after submission', async () => {
    const result = await submitScore({
      playerId: 'player-123',
      dayNumber: 100,
      score: 2500,
      roundReached: 3,
      status: 'victory',
      themeName: 'Test Game',
    })

    expect(result).toBeDefined()
    expect(result!.currentStreak).toBe(6)
    expect(result!.totalVictories).toBe(6)
  })
})
