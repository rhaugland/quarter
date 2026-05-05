import { describe, it, expect } from 'vitest'
import type {
  GameConfig,
  Round,
  Entity,
  PhysicsConfig,
  PlayerConfig,
  ScoringConfig,
  TemplateId,
} from '@/engine/types'

describe('GameConfig types', () => {
  it('accepts a valid GameConfig', () => {
    const config: GameConfig = {
      id: 'quarter-47',
      dayNumber: 47,
      templateId: 'platformer',
      theme: {
        name: 'Rocket Cart Cats',
        backgroundColor: '#1a0a2e',
        entityColors: { player: '#00ff88', enemy: '#ff3366', platform: '#6644cc' },
        description: 'Navigate a rocket-powered shopping cart through a cat-filled obstacle course',
      },
      physics: {
        gravity: 0.8,
        friction: 0.9,
        playerSpeed: 5,
        jumpForce: -12,
      },
      player: {
        width: 32,
        height: 32,
        startX: 50,
        startY: 300,
      },
      rounds: [
        {
          roundNumber: 1,
          duration: 30,
          entities: [
            { type: 'platform', x: 0, y: 380, width: 800, height: 20 },
            { type: 'enemy', x: 400, y: 350, width: 24, height: 24, behavior: 'patrol', speed: 2 },
          ],
          goalX: 750,
          escalation: {},
        },
        {
          roundNumber: 2,
          duration: 25,
          entities: [
            { type: 'platform', x: 0, y: 380, width: 800, height: 20 },
            { type: 'platform', x: 200, y: 280, width: 100, height: 20 },
            { type: 'enemy', x: 300, y: 350, width: 24, height: 24, behavior: 'patrol', speed: 3 },
            { type: 'enemy', x: 600, y: 350, width: 24, height: 24, behavior: 'chase', speed: 2 },
          ],
          goalX: 750,
          escalation: { gravityMultiplier: 1.2, speedMultiplier: 1.3 },
        },
        {
          roundNumber: 3,
          duration: 20,
          entities: [
            { type: 'platform', x: 0, y: 380, width: 400, height: 20 },
            { type: 'platform', x: 500, y: 300, width: 100, height: 20 },
            { type: 'platform', x: 650, y: 220, width: 100, height: 20 },
            { type: 'enemy', x: 200, y: 350, width: 24, height: 24, behavior: 'chase', speed: 4 },
            { type: 'enemy', x: 500, y: 270, width: 24, height: 24, behavior: 'patrol', speed: 3 },
            { type: 'enemy', x: 700, y: 190, width: 24, height: 24, behavior: 'chase', speed: 3 },
          ],
          goalX: 750,
          escalation: { gravityMultiplier: 1.5, speedMultiplier: 1.5 },
        },
      ],
      scoring: {
        type: 'completion-time',
        bonusPerRound: 1000,
        timeBonusPerSecond: 50,
      },
    }

    expect(config.templateId).toBe('platformer')
    expect(config.rounds).toHaveLength(3)
    expect(config.rounds[2].escalation.gravityMultiplier).toBe(1.5)
  })
})
