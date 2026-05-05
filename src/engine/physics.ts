import type { GameState, PhysicsConfig, InputState, PlayerConfig } from './types'

export function applyGravity(state: GameState, physics: PhysicsConfig): GameState {
  if (state.isGrounded) return state
  return {
    ...state,
    playerVelY: state.playerVelY + physics.gravity,
  }
}

export function applyMovement(state: GameState, input: InputState, physics: PhysicsConfig): GameState {
  let velX = state.playerVelX
  let velY = state.playerVelY
  let isGrounded = state.isGrounded

  if (input.left) velX = -physics.playerSpeed
  else if (input.right) velX = physics.playerSpeed
  else velX = velX * physics.friction

  if (input.jump && isGrounded) {
    velY = physics.jumpForce
    isGrounded = false
  }

  const playerX = state.playerX + velX
  const playerY = state.playerY + velY

  return {
    ...state,
    playerX,
    playerY,
    playerVelX: velX,
    playerVelY: velY,
    isGrounded,
  }
}

interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export function checkCollision(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

export function resolveCollisions(state: GameState, player: Pick<PlayerConfig, 'width' | 'height'>): GameState {
  let result = { ...state }
  const playerRect: Rect = {
    x: result.playerX,
    y: result.playerY,
    width: player.width,
    height: player.height,
  }

  let grounded = false

  for (const entity of result.entities) {
    if (!entity.active) continue

    const entityRect: Rect = {
      x: entity.x,
      y: entity.y,
      width: entity.width,
      height: entity.height,
    }

    if (!checkCollision(playerRect, entityRect)) continue

    if (entity.type === 'enemy' || entity.type === 'obstacle') {
      result = { ...result, status: 'dead' }
      return result
    }

    if (entity.type === 'platform') {
      // Landing on top of platform (player was above, moving down)
      if (result.playerVelY >= 0 && playerRect.y + player.height > entityRect.y && playerRect.y < entityRect.y) {
        result = {
          ...result,
          playerY: entity.y - player.height,
          playerVelY: 0,
        }
        grounded = true
        playerRect.y = result.playerY
      }
    }
  }

  result = { ...result, isGrounded: grounded }
  return result
}
