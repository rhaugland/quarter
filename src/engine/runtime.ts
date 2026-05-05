import type { GameConfig, GameState, PhysicsConfig, InputState } from './types'
import { applyGravity, applyMovement, resolveCollisions } from './physics'
import { calculateRoundScore } from './scoring'
import { updateEnemies } from './enemies'

export class GameRuntime {
  private config: GameConfig
  private state: GameState

  constructor(config: GameConfig) {
    this.config = config
    this.state = this.createInitialState()
  }

  private createInitialState(): GameState {
    return {
      status: 'idle',
      currentRound: 0,
      score: 0,
      roundScores: [],
      playerX: this.config.player.startX,
      playerY: this.config.player.startY,
      playerVelX: 0,
      playerVelY: 0,
      entities: [],
      timeRemaining: this.config.rounds[0].duration,
      isGrounded: false,
    }
  }

  start(): void {
    this.state = {
      ...this.createInitialState(),
      status: 'playing',
      entities: this.config.rounds[0].entities.map(e => ({ ...e, active: true })),
    }
  }

  getState(): GameState {
    return this.state
  }

  setState(state: GameState): void {
    this.state = state
  }

  getEffectivePhysics(): PhysicsConfig {
    const round = this.config.rounds[this.state.currentRound]
    const escalation = round.escalation
    return {
      gravity: this.config.physics.gravity * (escalation.gravityMultiplier ?? 1),
      friction: this.config.physics.friction,
      playerSpeed: this.config.physics.playerSpeed * (escalation.speedMultiplier ?? 1),
      jumpForce: this.config.physics.jumpForce,
    }
  }

  tick(input?: InputState): void {
    if (this.state.status !== 'playing') return

    const physics = this.getEffectivePhysics()
    let newState = { ...this.state }

    // Apply input and movement
    if (input) {
      newState = applyMovement(newState, input, physics)
    }

    // Apply gravity
    newState = applyGravity(newState, physics)

    // Update enemies
    newState = {
      ...newState,
      entities: updateEnemies(
        newState.entities,
        { playerX: newState.playerX, playerY: newState.playerY },
        800
      ),
    }

    // Resolve collisions
    newState = resolveCollisions(newState, this.config.player)

    // Check if dead from collision
    if (newState.status === 'dead') {
      this.state = newState
      return
    }

    // Check boundary death (falling off screen)
    if (newState.playerY > 450 || newState.playerX < -50) {
      this.state = { ...newState, status: 'dead' }
      return
    }

    // Timer countdown
    newState = {
      ...newState,
      timeRemaining: newState.timeRemaining - (1 / 60),
    }
    if (newState.timeRemaining <= 0) {
      this.state = { ...newState, status: 'dead' }
      return
    }

    // Check goal
    const round = this.config.rounds[this.state.currentRound]
    if (round.goalX !== undefined && newState.playerX >= round.goalX) {
      const roundScore = calculateRoundScore(this.config.scoring, {
        timeRemaining: newState.timeRemaining,
        completed: true,
      })
      const roundScores = [...newState.roundScores, roundScore]

      if (this.state.currentRound >= 2) {
        newState = {
          ...newState,
          status: 'victory',
          roundScores,
          score: roundScores.reduce((a, b) => a + b, 0),
        }
      } else {
        newState = {
          ...newState,
          status: 'round-complete',
          roundScores,
          score: roundScores.reduce((a, b) => a + b, 0),
        }
      }
    }

    this.state = newState
  }

  nextRound(): void {
    if (this.state.status !== 'round-complete') return
    const nextRoundIndex = this.state.currentRound + 1
    if (nextRoundIndex > 2) return

    const round = this.config.rounds[nextRoundIndex]
    this.state = {
      ...this.state,
      status: 'playing',
      currentRound: nextRoundIndex,
      playerX: this.config.player.startX,
      playerY: this.config.player.startY,
      playerVelX: 0,
      playerVelY: 0,
      entities: round.entities.map(e => ({ ...e, active: true })),
      timeRemaining: round.duration,
      isGrounded: false,
    }
  }

  getConfig(): GameConfig {
    return this.config
  }
}
