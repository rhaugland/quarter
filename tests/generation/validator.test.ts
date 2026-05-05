import { describe, it, expect } from 'vitest'
import { validateGeneratedConfig } from '@/generation/validator'

describe('validateGeneratedConfig', () => {
  const validRaw = {
    theme: {
      name: 'Rocket Cart Cats',
      backgroundColor: '#1a0a2e',
      entityColors: { player: '#00ff88', enemy: '#ff3366', platform: '#6644cc' },
      description: 'Cats in space on carts',
    },
    physics: { gravity: 0.8, friction: 0.9, playerSpeed: 5, jumpForce: -12 },
    player: { width: 32, height: 32, startX: 50, startY: 348 },
    rounds: [
      { roundNumber: 1, duration: 30, entities: [{ type: 'platform', x: 0, y: 380, width: 800, height: 20 }], goalX: 750, escalation: {} },
      { roundNumber: 2, duration: 25, entities: [{ type: 'platform', x: 0, y: 380, width: 800, height: 20 }], goalX: 750, escalation: { gravityMultiplier: 1.2, speedMultiplier: 1.2 } },
      { roundNumber: 3, duration: 20, entities: [{ type: 'platform', x: 0, y: 380, width: 800, height: 20 }], goalX: 750, escalation: { gravityMultiplier: 1.5, speedMultiplier: 1.5 } },
    ],
  }

  it('accepts valid generated config', () => {
    const result = validateGeneratedConfig(validRaw, 'platformer')
    expect(result.valid).toBe(true)
    expect(result.config).toBeDefined()
    expect(result.config!.templateId).toBe('platformer')
  })

  it('rejects config with missing theme', () => {
    const invalid = { ...validRaw, theme: undefined }
    const result = validateGeneratedConfig(invalid, 'platformer')
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Missing theme')
  })

  it('rejects config with out-of-bounds physics', () => {
    const invalid = { ...validRaw, physics: { ...validRaw.physics, gravity: 50 } }
    const result = validateGeneratedConfig(invalid, 'platformer')
    expect(result.valid).toBe(false)
    expect(result.errors!.some(e => e.includes('gravity'))).toBe(true)
  })

  it('rejects config with missing rounds', () => {
    const invalid = { ...validRaw, rounds: [validRaw.rounds[0]] }
    const result = validateGeneratedConfig(invalid, 'platformer')
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Must have exactly 3 rounds')
  })

  it('rejects config with entities outside canvas', () => {
    const invalid = {
      ...validRaw,
      rounds: [
        { ...validRaw.rounds[0], entities: [{ type: 'platform', x: 900, y: 380, width: 100, height: 20 }] },
        validRaw.rounds[1],
        validRaw.rounds[2],
      ],
    }
    const result = validateGeneratedConfig(invalid, 'platformer')
    expect(result.valid).toBe(false)
    expect(result.errors!.some(e => e.includes('bounds'))).toBe(true)
  })
})
