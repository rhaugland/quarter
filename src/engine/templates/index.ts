import { platformerTemplate } from './platformer'
import type { GameTemplate } from './platformer'

export type { GameTemplate, TemplateValidation } from './platformer'

const templates: Record<string, GameTemplate> = {
  platformer: platformerTemplate,
}

export function getTemplate(id: string): GameTemplate | undefined {
  return templates[id]
}

export function getTemplateIds(): string[] {
  return Object.keys(templates)
}
