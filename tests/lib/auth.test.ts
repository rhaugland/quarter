import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getOrCreateDeviceId, getOrCreatePlayer } from '@/lib/auth'

// Mock supabase
vi.mock('@/lib/supabase-server', () => ({
  getServiceClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({ data: { id: 'player-123', device_id: 'device-abc', display_name: null }, error: null })),
        })),
      })),
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({ data: { id: 'player-456', device_id: 'device-new', display_name: null }, error: null })),
        })),
      })),
    })),
  })),
}))

describe('auth', () => {
  describe('getOrCreateDeviceId', () => {
    it('generates a UUID-format device ID', () => {
      const id = getOrCreateDeviceId()
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })
  })

  describe('getOrCreatePlayer', () => {
    it('returns a player object with id and device_id', async () => {
      const player = await getOrCreatePlayer('device-abc')
      expect(player).toBeDefined()
      expect(player!.id).toBe('player-123')
      expect(player!.device_id).toBe('device-abc')
    })
  })
})
