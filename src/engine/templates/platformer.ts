import type { GameConfig, PhysicsConfig, ScoringConfig } from '../types'

export interface TemplateValidation {
  valid: boolean
  errors: string[]
}

export interface GameTemplate {
  id: string
  name: string
  defaultPhysics: PhysicsConfig
  scoring: ScoringConfig
  validate: (config: GameConfig) => TemplateValidation
}

export const platformerTemplate: GameTemplate = {
  id: 'platformer',
  name: 'Platformer',
  defaultPhysics: {
    gravity: 0.8,
    friction: 0.9,
    playerSpeed: 5,
    jumpForce: -12,
  },
  scoring: {
    type: 'completion-time',
    bonusPerRound: 1000,
    timeBonusPerSecond: 50,
  },
  validate(config: GameConfig): TemplateValidation {
    const errors: string[] = []

    for (const round of config.rounds) {
      const hasPlatform = round.entities.some(e => e.type === 'platform')
      if (!hasPlatform) {
        errors.push(`Round ${round.roundNumber} must have at least one platform`)
      }

      if (round.goalX === undefined) {
        errors.push(`Round ${round.roundNumber} must have a goalX`)
      }

      if (round.duration <= 0) {
        errors.push(`Round ${round.roundNumber} must have positive duration`)
      }
    }

    if (config.rounds.length !== 3) {
      errors.push('Must have exactly 3 rounds')
    }

    if (config.physics.gravity <= 0) {
      errors.push('Gravity must be positive')
    }

    if (config.physics.jumpForce >= 0) {
      errors.push('Jump force must be negative')
    }

    return { valid: errors.length === 0, errors }
  },
}
