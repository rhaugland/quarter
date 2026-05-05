import { describe, it, expect, beforeEach } from 'vitest'
import { GameRuntime } from '@/engine/runtime'
import type { GameConfig } from '@/engine/types'

const mockConfig: GameConfig = {
  id: 'test-1',
  dayNumber: 1,
  templateId: 'platformer',
  theme: {
    name: 'Test Game',
    backgroundColor: '#000',
    entityColors: { player: '#0f0', enemy: '#f00', platform: '#666' },
    description: 'A test game',
  },
  physics: { gravity: 0.8, friction: 0.9, playerSpeed: 5, jumpForce: -12 },
  player: { width: 32, height: 32, startX: 50, startY: 300 },
  rounds: [
    {
      roundNumber: 1,
      duration: 30,
      entities: [
        { type: 'platform', x: 0, y: 380, width: 800, height: 20 },
      ],
      goalX: 750,
      escalation: {},
    },
    {
      roundNumber: 2,
      duration: 25,
      entities: [
        { type: 'platform', x: 0, y: 380, width: 800, height: 20 },
      ],
      goalX: 750,
      escalation: { gravityMultiplier: 1.2 },
    },
    {
      roundNumber: 3,
      duration: 20,
      entities: [
        { type: 'platform', x: 0, y: 380, width: 800, height: 20 },
      ],
      goalX: 750,
      escalation: { gravityMultiplier: 1.5 },
    },
  ],
  scoring: { type: 'completion-time', bonusPerRound: 1000, timeBonusPerSecond: 50 },
}

describe('GameRuntime', () => {
  let runtime: GameRuntime

  beforeEach(() => {
    runtime = new GameRuntime(mockConfig)
  })

  it('initializes with idle state', () => {
    const state = runtime.getState()
    expect(state.status).toBe('idle')
    expect(state.currentRound).toBe(0)
    expect(state.score).toBe(0)
  })

  it('starts the game and sets status to playing', () => {
    runtime.start()
    const state = runtime.getState()
    expect(state.status).toBe('playing')
    expect(state.playerX).toBe(50)
    expect(state.playerY).toBe(300)
  })

  it('transitions to round-complete when player reaches goal', () => {
    runtime.start()
    runtime.setState({ ...runtime.getState(), playerX: 750 })
    runtime.tick()
    expect(runtime.getState().status).toBe('round-complete')
  })

  it('advances to next round', () => {
    runtime.start()
    runtime.setState({ ...runtime.getState(), playerX: 750 })
    runtime.tick()
    runtime.nextRound()
    expect(runtime.getState().currentRound).toBe(1)
    expect(runtime.getState().status).toBe('playing')
  })

  it('sets victory after completing round 3', () => {
    runtime.start()
    for (let i = 0; i < 3; i++) {
      runtime.setState({ ...runtime.getState(), playerX: 750 })
      runtime.tick()
      if (i < 2) runtime.nextRound()
    }
    expect(runtime.getState().status).toBe('victory')
  })

  it('applies escalation multipliers in later rounds', () => {
    runtime.start()
    runtime.setState({ ...runtime.getState(), playerX: 750 })
    runtime.tick()
    runtime.nextRound()
    const effectivePhysics = runtime.getEffectivePhysics()
    expect(effectivePhysics.gravity).toBeCloseTo(0.96)
  })
})
