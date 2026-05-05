import { describe, it, expect } from 'vitest'
import { platformerTemplate } from '@/engine/templates/platformer'
import type { GameConfig } from '@/engine/types'

describe('platformerTemplate', () => {
  it('has correct metadata', () => {
    expect(platformerTemplate.id).toBe('platformer')
    expect(platformerTemplate.name).toBe('Platformer')
  })

  it('provides default physics', () => {
    expect(platformerTemplate.defaultPhysics.gravity).toBeGreaterThan(0)
    expect(platformerTemplate.defaultPhysics.jumpForce).toBeLessThan(0)
  })

  it('provides scoring config', () => {
    expect(platformerTemplate.scoring.type).toBe('completion-time')
    expect(platformerTemplate.scoring.bonusPerRound).toBeGreaterThan(0)
  })

  it('validates a valid config as playable', () => {
    const config: GameConfig = {
      id: 'test',
      dayNumber: 1,
      templateId: 'platformer',
      theme: {
        name: 'Test',
        backgroundColor: '#000',
        entityColors: { player: '#0f0', enemy: '#f00', platform: '#666' },
        description: 'test',
      },
      physics: platformerTemplate.defaultPhysics,
      player: { width: 32, height: 32, startX: 50, startY: 300 },
      rounds: [
        { roundNumber: 1, duration: 30, entities: [{ type: 'platform', x: 0, y: 380, width: 800, height: 20 }], goalX: 750, escalation: {} },
        { roundNumber: 2, duration: 25, entities: [{ type: 'platform', x: 0, y: 380, width: 800, height: 20 }], goalX: 750, escalation: { gravityMultiplier: 1.2 } },
        { roundNumber: 3, duration: 20, entities: [{ type: 'platform', x: 0, y: 380, width: 800, height: 20 }], goalX: 750, escalation: { gravityMultiplier: 1.5 } },
      ],
      scoring: platformerTemplate.scoring,
    }
    const result = platformerTemplate.validate(config)
    expect(result.valid).toBe(true)
  })

  it('rejects config with no platforms', () => {
    const config: GameConfig = {
      id: 'test',
      dayNumber: 1,
      templateId: 'platformer',
      theme: {
        name: 'Test',
        backgroundColor: '#000',
        entityColors: { player: '#0f0', enemy: '#f00', platform: '#666' },
        description: 'test',
      },
      physics: platformerTemplate.defaultPhysics,
      player: { width: 32, height: 32, startX: 50, startY: 300 },
      rounds: [
        { roundNumber: 1, duration: 30, entities: [], goalX: 750, escalation: {} },
        { roundNumber: 2, duration: 25, entities: [], goalX: 750, escalation: {} },
        { roundNumber: 3, duration: 20, entities: [], goalX: 750, escalation: {} },
      ],
      scoring: platformerTemplate.scoring,
    }
    const result = platformerTemplate.validate(config)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Round 1 must have at least one platform')
  })
})
