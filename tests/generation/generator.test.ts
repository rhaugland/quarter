import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateDailyGame } from '@/generation/generator'

// Mock the Claude client
vi.mock('@/lib/claude', () => ({
  callClaude: vi.fn(),
}))

import { callClaude } from '@/lib/claude'
const mockCallClaude = vi.mocked(callClaude)

describe('generateDailyGame', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns a valid GameConfig on success', async () => {
    mockCallClaude.mockResolvedValue(JSON.stringify({
      theme: {
        name: 'Haunted Skateboard',
        backgroundColor: '#0a0a1a',
        entityColors: { player: '#00ffcc', enemy: '#ff4444', platform: '#333366' },
        description: 'A skateboard possessed by ghosts',
      },
      physics: { gravity: 0.8, friction: 0.9, playerSpeed: 5, jumpForce: -12 },
      player: { width: 32, height: 32, startX: 50, startY: 348 },
      rounds: [
        { roundNumber: 1, duration: 30, entities: [{ type: 'platform', x: 0, y: 380, width: 800, height: 20 }], goalX: 750, escalation: {} },
        { roundNumber: 2, duration: 25, entities: [{ type: 'platform', x: 0, y: 380, width: 800, height: 20 }, { type: 'enemy', x: 400, y: 355, width: 24, height: 24, behavior: 'patrol', speed: 2 }], goalX: 750, escalation: { gravityMultiplier: 1.2, speedMultiplier: 1.2 } },
        { roundNumber: 3, duration: 20, entities: [{ type: 'platform', x: 0, y: 380, width: 800, height: 20 }, { type: 'enemy', x: 300, y: 355, width: 24, height: 24, behavior: 'chase', speed: 3 }, { type: 'enemy', x: 600, y: 355, width: 24, height: 24, behavior: 'chase', speed: 4 }], goalX: 750, escalation: { gravityMultiplier: 1.5, speedMultiplier: 1.5 } },
      ],
    }))

    const result = await generateDailyGame('platformer', 47)
    expect(result.success).toBe(true)
    expect(result.config).toBeDefined()
    expect(result.config!.theme.name).toBe('Haunted Skateboard')
    expect(result.config!.id).toBe('quarter-47')
    expect(result.config!.dayNumber).toBe(47)
  })

  it('returns errors on invalid AI output', async () => {
    mockCallClaude.mockResolvedValue('this is not json at all')

    const result = await generateDailyGame('platformer', 48)
    expect(result.success).toBe(false)
    expect(result.errors).toBeDefined()
    expect(result.errors!.some(e => e.includes('parse') || e.includes('JSON'))).toBe(true)
  })

  it('retries up to 3 times on validation failure', async () => {
    mockCallClaude
      .mockResolvedValueOnce(JSON.stringify({ theme: null }))
      .mockResolvedValueOnce(JSON.stringify({ theme: null }))
      .mockResolvedValueOnce(JSON.stringify({
        theme: { name: 'Retry Success', backgroundColor: '#000', entityColors: { player: '#0f0', enemy: '#f00', platform: '#666' }, description: 'test' },
        physics: { gravity: 0.8, friction: 0.9, playerSpeed: 5, jumpForce: -12 },
        player: { width: 32, height: 32, startX: 50, startY: 348 },
        rounds: [
          { roundNumber: 1, duration: 30, entities: [{ type: 'platform', x: 0, y: 380, width: 800, height: 20 }], goalX: 750, escalation: {} },
          { roundNumber: 2, duration: 25, entities: [{ type: 'platform', x: 0, y: 380, width: 800, height: 20 }], goalX: 750, escalation: { gravityMultiplier: 1.2, speedMultiplier: 1.2 } },
          { roundNumber: 3, duration: 20, entities: [{ type: 'platform', x: 0, y: 380, width: 800, height: 20 }], goalX: 750, escalation: { gravityMultiplier: 1.5, speedMultiplier: 1.5 } },
        ],
      }))

    const result = await generateDailyGame('platformer', 49)
    expect(result.success).toBe(true)
    expect(mockCallClaude).toHaveBeenCalledTimes(3)
  })

  it('fails after 3 retries', async () => {
    mockCallClaude.mockResolvedValue(JSON.stringify({ theme: null }))

    const result = await generateDailyGame('platformer', 50)
    expect(result.success).toBe(false)
    expect(mockCallClaude).toHaveBeenCalledTimes(3)
  })
})
