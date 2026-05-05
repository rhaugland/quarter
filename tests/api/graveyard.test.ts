import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitGraveyardMessage, getGraveyardMessages } from '@/lib/graveyard-service'

const mockInsert = vi.fn(() => ({ error: null }))
const mockData = [
  { id: 1, message: 'died to the ceiling fan', round_reached: 2, players: { display_name: null, device_id: 'abc' }, created_at: '2026-05-05T00:00:00Z' },
  { id: 2, message: 'round 3 is ILLEGAL', round_reached: 3, players: { display_name: null, device_id: 'def' }, created_at: '2026-05-05T00:01:00Z' },
]

vi.mock('@/lib/supabase-server', () => ({
  getServiceClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: mockInsert,
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({ data: mockData, error: null })),
          })),
        })),
      })),
    })),
  })),
}))

describe('graveyard-service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('submits a graveyard message', async () => {
    const result = await submitGraveyardMessage({
      playerId: 'player-123',
      dayNumber: 47,
      message: 'died to the ceiling fan',
      roundReached: 2,
    })
    expect(result).toBe(true)
  })

  it('rejects messages over 100 characters', async () => {
    const result = await submitGraveyardMessage({
      playerId: 'player-123',
      dayNumber: 47,
      message: 'a'.repeat(101),
      roundReached: 2,
    })
    expect(result).toBe(false)
  })

  it('fetches graveyard messages for a day', async () => {
    const messages = await getGraveyardMessages(47)
    expect(messages).toHaveLength(2)
    expect(messages[0].message).toBe('died to the ceiling fan')
  })
})
