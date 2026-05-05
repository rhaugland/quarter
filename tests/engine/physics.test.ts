import { describe, it, expect } from 'vitest'
import { applyGravity, applyMovement, checkCollision, resolveCollisions } from '@/engine/physics'
import type { GameState, EntityState, PhysicsConfig, InputState } from '@/engine/types'

describe('physics', () => {
  const defaultPhysics: PhysicsConfig = {
    gravity: 0.8,
    friction: 0.9,
    playerSpeed: 5,
    jumpForce: -12,
  }

  describe('applyGravity', () => {
    it('increases playerVelY by gravity each tick', () => {
      const state = { playerVelY: 0, isGrounded: false } as GameState
      const result = applyGravity(state, defaultPhysics)
      expect(result.playerVelY).toBe(0.8)
    })

    it('does not apply gravity when grounded', () => {
      const state = { playerVelY: 0, isGrounded: true } as GameState
      const result = applyGravity(state, defaultPhysics)
      expect(result.playerVelY).toBe(0)
    })
  })

  describe('applyMovement', () => {
    it('moves player right when right is pressed', () => {
      const state = { playerX: 100, playerY: 200, playerVelX: 0, playerVelY: 0, isGrounded: true } as GameState
      const input: InputState = { left: false, right: true, jump: false }
      const result = applyMovement(state, input, defaultPhysics)
      expect(result.playerX).toBeGreaterThan(100)
    })

    it('applies jump force when jump pressed and grounded', () => {
      const state = { playerX: 100, playerY: 200, playerVelX: 0, playerVelY: 0, isGrounded: true } as GameState
      const input: InputState = { left: false, right: false, jump: true }
      const result = applyMovement(state, input, defaultPhysics)
      expect(result.playerVelY).toBe(-12)
      expect(result.isGrounded).toBe(false)
    })

    it('does not double jump', () => {
      const state = { playerX: 100, playerY: 200, playerVelX: 0, playerVelY: -5, isGrounded: false } as GameState
      const input: InputState = { left: false, right: false, jump: true }
      const result = applyMovement(state, input, defaultPhysics)
      expect(result.playerVelY).toBe(-5)
    })
  })

  describe('checkCollision', () => {
    it('detects overlap between two rectangles', () => {
      const a = { x: 0, y: 0, width: 32, height: 32 }
      const b = { x: 16, y: 16, width: 32, height: 32 }
      expect(checkCollision(a, b)).toBe(true)
    })

    it('returns false when no overlap', () => {
      const a = { x: 0, y: 0, width: 32, height: 32 }
      const b = { x: 100, y: 100, width: 32, height: 32 }
      expect(checkCollision(a, b)).toBe(false)
    })
  })

  describe('resolveCollisions', () => {
    it('grounds player when landing on platform', () => {
      const state: GameState = {
        status: 'playing',
        currentRound: 0,
        score: 0,
        roundScores: [],
        playerX: 50,
        playerY: 358,
        playerVelX: 0,
        playerVelY: 5,
        isGrounded: false,
        entities: [
          { type: 'platform', x: 0, y: 380, width: 800, height: 20, active: true },
        ],
        timeRemaining: 30,
      }
      const player = { width: 32, height: 32 }
      const result = resolveCollisions(state, player)
      expect(result.isGrounded).toBe(true)
      expect(result.playerVelY).toBe(0)
      expect(result.playerY).toBe(348)
    })

    it('kills player when hitting enemy', () => {
      const state: GameState = {
        status: 'playing',
        currentRound: 0,
        score: 0,
        roundScores: [],
        playerX: 50,
        playerY: 50,
        playerVelX: 0,
        playerVelY: 0,
        isGrounded: false,
        entities: [
          { type: 'enemy', x: 50, y: 50, width: 24, height: 24, active: true },
        ],
        timeRemaining: 30,
      }
      const player = { width: 32, height: 32 }
      const result = resolveCollisions(state, player)
      expect(result.status).toBe('dead')
    })
  })
})
