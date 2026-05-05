import type { GameConfig, TemplateId } from '@/engine/types'
import { getTemplate } from '@/engine/templates'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 400

interface ValidationResult {
  valid: boolean
  config?: GameConfig
  errors?: string[]
}

export function validateGeneratedConfig(raw: any, templateId: TemplateId, dayNumber: number = 0): ValidationResult {
  const errors: string[] = []

  // Check required top-level fields
  if (!raw?.theme) errors.push('Missing theme')
  if (!raw?.physics) errors.push('Missing physics')
  if (!raw?.player) errors.push('Missing player')
  if (!raw?.rounds) errors.push('Missing rounds')

  if (errors.length > 0) return { valid: false, errors }

  // Validate physics bounds
  const p = raw.physics
  if (p.gravity < 0.1 || p.gravity > 5) errors.push('gravity out of bounds (0.1-5)')
  if (p.friction < 0.5 || p.friction > 1.0) errors.push('friction out of bounds (0.5-1.0)')
  if (p.playerSpeed < 1 || p.playerSpeed > 15) errors.push('playerSpeed out of bounds (1-15)')
  if (p.jumpForce > 0 || p.jumpForce < -25) errors.push('jumpForce out of bounds (-25 to 0)')

  // Validate rounds
  if (!Array.isArray(raw.rounds) || raw.rounds.length !== 3) {
    errors.push('Must have exactly 3 rounds')
    return { valid: false, errors }
  }

  for (const round of raw.rounds) {
    if (!Array.isArray(round.entities)) {
      errors.push(`Round ${round.roundNumber} missing entities array`)
      continue
    }

    for (const entity of round.entities) {
      if (entity.x < -50 || entity.x > CANVAS_WIDTH + 50) {
        errors.push(`Round ${round.roundNumber}: entity at x=${entity.x} out of bounds`)
      }
      if (entity.y < -50 || entity.y > CANVAS_HEIGHT + 50) {
        errors.push(`Round ${round.roundNumber}: entity at y=${entity.y} out of bounds`)
      }
    }
  }

  if (errors.length > 0) return { valid: false, errors }

  // Run template-specific validation
  const template = getTemplate(templateId)
  if (template) {
    const config: GameConfig = {
      id: `quarter-${dayNumber}`,
      dayNumber,
      templateId,
      theme: raw.theme,
      physics: raw.physics,
      player: raw.player,
      rounds: raw.rounds,
      scoring: template.scoring,
    }

    const templateResult = template.validate(config)
    if (!templateResult.valid) {
      return { valid: false, errors: templateResult.errors }
    }

    return { valid: true, config }
  }

  return { valid: false, errors: [`Unknown template: ${templateId}`] }
}
