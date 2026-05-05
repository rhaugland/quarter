import { describe, it, expect } from 'vitest'
import { GameRuntime } from '@/engine/runtime'
import { validateGeneratedConfig } from '@/generation/validator'
import { generateScoreCard } from '@/lib/share'
import type { GameConfig } from '@/engine/types'

describe('End-to-end game flow', () => {
  const testConfig: GameConfig = {
    id: 'quarter-1',
    dayNumber: 1,
    templateId: 'platformer',
    theme: {
      name: 'Disco Fridge Escape',
      backgroundColor: '#0d0221',
      entityColors: { player: '#00ff88', enemy: '#ff2266', platform: '#4a2c82' },
      description: 'Escape a sentient disco fridge',
    },
    physics: { gravity: 0.9, friction: 0.85, playerSpeed: 5, jumpForce: -13 },
    player: { width: 32, height: 32, startX: 50, startY: 330 },
    rounds: [
      {
        roundNumber: 1, duration: 30,
        entities: [
          { type: 'platform', x: 0, y: 370, width: 800, height: 30 },
          { type: 'enemy', x: 400, y: 346, width: 24, height: 24, behavior: 'patrol', speed: 2 },
        ],
        goalX: 750, escalation: {},
      },
      {
        roundNumber: 2, duration: 25,
        entities: [
          { type: 'platform', x: 0, y: 370, width: 400, height: 30 },
          { type: 'platform', x: 500, y: 300, width: 150, height: 20 },
          { type: 'platform', x: 680, y: 370, width: 120, height: 30 },
          { type: 'enemy', x: 300, y: 346, width: 24, height: 24, behavior: 'chase', speed: 2 },
        ],
        goalX: 750, escalation: { gravityMultiplier: 1.2, speedMultiplier: 1.2 },
      },
      {
        roundNumber: 3, duration: 20,
        entities: [
          { type: 'platform', x: 0, y: 370, width: 200, height: 30 },
          { type: 'platform', x: 300, y: 300, width: 100, height: 20 },
          { type: 'platform', x: 500, y: 240, width: 100, height: 20 },
          { type: 'platform', x: 680, y: 370, width: 120, height: 30 },
          { type: 'enemy', x: 150, y: 346, width: 24, height: 24, behavior: 'chase', speed: 3 },
          { type: 'enemy', x: 550, y: 216, width: 24, height: 24, behavior: 'patrol', speed: 4 },
        ],
        goalX: 750, escalation: { gravityMultiplier: 1.5, speedMultiplier: 1.5 },
      },
    ],
    scoring: { type: 'completion-time', bonusPerRound: 1000, timeBonusPerSecond: 50 },
  }

  it('config passes validation', () => {
    const raw = {
      theme: testConfig.theme,
      physics: testConfig.physics,
      player: testConfig.player,
      rounds: testConfig.rounds,
    }
    const result = validateGeneratedConfig(raw, 'platformer', 1)
    expect(result.valid).toBe(true)
  })

  it('full game can be played to victory', () => {
    const runtime = new GameRuntime(testConfig)
    runtime.start()

    for (let round = 0; round < 3; round++) {
      expect(runtime.getState().status).toBe('playing')
      runtime.setState({ ...runtime.getState(), playerX: 750 })
      runtime.tick()

      if (round < 2) {
        expect(runtime.getState().status).toBe('round-complete')
        runtime.nextRound()
      }
    }

    expect(runtime.getState().status).toBe('victory')
    expect(runtime.getState().score).toBeGreaterThan(0)
  })

  it('death produces shareable score card', () => {
    const runtime = new GameRuntime(testConfig)
    runtime.start()

    runtime.setState({ ...runtime.getState(), status: 'dead' })

    const card = generateScoreCard({
      dayNumber: testConfig.dayNumber,
      themeName: testConfig.theme.name,
      roundReached: runtime.getState().currentRound + 1,
      score: runtime.getState().score,
      status: 'dead',
    })

    expect(card).toContain('QUARTER #1')
    expect(card).toContain('Disco Fridge Escape')
  })
})
